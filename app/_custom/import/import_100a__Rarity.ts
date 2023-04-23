import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = "_rarities";
const data = require("./import_files/" + "_Rarity" + ".json");
const idField = "data_key";
// const siteId = "lKJ16E5IhH";
const userId = "644068fa51c100f909f89e1e"; // norseftx@gmail.com User ID for author field

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
		icon_color: result.icon_color?.name.replace(".png",""),
		icon_active: result.icon_active?.name.replace(".png",""),
		icon_inactive: result.icon_inactive?.name.replace(".png",""),
		icon_damage_res: result.icon_damage_res?.name.replace(".png",""),
		icon_small: result.icon_small?.name.replace(".png",""),
		image_frame: result.image_frame?.name.replace(".png",""),
		icon_frame: result.icon_frame?.name.replace(".png",""),
		image_bg: result.image_bg?.name.replace(".png",""),
	}

	// Check if entry exists
	const existingEntry = await payload.find({
		collection: collectionName,
		where: {
			data_key: {
				equals: idValue,
			},
		}
	});
	
	// Update entry if exists
	if (existingEntry.docs.length > 0) {
		console.log(`Entry "${idField}: ${idValue}" already exists. Overwriting data.`);
		
		const custID = existingEntry.docs[0].id;

		// var baseData = {
		// 	...result,
		// 	collectionEntity: collectionName,
		// 	name: result?.name.toString(),
		// 	icon: result.icon?.name.replace(".png",""),
		// 	author: userId,
		// };

		// const updateItem = await payload.update({
		// 	collection: "entries",
		// 	id: baseID,
		// 	data: baseData,
		// });
		// sleep(50);
		// console.log(`${JSON.stringify(updateItem)} Entry updated!`);

		// const itemId = updateItem.id;

		var custData = {
			...result,
			// entry: itemId,
			name: result?.name.toString(),
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
		// var baseData = {
		// 	...result,
		// 	collectionEntity: collectionName,
		// 	name: result?.name.toString(),
		// 	icon: result.icon?.name.replace(".png",""),
		// 	author: userId,
		// };
	
		// const createItem = await payload.create({
		// 	collection: "entries",
		// 	data: baseData,
		// });
		// //Limit speed
		// sleep(50);
		// console.log(`${JSON.stringify(createItem)} Import completed!`);
		
		// const itemId = createItem.id;
		
		var custData = {
			...result,
		 	id: result?.[idField],
			name: result?.name.toString(),
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
