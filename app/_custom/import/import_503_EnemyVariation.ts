import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "enemyVariations";
const data = require("./import_files/EnemyVariation.json");
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
	const tempEnemyStatusRes = await payload.find({
		collection: "_enemyStatusRes",
		where: {
			id: {
			exists: true
			},
		},
		limit: 100,
	});
	const tempElement = await payload.find({
		collection: "_elements",
		where: {
			id: {
			exists: true
			},
		},
		limit: 100,
	});

	enemyStatusRes = tempEnemyStatusRes.docs;
	element = tempElement.docs;

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

	// =======================
	// Unlock Materials array
	// =======================
	var matData: any = [];
	var dropList: any = [];

	// Get unique list of Materials in full array
	// .split("data_key\":") -> Separate array by data key value
	// .map(a => a.replace(/}.*/,"")) -> Removes extraneous text after value
	// .slice(1) // Removes first element of array that has extraneous text
	// .filter((v,i,a) => a.indexOf(v) === i) -> Gets unique values
	const matList = JSON.stringify(result.rewards)?.split("data_key\":").map(a => a.replace(/}.*/,"")).slice(1).filter((v,i,a) => a.indexOf(v) === i);

	

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

		dropList = result.rewards.map((l:any) => {
			const drops = l.drop_list?.map((mat:any) => {
				const matId = matData.find((a:any) => a.data_key == mat.data_key)?.id;
				return matId;
			});

			return {
				...l,
				drop_list: drops,
			}
		});
	}
	// =======================
	// =======================

	// =======================
	// Resistance Value Arrays
	// =======================

	
	var resistanceFields: any = {};

	resistanceFields["debuff_resist"] = null;
	resistanceFields["damage_resist"] = null;

	if (result.debuff_resist?.length > 0) {
		const dresEntry = result.debuff_resist.map((d:any) => {
			const findStatus = enemyStatusRes?.find((a:any) => a.data_key == d.debuff.data_key)?.id;

			return {
				...d,
				debuff: findStatus,
			}
		});

		resistanceFields["debuff_resist"] = dresEntry;
	}

	if (result.damage_resist?.length > 0) {
		const dgresEntry = result.damage_resist.map((d:any) => {
			const findElem = element?.find((a:any) => a.data_key == d.element.data_key)?.id;

			return {
				...d,
				element: findElem,
			}
		});

		resistanceFields["damage_resist"] = dgresEntry;
	}


	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["monster_template"] = null;

	// Multi relation fields
	relationFields["skill_list"] = null;
	relationFields["elemental_weaknesses"] = null;

	var fieldName = "monster_template";
	var idName = "data_key";
	var collName = "enemies";
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

	if (result.skill_list?.length > 0) {
		var skillEntry = await Promise.all(result.skill_list.map(async (t:any) => {
			const findSkill = await payload.find({
				collection: "enemySkills",
				where: {
					data_key: {
						equals: t.data_key,
					},
				}
			});
			if (findSkill?.docs?.[0]?.id) {
				return findSkill?.docs?.[0]?.id;
			}
			else {
				return null;
			}
		}));

		// NOTE Some skills have no name entry (?)

		if (skillEntry.length > 0) {
			relationFields["skill_list"] = skillEntry;
		}
	}

	if (result.elemental_weaknesses?.length > 0) {
		const elementEntry = await Promise.all(result.elemental_weaknesses.map(async (t:any) => {
			const findElement = element.find((a:any) => a.data_key == t.data_key);
			if (findElement?.id) {
				return findElement?.id;
			}
			else {
				return null;
			}
		}));

		if (elementEntry.length > 0) {
			relationFields["elemental_weaknesses"] = elementEntry;
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
			...relationFields,
			...resistanceFields,
			...iconImport,
			rewards: dropList,
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
			...resistanceFields,
			...iconImport,
			rewards: dropList,
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
