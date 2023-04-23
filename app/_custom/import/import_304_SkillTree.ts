import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "skillTrees";
const data = require("./import_files/SkillTree.json");
const idField = "point_id";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      mongoURL: CUSTOM_MONGO_URL as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         getData().then(
            (result) => {
               process.exit(0);
            },
            (err) => {
               console.error(err);
               process.exit(-1);
            }
         );
      },
   });
start();

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {

	const idValue = result[idField];

	// Define Image fields (global)
	const iconImport = {
		icon: result.icon?.name.replace(".png",""),
		image_round_icon: result.image_round_icon?.name.replace(".png",""),
		image_action: result.image_action?.name.replace(".png",""),
		image_battle_detail: result.image_battle_detail?.name.replace(".png",""),
		image_full: result.image_full?.name.replace(".png",""),
		image_full_bg: result.image_full_bg?.name.replace(".png",""),
		image_full_front: result.image_full_front?.name.replace(".png",""),
	}
	
	// Unlock Materials array
	var matData: any = [];
	var levelCostImport: any = [];

	// Get unique list of Materials in full array
	// .split("data_key\":") -> Separate array by data key value
	// .map(a => a.replace(/}.*/,"")) -> Removes extraneous text after value
	// .slice(1) // Removes first element of array that has extraneous text
	// .filter((v,i,a) => a.indexOf(v) === i) -> Gets unique values
	const matList = JSON.stringify(result.level_up_cost)?.split("data_key\":").map(a => a.replace(/}.*/,"")).slice(1).filter((v,i,a) => a.indexOf(v) === i);

	if (matList?.length > 0) {
		matData = await Promise.all(matList.map(async (mat:any) => {
			const findMat = await payload.find({
				collection: "materials",
				where: {
					data_key: {
						equals: mat.toString(),
					}
				}
			});
			if (findMat?.docs?.[0]?.id) {
				return {
					data_key: [mat.toString()],
					id: findMat?.docs?.[0]?.id,
				};
			}
			else {
				return null;
			}
		}));

		levelCostImport = result.level_up_cost.map((l:any) => {
			const matQty = l.material_qty?.map((mat:any) => {
				const matId = matData.find((a:any) => a.data_key == mat.materials?.data_key)?.id;

				return {
					...mat,
					materials: matId,
				}
			});

			return {
				...l,
				material_qty: matQty,
			}
		});
	}

	// Relation Fields
	var relationFields: any = {};
	relationFields["character"] = null;
	relationFields["affected_skill"] = null;
	if (result.character?.character_id) {
		const charEntry = await payload.find({
			collection: "characters",
			where: {
				character_id: {
					equals: result.character.character_id,
				},
			}
		});

		if (charEntry?.docs?.[0]?.id) {
			relationFields["character"] = charEntry?.docs?.[0]?.id;
		}
	}

	if (result.affected_skill?.length > 0) {

		const traceEntry = await Promise.all(result.affected_skill.map(async (t:any) => {
			const findTrace = await payload.find({
				collection: "traces",
				where: {
					trace_id: {
						equals: t.trace_id,
					},
				}
			});
			if (findTrace?.docs?.[0]?.id) {
				return findTrace?.docs?.[0]?.id;
			}
			else {
				return null;
			}
	}));

		if (traceEntry.length > 0) {
			relationFields["affected_skill"] = traceEntry;
		}
	}
	
	// Check if entry exists
	const existingEntry = await payload.find({
		collection: collectionName,
		where: {
			[idField]: {
				equals: idValue,
			},
		}
	});
	
	// Update entry if exists
	if (existingEntry.docs.length > 0) {
		console.log(`Entry "${idField}: ${idValue}" already exists. Overwriting data.`);

		const custID = existingEntry.docs[0].id;

		var custData = {
			...result,
			...relationFields,
			...iconImport,
			level_up_cost: levelCostImport,
		};

		const updateItemCustom = await payload.update({
			collection: collectionName,
			id: custID,
			data: custData,
		});
		console.log(`${JSON.stringify(updateItemCustom)} Custom Entry updated!`);
	}

	// Otherwise, create a new entry
	else {
		
		var custData = {
			...result,
			id: result?.[idField],
			...relationFields,
			...iconImport,
			level_up_cost: levelCostImport,
		};

		const createItemCustom = await payload.create({
			collection: collectionName,
			data: custData,
		});
	   
	   	console.log(`${JSON.stringify(createItemCustom)} Custom Data Import completed!`);
	}
};

//Sleep function to limit speed, can remove if not needed
const sleep = (milliseconds: any) => {
   const start = new Date().getTime();
   for (let i = 0; i < 1e7; i += 1) {
      if (new Date().getTime() - start > milliseconds) {
         break;
      }
   }
};
