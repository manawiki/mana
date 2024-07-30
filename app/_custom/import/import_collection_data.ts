// General Importer that accepts arguments!

// usage: in package.json, add the following script:
// "import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

// In the command line of the root directory, the following command can be run:
// pnpm import_collection_data collection,filename,idname,sync,overwrite
// ------------- Examples -------------
// collection:COLLECTIONSLUG  [Required]
// filename:FILE.json  [Required]
// idname:IDFIELDNAME  [Required]
// sync:false // TRUE = Import synchronously, one at a time. FALSE = Async.
// overwrite:false // TRUE = Force overwrite, even with matching checksum. FALSE = ignores matching checksum imports.
// -------------- PNPM Sample ----------------
// pnpm import_collection_data collection:materials,filename:Material.json,idname:data_key,sync:false,overwrite:false
// -------------- Notes ---------------
// - sync option needs to be used if field hooks used in a collection require the hooks to be executed in series, since otherwise they are by default executed simultaneously (example: A collection has a hook that updates another collection such that it has a list of all entries related to that collection, such as a list of all characters that use an item)
// - Generally overwrite does not need to be defined, but can be set to true for testing purposes.

// ==================
// Notes about the format of FILE.json
// ==================
// - Check the import_files/readme.md file for some formatting rules on relationship fields, etc.!
// - FILE.json MUST contain the following fields:
//   - ID (defined in idname argument)
//   - name
// - All other field names should match the collection definition field names.

const args = process.argv.slice(2)?.[0]?.split(",");

// Parse Arguments
const collection = args
   ?.find((a) => a.split(":")?.[0] == "collection")
   ?.split(":")?.[1];
const filename = args
   ?.find((a) => a.split(":")?.[0] == "filename")
   ?.split(":")?.[1];
const idname = args
   ?.find((a) => a.split(":")?.[0] == "idname")
   ?.split(":")?.[1];
const sync =
   args?.find((a) => a.split(":")?.[0] == "sync")?.split(":")?.[1] === "true";
const overwrite =
   args?.find((a) => a.split(":")?.[0] == "overwrite")?.split(":")?.[1] ===
   "true";

if (!collection || !filename || !idname) {
   console.log(
      "Arguments for collection:COLLECTIONSLUG, filename:FILE.json, idname:IDFIELDNAME are required!\nPlease enter arguments after pnpm import_collection_data.\n\nUse format:\npnpm import_collection_data collection:materials,filename:Material.json,idname:data_key,sync:false,overwrite:false",
   );
   process.exit(-1);
}

import Payload from "payload";
// import { Materials } from "../collections/materials";

const CollectionData = require("../collections/" + collection + ".ts");
const Materials = CollectionData[Object.keys(CollectionData)[0]];

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = collection;
const data = require("./import_files/" + filename);
const idField = idname;
// const siteId = "lKJ16E5IhH";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field
const importsync = sync ?? false;

const forceOverwrite = overwrite ?? false; // Force overwrite even if checksum is matching.

let payload = null as any;

const fieldConfig = Materials.fields;

// Flatten all collapsible data to root level! Uses a recursive function.
function flattenCollapsibleFields(fconfig) {
   var allconfig = fconfig;
   fconfig
      .filter((fc) => fc.type == "collapsible")
      ?.map((collfield) => {
         allconfig.push(...flattenCollapsibleFields(collfield.fields));
      });
   allconfig = allconfig.filter((obj) => obj.type != "collapsible");
   return allconfig;
}
var flatFields = flattenCollapsibleFields(fieldConfig);
// Filter out unique ones, the recursive makes duplicates currently, eyes emoji.
flatFields = flatFields.filter(
   (e, i) => flatFields.findIndex((a) => a["name"] === e["name"]) === i,
);

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      // mongoURL: CUSTOM_MONGO_URL as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         if (importsync) {
            getDataSync().then(
               (result) => {
                  process.exit(0);
               },
               (err) => {
                  console.error(err);
                  process.exit(-1);
               },
            );
         } else {
            getData().then(
               (result) => {
                  process.exit(0);
               },
               (err) => {
                  console.error(err);
                  process.exit(-1);
               },
            );
         }
      },
   });
start();

async function getDataSync() {
   let results = [];
   for (let item of data) {
      let r = await seedUploads(item).then((myResult) => 1);
      results.push(r);
   }
   return results;
}

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {
   // For now exclude best_drop_locations field
   // delete result["best_drop_locations"];

   if (!result[idField]) {
      console.log(
         "ERROR: Field idname not found. Make sure the idname argument in pnpm import_collection_data is correct!",
      );
   }
   const idValue = result[idField].toString();

   var iconImport: any = {};
   flatFields
      .filter((fc) => fc.type == "upload")
      .map((f: any) => {
         iconImport[f.name] = result[f.name]?.name.replace(".png", "");
      });

   // Array Fields with relations:
   var arraysWithRelation = flatFields
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
                     relationIdField: result[f.name]?.find(
                        (r: any) => r[fa.name],
                     )?.[fa.name]
                        ? Object.keys(
                             result[f.name]?.find((r: any) => r[fa.name])?.[
                                fa.name
                             ],
                          )?.[0]
                        : null, // Find Id field for if an entry has the relation
                     hasMany: fa.hasMany,
                  };
               }),
         };
      });

   var arrayRelationImport = {};
   var returnArrayElement = [];
   arraysWithRelation?.map((awr) => {
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
                  arrayRelField.relationIdField &&
                  !Array.isArray(arrayRelField.collection)
               ) {
                  tempobj[arrayRelField.name] =
                     resulte?.[arrayRelField.name]?.[
                        arrayRelField.relationIdField
                     ].toString(); // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }
               // For single relationship fields in an array, POLYMORPHIC
               else if (
                  !arrayRelField.hasMany &&
                  arrayRelField.relationIdField &&
                  resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ] &&
                  Array.isArray(arrayRelField.collection)
               ) {
                  if (
                     !resulte?.[arrayRelField.name]?.[
                        arrayRelField.relationIdField
                     ]?.relationTo
                  ) {
                     console.log(
                        "ERROR: Polymorphic Relation Fields require 'relationTo' and 'value' key values! See /import_files/readme.md for details",
                     );
                  }

                  tempobj[arrayRelField.name] = {
                     relationTo:
                        resulte?.[arrayRelField.name]?.[
                           arrayRelField.relationIdField
                        ].relationTo,
                     value: resulte?.[arrayRelField.name]?.[
                        arrayRelField.relationIdField
                     ].value.toString(),
                  }; // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }

               // For multi relationship fields in an array, NON Polymorphic
               else if (
                  arrayRelField.hasMany &&
                  arrayRelField.relationIdField &&
                  resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ] &&
                  !Array.isArray(arrayRelField.collection)
               ) {
                  tempobj[arrayRelField.name] = resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ]?.map((multirelation: any) => multirelation.toString()); // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }

               // For multi relationship fields in an array, POLYMORPHIC
               else if (
                  arrayRelField.hasMany &&
                  arrayRelField.relationIdField &&
                  resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ] &&
                  Array.isArray(arrayRelField.collection)
               ) {
                  tempobj[arrayRelField.name] = resulte?.[arrayRelField.name]?.[
                     arrayRelField.relationIdField
                  ]?.map((polymorphic: any) => {
                     if (!polymorphic.relationTo) {
                        console.log(
                           "ERROR: Polymorphic Relation Fields require 'relationTo' and 'value' key values! See /import_files/readme.md for details",
                        );
                     }
                     return {
                        relationTo: polymorphic.relationTo,
                        value: polymorphic.value.toString(),
                     };
                  }); // Substitute Identifier out. At some point will need to write some code that will handle the case where the relationIdField's value is NOT the same as the id field, where a lookup of entry by relationIdField is done first.
               }
            }
            return {
               ...tempobj,
            };
         });
         arrayRelationImport[awr.name] = returnArrayElement;
      }
   });

   // !! 2nd level nested array relationships

   var relationNested2 = flatFields
      .filter((a) => a.type == "array")
      .map((lv1) => {
         return lv1.fields
            .filter((a) => a.type == "array")
            .map((lv2) => {
               return lv2.fields
                  .filter((a) => a.type == "relationship")
                  .map((lv3) => {
                     // Get first instance of ID that exists for nested relationship
                     var idtemp = result[lv1.name]
                        ?.map((a) =>
                           a[lv2.name]?.map((b) =>
                              b[lv3.name] ? Object.keys(b[lv3.name])[0] : null,
                           ),
                        )
                        .flat()
                        .flat()
                        .filter((a) => a); // Filter out undefined
                     return {
                        fieldlevel1: lv1.name,
                        fieldlevel2: lv2.name,
                        fieldlevel3: lv3.name,
                        idkey: idtemp?.[0],
                     };
                  });
            });
      })
      .flat()
      .flat();

   relationNested2.map((rn) => {
      var fieldlevel1 = rn.fieldlevel1; // Array (1st)
      var fieldlevel2 = rn.fieldlevel2; // Array (2nd)
      var fieldlevel3 = rn.fieldlevel3; // Relation (3rd)
      var idkey = rn.idkey; // Identifier key

      var temparrayval = arrayRelationImport[fieldlevel1];
      if (temparrayval) {
         temparrayval = temparrayval.map((sk) => {
            var temparray2val = sk[fieldlevel2];
            var tempout = sk;
            if (temparray2val) {
               temparray2val = temparray2val.map((up) => {
                  return {
                     ...up,
                     [fieldlevel3]: up[fieldlevel3]?.[idkey]?.toString(),
                  };
               });
               tempout = {
                  ...tempout,
                  [fieldlevel2]: temparray2val,
               };
            }
            return tempout;
         });
         arrayRelationImport[fieldlevel1] = temparrayval;
      }
   });

   // !! 3rd level nested array relationships

   var relationNested3 = flatFields
      .filter((a) => a.type == "array")
      .map((lv1) => {
         return lv1.fields
            .filter((a) => a.type == "array")
            .map((lv2) => {
               return lv2.fields
                  .filter((a) => a.type == "array")
                  .map((lv3) => {
                     return lv3.fields
                        .filter((a) => a.type == "relationship")
                        .map((lv4) => {
                           // Get first instance of ID that exists for nested relationship
                           var idtemp = result[lv1.name]
                              ?.map((a) =>
                                 a[lv2.name]?.map((b) =>
                                    b[lv3.name]?.map((c) =>
                                       c[lv4.name]
                                          ? Object.keys(c[lv4.name])[0]
                                          : null,
                                    ),
                                 ),
                              )
                              .flat()
                              .flat()
                              .flat()
                              .filter((a) => a); // Filter out undefined
                           return {
                              fieldlevel1: lv1.name,
                              fieldlevel2: lv2.name,
                              fieldlevel3: lv3.name,
                              fieldlevel4: lv4.name,
                              idkey: idtemp?.[0],
                           };
                        });
                  });
            });
      })
      .flat()
      .flat()
      .flat();

   relationNested3.map((rn) => {
      var fieldlevel1 = rn.fieldlevel1; // Array (1st)
      var fieldlevel2 = rn.fieldlevel2; // Array (2nd)
      var fieldlevel3 = rn.fieldlevel3; // Array (3rd)
      var fieldlevel4 = rn.fieldlevel4; // Relation (3rd)
      var idkey = rn.idkey; // Identifier key

      var temparrayval = arrayRelationImport[fieldlevel1];
      if (temparrayval) {
         temparrayval = temparrayval.map((sk) => {
            var temparray2val = sk[fieldlevel2];
            var tempout = sk;
            if (temparray2val) {
               temparray2val = temparray2val.map((sk2) => {
                  var temparray3val = sk2[fieldlevel3];
                  var tempout3 = sk2;
                  if (temparray3val) {
                     temparray3val = temparray3val.map((up) => {
                        return {
                           ...up,
                           [fieldlevel4]: up[fieldlevel4]?.[idkey]?.toString(),
                        };
                     });
                  }
                  tempout3 = {
                     ...tempout3,
                     [fieldlevel3]: temparray3val,
                  };
                  return tempout3;
               });
               tempout = {
                  ...tempout,
                  [fieldlevel2]: temparray2val,
               };
            }
            return tempout;
         });
         arrayRelationImport[fieldlevel1] = temparrayval;
      }
   });

   // Check if Relation entry exists for each field and get ID
   // FIX: This always is the ID field for this entry - so we can just put the ID in without having to look up the prior entry. This way a relation can also be imported later and automatically link up.

   var relationFieldList = flatFields.filter((fc) => fc.type == "relationship");

   const relationFields = relationFieldList?.map((f: any) => {
      return {
         name: f.name,
         collection: f.relationTo,
         relationIdField: result[f.name]
            ? Object.keys(result[f.name])?.[0]
            : null,
         hasMany: f.hasMany,
      };
   });

   const relationArray = relationFields.map((field: any) => {
      if (result[field.name] && !field.hasMany) {
         return {
            [field.name]:
               result[field.name]?.[field.relationIdField]?.toString(),
         };
      } else if (result[field.name] && field.hasMany) {
         return {
            [field.name]: result[field.name]?.[field.relationIdField]?.map(
               (multirelation: any) => multirelation.toString(),
            ),
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
