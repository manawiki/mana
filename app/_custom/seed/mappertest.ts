import path from "path";

import Payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const data = require("./example.json");
// const filetype = "png"; // either mp3 or png or whatever filetype
const overwriteexisting = true; // CHANGE THIS if you wish to overwrite existing images or not.
const user = "644068fa51c100f909f89e1e";
var count = 0;

//Site ID from database - unique identifier to separate images
// const siteId = "lKJ16E5IhH"; // Honkai Star Rail

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
         mapper();
      },
   });
start();

async function mapper() {
   try {
      await Promise.all(
         data.map(async (row: any) => {
            try {
               //Do stuff here
               await seedUploads(row);
               delay(1000);
               // console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);
               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}

//Uploads image using the id from the JSON object to locate the file
const seedUploads = async (result: any) => {
   const filetype = result.id.split(".").pop();
   const id = result.id.replace("." + filetype,""); //This is the id from the JSON object
   const checksum = result.checksum;

   //console.log(id);

   const existingImage = await payload.find({
      collection: "images",
      where: {
			id: {
				equals: id,
			},
		}
   });

   //console.log(existingImage);

   if (existingImage.docs.length > 0) {
      // Check if file exists! Sometimes uploads fail even though a DB entry goes through.
      // Will attempt reupload of image if the image doesn't exist, otherwise skips.
      var fileurl = existingImage.docs?.[0]?.url;
      var imgid = existingImage.docs?.[0]?.id;
      var imgchksum = existingImage.docs?.[0]?.checksum;

      if (overwriteexisting && imgchksum != checksum) {
            const updateItem = await payload.update({
               collection: "images",
               id: id,
               data: {
                  id: id,
                  createdBy: user,
                  checksum: checksum,
               },
               filePath: path.resolve(__dirname, `./images/${id}.${filetype}`),
            });
            console.log(`${id} Updated!`);
         }
         else {
            console.log(`${JSON.stringify(imgid)} Exists and checksum matches, skipping!`);
         }

      // if (await URLExists(fileurl)) {
      //    console.log(`Image ${id} already exists! Skipping.`);

      // }
      // else {
      //    console.log(`!!!! => Image ${id} missing; Re-uploading! ${imgid}`);
      //    const updateItem = await payload.create({
      //       collection: "images",
      //       id: imgid,
      //       // data: {
      //       //    id: imgid,
      //       // },
      //       filePath: path.resolve(__dirname, `./images/${id}.png`),
      //    });
      //    console.log(`${JSON.stringify(updateItem)} Updated!`);
      // }
   }
   else {
      const createItem = await payload.create({
         collection: "images",
         data: {
            id: id,
            createdBy: user,
            checksum: checksum,
         },
         filePath: path.resolve(__dirname, `./images/${id}.${filetype}`),
      });
      console.log(`${JSON.stringify(createItem)} Import completed!`);
   }
   count++;
   console.log(`${count} / ${data.length} Completed`);
};

// URL Check function to confirm if image file exists. 
// CAUTION! This is heavy on the server! Only run if absolutely necessary. It counts as a call to the image server! Doing this iteratively across all images too often can max out image requests.
function URLExists(url: any) {
   return fetch(url)
   .then((res) => {
      if (res.status == 404) {    
         return false;
      }
      else {
         return true;
      }

   })
   .catch((err) => {
      return false;
   });
}

function delay(ms: number) {
   return new Promise((res) => setTimeout(res, ms));
}
