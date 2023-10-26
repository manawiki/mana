import path from "path";

import Payload from "payload";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const collectionName = "recipes";
const data = require("./import_files/" + "Recipe" + ".json");
const idField = "data_key";
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
		icon_small: result.icon_small?.name.replace(".png",""),
		icon_class: result.icon_class?.name.replace(".png",""),
	}

	// ---------------------------
	// ---------------------------
	// Unlock Materials array
	// ---------------------------
	var matData: any = [];
	var matQtyImport: any = {};
	// Material Unlock Fields
	matQtyImport["material_cost"] = null;

	// Get unique list of Materials in full array
	// .split("data_key\":") -> Separate array by data key value
	// .map(a => a.replace(/}.*/,"")) -> Removes extraneous text after value
	// .slice(1) // Removes first element of array that has extraneous text
	// .filter((v,i,a) => a.indexOf(v) === i) -> Gets unique values
	const allmatjson = JSON.stringify(result.material_cost);
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

	var fieldName = "material_cost";

	if (result[fieldName]?.length > 0) {
		var matcosttemp = result[fieldName]?.map((l:any) => {
			const matId = matData.find((a:any) => a.data_key == l.materials?.data_key)?.id;
			return {
				...l,
				materials: matId,
			}
		});
	}
	matQtyImport[fieldName] = matcosttemp;

	// ====================================
	// ====================================
	// Relation Fields
	// ====================================

	var relationFields: any = {};
	// Single relation fields
	relationFields["result_item"] = null;
	relationFields["recipe_type"] = null;

	var fieldName = "result_item";
	var idName = "data_key";
	var collName = "materials";
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
	var fieldName = "recipe_type";
	var idName = "data_key";
	var collName = "_recipeTypes";
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

	// Multi relation fields
	relationFields["relic_list"] = null;
	relationFields["special_material_cost"] = null;


	var fieldName = "relic_list";
	var idName = "relic_id";
	var collName = "relics";
	if (result[fieldName]?.length > 0) {
		const traceEntry = await Promise.all(result[fieldName].map(async (t:any) => {
			const findTrace = await payload.find({
				collection: collName,
				where: {
					[idName]: {
						equals: t[idName],
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
			relationFields[fieldName] = traceEntry;
		}
	}

	var fieldName = "special_material_cost";
	var idName = "data_key";
	var collName = "materials";
	if (result[fieldName]?.length > 0) {
		const traceEntry = await Promise.all(result[fieldName].map(async (t:any) => {
			const findTrace = await payload.find({
				collection: collName,
				where: {
					[idName]: {
						equals: t[idName],
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
			relationFields[fieldName] = traceEntry;
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
			...iconImport,
			...relationFields,
			...matQtyImport,
		};

		const updateItemCustom = await payload.update({
			collection: collectionName,
			id: custID,
			data: custData,
		});
		console.log(`${custID} Custom Entry updated!`);
	}

	// Otherwise, create a new entry
	else {
		
		var custData = {
			...result,
			...iconImport,
			...relationFields,
			...matQtyImport,
			id: result?.[idField],
		};

		const createItemCustom = await payload.create({
			collection: collectionName,
			data: custData,
		});
	   
	   	console.log(`${result?.[idField]} Custom Data Import completed!`);
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
