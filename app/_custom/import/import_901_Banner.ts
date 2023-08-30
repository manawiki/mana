import path from "path";

import Payload from "payload";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "banners";
const data = require("./import_files/" + "Banner" + ".json");
const idField = "banner_id";
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
		icon: result.icon?.name.replace(".png","").replace(".jpg",""),
	}

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	// relationFields["achievement_series"] = null;

	// Multi relation fields
	relationFields["featured_characters"] = null;
	relationFields["featured_light_cones"] = null;
	relationFields["banner_characters"] = null;
	relationFields["banner_light_cones"] = null;

	var fcEntry;

	var fieldname = "featured_characters";
	var idfield = "name";
	var collectionname = "characters";

	if (result[fieldname]?.length > 0) {
		fcEntry = await Promise.all(result[fieldname].map(async (t:any) => {
			const findEntry = await payload.find({
				collection: collectionname,
				where: {
					[idfield]: {
						equals: t[idfield],
					},
				}
			});
			if (findEntry?.docs?.[0]?.id) {
				return findEntry?.docs?.[0]?.id;
			}
			else {
				return null;
			}
	}));

		if (fcEntry.length > 0) {
			relationFields[fieldname] = fcEntry;
		}
	}
	

	var fieldname = "banner_characters";
	var idfield = "name";
	var collectionname = "characters";
	if (result[fieldname]?.length > 0) {
		fcEntry = await Promise.all(result[fieldname].map(async (t:any) => {
			const findEntry = await payload.find({
				collection: collectionname,
				where: {
					[idfield]: {
						equals: t[idfield],
					},
				}
			});
			if (findEntry?.docs?.[0]?.id) {
				return findEntry?.docs?.[0]?.id;
			}
			else {
				return null;
			}
	}));

		if (fcEntry.length > 0) {
			relationFields[fieldname] = fcEntry;
		}
	}

	var fieldname = "featured_light_cones";
	var idfield = "name";
	var collectionname = "lightCones";
	if (result[fieldname]?.length > 0) {
		fcEntry = await Promise.all(result[fieldname].map(async (t:any) => {
			const findEntry = await payload.find({
				collection: collectionname,
				where: {
					[idfield]: {
						equals: t[idfield],
					},
				}
			});
			if (findEntry?.docs?.[0]?.id) {
				return findEntry?.docs?.[0]?.id;
			}
			else {
				return null;
			}
	}));

		if (fcEntry.length > 0) {
			relationFields[fieldname] = fcEntry;
		}
	}


	var fieldname = "banner_light_cones";
	var idfield = "name";
	var collectionname = "lightCones";
	if (result[fieldname]?.length > 0) {
		fcEntry = await Promise.all(result[fieldname].map(async (t:any) => {
			const findEntry = await payload.find({
				collection: collectionname,
				where: {
					[idfield]: {
						equals: t[idfield],
					},
				}
			});
			if (findEntry?.docs?.[0]?.id) {
				return findEntry?.docs?.[0]?.id;
			}
			else {
				return null;
			}
	}));

		if (fcEntry.length > 0) {
			relationFields[fieldname] = fcEntry;
		}
	}
	console.log(relationFields[fieldname]);

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
			...relationFields,
			...iconImport,
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
