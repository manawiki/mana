import Payload from "payload";
import { _StarRarities } from "../collections/_star-rarities";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = "_star-rarities";
const data = require("./import_files/" + "_StarRarity" + ".json");
const idField = "drupal_tid";
// const siteId = "lKJ16E5IhH";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field

const forceOverwrite = false; // Force overwrite even if checksum is matching.

let payload = null as any;

const fieldConfig = _StarRarities.fields;

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
            },
         );
      },
   });
start();

async function getData() {
   let results = [];
   for (let item of data) {
      let r = await seedUploads(item).then((myResult) => 1);
      results.push(r);
   }
   return results;
}

// const getData = async () =>
//    Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {
   // For now exclude best_drop_locations field
   // delete result["best_drop_locations"];

   const idValue = result[idField].toString();

   var iconImport: any = {};
   fieldConfig
      .filter((fc) => fc.type == "upload")
      .map((f: any) => {
         iconImport[f.name] = result[f.name]?.name.replace(".png", "");
      });

   // Array Fields with relations:
   var arrayData: any = [];
   var arraysWithRelation = fieldConfig
      .filter((fc) => fc.type == "array")
      ?.map((f: any) => {
         return {
            name: f.name,
            fields: f.fields
               ?.filter((fac: any) => fac.type == "relationship")
               .map((fa: any) => {
                  return {
                     name: fa.name,
                     collection: fa.relationTo,
                     relationIdField: result[f.name]?.find((r) => r[fa.name])?.[
                        fa.name
                     ]
                        ? Object.keys(
                             result[f.name]?.find((r) => r[fa.name])?.[fa.name],
                          )?.[0]
                        : null, // Find Id field for if an entry has the relation
                     hasMany: fa.hasMany,
                  };
               }),
         };
      });

   var arrayRelationImport = {};
   var returnArrayElement;
   arraysWithRelation?.map((awr: any) => {
      if (result[awr.name]?.length > 0) {
         returnArrayElement = result[awr.name].map((resulte: any) => {
            var tempobj = { ...resulte };

            for (var arfield in awr.fields) {
               const arrayRelField = awr.fields[arfield];

               // Ignore empty objects
               if (JSON.stringify(resulte[arrayRelField.name]) == "{}") {
                  tempobj[arrayRelField.name] = null;
               }
               // For single relationship fields in an array
               else if (
                  !arrayRelField.hasMany &&
                  arrayRelField.relationIdField
               ) {
                  tempobj[arrayRelField.name] =
                     resulte?.[arrayRelField.name]?.[
                        arrayRelField.relationIdField
                     ].toString(); // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }

               // For multi relationship fields in an array
               else if (
                  arrayRelField.hasMany &&
                  arrayRelField.relationIdField &&
                  resulte?.[arrayRelField.name]?.[arrayRelField.relationIdField]
               ) {
                  tempobj[arrayRelField.name] = resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ]?.map((multirelation: any) => multirelation.toString()); // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }
            }
            return {
               ...tempobj,
            };
         });
         arrayRelationImport[awr.name] = returnArrayElement;
      }
   });

   // First Level Relation Fields (global)
   const relationFields = fieldConfig
      .filter((fc) => fc.type == "relationship" && !fc.hasMany)
      .map((f: any) => {
         return {
            name: f.name,
            collection: f.relationTo,
            relationIdField: result[f.name]
               ? Object.keys(result[f.name])?.[0]
               : null,
         };
      });

   // Check if Relation entry exists for each field and get ID
   // FIX: This always is the ID field for this entry - so we can just put the ID in without having to look up the prior entry. This way a relation can also be imported later and automatically link up.
   const relationArray = relationFields.map((field: any) => {
      if (result[field.name]) {
         return {
            [field.name]:
               result[field.name]?.[field.relationIdField]?.toString(),
         };
      } else {
         return null;
      }
   });

   var relationImport = {};

   for (var i = 0; i < relationArray?.length; i++) {
      if (relationArray[i]) {
         relationImport[Object.keys(relationArray[i])] =
            relationArray[i][Object.keys(relationArray[i])];
      }
   }

   // Check if entry exists
   const existingEntry = await payload.find({
      collection: collectionName,
      where: {
         [idField]: {
            equals: idValue,
         },
      },
   });

   // Update entry if exists
   if (existingEntry.docs.length > 0) {
      if (
         result.checksum == existingEntry.docs[0].checksum &&
         !forceOverwrite
      ) {
         console.log(`Entry "${idValue}" checksum match, SKIPPING.`);
      } else {
         console.log(
            `Entry "${idField}: ${idValue}" already exists. Overwriting data.`,
         );

         const custID = existingEntry.docs[0].id;

         var custData = {
            ...result,
            name: result?.name.toString(),
            ...iconImport,
            ...relationImport,
            ...arrayRelationImport,
         };

         const updateItemCustom = await payload.update({
            collection: collectionName,
            id: custID,
            data: custData,
         });
         console.log(`${idValue} Custom Entry updated!`);
      }
   }

   // Otherwise, create a new entry
   else {
      var custData = {
         ...result,
         id: result?.[idField],
         name: result?.name.toString(),
         ...iconImport,
         ...relationImport,
         ...arrayRelationImport,
      };

      const createItemCustom = await payload.create({
         collection: collectionName,
         data: custData,
      });

      console.log(`${idField}: ${idValue} Custom Data Import completed!`);
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
