import path from "path";

import Payload from "payload";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "relicSets";
const data = require("./import_files/RelicSet.json");
const idField = "relicset_id";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field

let payload = null as any;

var statTypes: any;

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

const getData = async () => {

	// Get _statTypes arrays to populate later relations
	const tempStatTypes = await payload.find({
		collection: "_statTypes",
		where: {
			id: {
			exists: true
			},
		},
		limit: 200,
	});

	statTypes = tempStatTypes.docs;

   return Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

}

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

	// ====================================
	// ====================================
	// Nested Relation Fields
	// ====================================

	var relationFields: any = {};
	// Nested relation fields
	relationFields["set_effect"] = result.set_effect.map((eff:any) => {
		var p_out = eff.property_list?.map((prop:any) => {

			const statEntry = statTypes?.find((a:any) => a.data_key == prop.stattype?.data_key);

			return {
				stattype: statEntry?.id,
				value: prop.value
			}
		});

		return { ...eff, property_list: p_out}
	});
	

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
			...iconImport,
			...relationFields,
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
			...iconImport,
			...relationFields,
			id: result?.[idField],
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
