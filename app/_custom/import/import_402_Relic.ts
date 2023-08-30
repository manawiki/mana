import path from "path";

import Payload from "payload";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "relics";
const data = require("./import_files/Relic.json");
const idField = "relic_id";
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
	var returnItemList: any = [];
	var rewardMaxListImport: any = [];
	var promotionCostImport: any = [];

	// Get unique list of Materials in full array
	// .split("data_key\":") -> Separate array by data key value
	// .map(a => a.replace(/}.*/,"")) -> Removes extraneous text after value
	// .slice(1) // Removes first element of array that has extraneous text
	// .filter((v,i,a) => a.indexOf(v) === i) -> Gets unique values
	const allmatjson = JSON.stringify(result.return_item_list);
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


	if (result.return_item_list.length > 0) {
		returnItemList = result.return_item_list.map((l:any) => {
			const matId = matData.find((a:any) => a.data_key == l.materials?.data_key)?.id;
			return {
				...l,
				materials: matId,
			}
		});
	}


	var matQtyImport = {
		return_item_list: returnItemList,
	}

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["rarity"] = null;
	relationFields["relicset_id"] = null;

	// Multi relation fields
	// relationFields["eidolons"] = null;

	// Multi-same ID relation fields
	relationFields["mainstat_group"] = null;
	relationFields["substat_group"] = null;

	var fieldName = "rarity";
	var idName = "data_key";
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
	var fieldName = "relicset_id";
	var idName = "relicset_id";
	var collName = "relicSets";
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

	// For substats/mainstats, need to get an array of IDs for all _relicStat entries with a matching ID
	var fieldName = "mainstat_group";
	var idName = "data_key";
	var collName = "_relicStats";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			},
			limit: 30,
		});

		if (relEntry?.docs?.length > 0) {
			relationFields[fieldName] = relEntry?.docs?.map((stat:any) => stat?.id);
		}
	}

	var fieldName = "substat_group";
	var idName = "data_key";
	var collName = "_relicStats";
	if (result[fieldName]?.[idName]) {
		const relEntry = await payload.find({
			collection: collName,
			where: {
				[idName]: {
					equals: result[fieldName]?.[idName],
				},
			},
			limit: 30,
		});

		if (relEntry?.docs?.length > 0) {
			relationFields[fieldName] = relEntry?.docs?.map((stat:any) => stat?.id);
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
