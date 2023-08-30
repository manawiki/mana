import path from "path";

import Payload from "payload";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "enemies";
const data = require("./import_files/Enemy.json");
const idField = "data_key";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field

let payload = null as any;

var enemyStatusRes: any;
var element: any;


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
	// Get _enemyStatusRes, _element arrays to populate later relations
	// const tempEnemyStatusRes = await payload.find({
	// 	collection: "_enemyStatusRes",
	// 	where: {
	// 		id: {
	// 		exists: true
	// 		},
	// 	},
	// 	limit: 100,
	// });
	// const tempElement = await payload.find({
	// 	collection: "_elements",
	// 	where: {
	// 		id: {
	// 		exists: true
	// 		},
	// 	},
	// 	limit: 100,
	// });

	// enemyStatusRes = tempEnemyStatusRes.docs;
	// element = tempElement.docs;

 	return Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading
}


//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {

	const idValue = result[idField];
	
	// Define Image fields (global)
	const iconImport = {
		icon: result.icon?.name.replace(".png",""),
		image_full: result.image_full?.name.replace(".png",""),
	}

	

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["camp"] = null;

	// Multi relation fields
	// relationFields["skill_list"] = null;

	// Manual Multi relation fields with known ID
	relationFields["enemy_variations"] = null;

	var fieldName = "camp";
	var idName = "data_key";
	var collName = "_enemyCamps";
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

	var fieldName = "enemy_variations";
	var idName = "data_key";
	var varEntry = result?.enemy_variations?.map((a:any) => a[idName].toString());
	if (varEntry.length > 0) {
		relationFields[fieldName] = varEntry;
	}

	// if (result.skill_list?.length > 0) {
	// 	var skillEntry = await Promise.all(result.skill_list.map(async (t:any) => {
	// 		const findSkill = await payload.find({
	// 			collection: "enemySkills",
	// 			where: {
	// 				data_key: {
	// 					equals: t.data_key,
	// 				},
	// 			}
	// 		});
	// 		if (findSkill?.docs?.[0]?.id) {
	// 			return findSkill?.docs?.[0]?.id;
	// 		}
	// 		else {
	// 			return null;
	// 		}
	// 	}));

	// 	// NOTE Some skills have no name entry (?)

	// 	if (skillEntry.length > 0) {
	// 		relationFields["skill_list"] = skillEntry;
	// 	}
	// }

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
		console.log(`${JSON.stringify(idValue)} Custom Entry updated!`);
	}

	// Otherwise, create a new entry
	else {
		
		var custData = {
			...result,
			id: result?.[idField],
			...relationFields,
			...iconImport,
		};

		const createItemCustom = await payload.create({
			collection: collectionName,
			data: custData,
		});
	   
	   	console.log(`${JSON.stringify(result?.[idField])} Custom Data Import completed!`);
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
