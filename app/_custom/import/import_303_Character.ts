import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "characters";
const data = require("./import_files/Character.json");
const idField = "character_id";
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
		image_draw: result.image_draw?.name.replace(".png",""),
	}
	
	// Unlock Materials array
	var matData: any = [];
	var rewardListImport: any = [];
	var rewardMaxListImport: any = [];
	var promotionCostImport: any = [];

	// Get unique list of Materials in full array
	// .split("data_key\":") -> Separate array by data key value
	// .map(a => a.replace(/}.*/,"")) -> Removes extraneous text after value
	// .slice(1) // Removes first element of array that has extraneous text
	// .filter((v,i,a) => a.indexOf(v) === i) -> Gets unique values
	const allmatjson = JSON.stringify(result.reward_list) + JSON.stringify(result.reward_max_list) + JSON.stringify(result.promotion_cost);
	const matList = allmatjson?.split("data_key\":").map(a => a.replace(/}.*/,"")).slice(1).filter((v,i,a) => a.indexOf(v) === i);

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
	}

	
	if (result.reward_list.length > 0) {
		rewardListImport = result.reward_list.map((l:any) => {
			const matId = l.materials?.data_key.toString(); // matData.find((a:any) => a.data_key == l.materials?.data_key)?.id;
			return {
				...l,
				materials: matId,
			}
		});
	}
	
	if (result.reward_max_list.length > 0) {
		rewardMaxListImport = result.reward_max_list.map((l:any) => {
			const matId = matData.find((a:any) => a?.data_key == l.materials?.data_key)?.id;
			return {
				...l,
				materials: matId,
			}
		});
	}
	
	if (result.promotion_cost.length > 0) {
		promotionCostImport = result.promotion_cost.map((l:any) => {
			const matQty = l.material_qty?.map((mat:any) => {
				const matId = mat.materials?.data_key.toString(); // matData.find((a:any) => a.data_key == mat.materials?.data_key)?.id;
	
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
	

	var matQtyImport = {
		reward_list: rewardListImport,
		reward_max_list: rewardMaxListImport,
		promotion_cost: promotionCostImport,
	}

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["rarity"] = null;
	relationFields["element"] = null;
	relationFields["path"] = null;

	// Multi relation fields
	relationFields["eidolons"] = null;
	relationFields["traces"] = null;

	var fieldName = "rarity";
	var idName = "name";
	var collName = "_rarities";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			}
		});

		if (relEntry?.docs?.[0]?.id) {
			relationFields[fieldName] = relEntry?.docs?.[0]?.id;
		}
	}
	var fieldName = "element";
	var idName = "data_key";
	var collName = "_elements";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			}
		});

		if (relEntry?.docs?.[0]?.id) {
			relationFields[fieldName] = relEntry?.docs?.[0]?.id;
		}
	}
	var fieldName = "path";
	var idName = "data_key";
	var collName = "_paths";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			}
		});

		if (relEntry?.docs?.[0]?.id) {
			relationFields[fieldName] = relEntry?.docs?.[0]?.id;
		}
	}

	if (result.traces?.length > 0) {
		const traceEntry = await Promise.all(result.traces.map(async (t:any) => {
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
				return t.trace_id.toString();
			}
	}));

		if (traceEntry.length > 0) {
			relationFields["traces"] = traceEntry;
		}
	}

	if (result.eidolons?.length > 0) {
		const traceEntry = await Promise.all(result.eidolons.map(async (t:any) => {
			const findTrace = await payload.find({
				collection: "eidolons",
				where: {
					eidolon_id: {
						equals: t.eidolon_id,
					},
				}
			});
			if (findTrace?.docs?.[0]?.id) {
				return findTrace?.docs?.[0]?.id;
			}
			else {
				return t.eidolon_id.toString();
			}
	}));

		if (traceEntry.length > 0) {
			relationFields["eidolons"] = traceEntry;
		}
	}

	// ====================================
	// End of Relation Fields
	// ====================================
	// ====================================
	
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
			...matQtyImport,
			...relationFields,
			...iconImport,
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
			...matQtyImport,
			...relationFields,
			...iconImport,
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
