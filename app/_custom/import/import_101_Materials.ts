import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = "materials";
const data = require("./import_files/" + "Item" + ".json");
const idField = "data_key";
const siteId = "lKJ16E5IhH";
const userId = "63fec4372464d0e4c5c316e7"; // NorseFTX@gamepress.gg User ID for author field

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      mongoURL: MONGO_URL as any,
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

	const idValue = result[idField].toString();

	// Define Image fields (global)
	const iconImport = {
		icon_color: siteId + "_" + result.icon_color?.name.replace(".png",""),
		icon_active: siteId + "_" + result.icon_active?.name.replace(".png",""),
		icon_inactive: siteId + "_" + result.icon_inactive?.name.replace(".png",""),
		icon_damage_res: siteId + "_" + result.icon_damage_res?.name.replace(".png",""),
		icon_small: siteId + "_" + result.icon_small?.name.replace(".png",""),
		image_frame: siteId + "_" + result.image_frame?.name.replace(".png",""),
		icon_frame: siteId + "_" + result.icon_frame?.name.replace(".png",""),
		image_bg: siteId + "_" + result.image_bg?.name.replace(".png",""),
	}

	// Relation Fields (global)
	const relationFields = [
		{ name: "itemtype", collection: "_itemType", },
		{ name: "rarity", collection: "_rarity", }
	];
	
	// Check if Relation entry exists for each field and get ID
	const relationIds = relationFields.map(async (field:any) => {
		if (result[field.name]) {
			const existingRelation =  await payload.find({
				collection: field.collection + "-" + siteId,
				where: {
					data_key: {
						equals: result[field.name].data_key,
					}
				}
			});
			return {
				[field.name]:  existingRelation.docs?.[0]?.id,
			};
		}
		else {
			return null;
		}
	});

	const relationArray = await Promise.all(relationIds);

	var relationImport = {};

	for (var i = 0; i < relationArray?.length; i++) {
		if (relationArray[i]) {
			relationImport[Object.keys(relationArray[i])] = relationArray[i][Object.keys(relationArray[i])];
		}
	}

	// Check if entry exists
	const existingEntry = await payload.find({
		collection: collectionName + "-" + siteId,
		where: {
			data_key: {
				equals: idValue,
			},
		}
	});
	
	// Update entry if exists
	if (existingEntry.docs.length > 0) {
		console.log(`Entry "${idField}: ${idValue}" already exists. Overwriting data.`);
		
		const baseID = existingEntry.docs[0].entry.id;
		const custID = existingEntry.docs[0].id;

		var baseData = {
			...result,
			collectionEntity: collectionName + "-" + siteId,
			name: result?.name.toString(),
			icon: siteId + "_" + result.icon?.name.replace(".png",""),
			author: userId,
		};

		const updateItem = await payload.update({
			collection: "entries",
			id: baseID,
			data: baseData,
		});
		sleep(50);
		console.log(`${JSON.stringify(updateItem)} Entry updated!`);

		const itemId = updateItem.id;

		var custData = {
			...result,
			entry: itemId,
			id: collectionName + "-" + itemId,
			name: result?.name.toString(),
			...iconImport,
			...relationImport,
		};



		const updateItemCustom = await payload.update({
			collection: collectionName + "-" + siteId,
			id: custID,
			data: custData,
		});
		console.log(`${JSON.stringify(updateItemCustom)} Custom Entry updated!`);
	}

	// Otherwise, create a new entry
	else {
		var baseData = {
			...result,
			collectionEntity: collectionName + "-" + siteId,
			name: result?.name.toString(),
			icon: siteId + "_" + result.icon?.name.replace(".png",""),
			author: userId,
		};
	
		const createItem = await payload.create({
			collection: "entries",
			data: baseData,
		});
		//Limit speed
		sleep(50);
		console.log(`${JSON.stringify(createItem)} Import completed!`);
		
		const itemId = createItem.id;
		
		var custData = {
			...result,
			entry: itemId,
			id: collectionName + "-" + itemId,
			name: result?.name.toString(),
			...iconImport,
			...relationImport,
		};

		const createItemCustom = await payload.create({
			collection: collectionName + "-" + siteId,
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
