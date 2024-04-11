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

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads image using the id from the JSON object to locate the file
const seedUploads = async (result: any) => {
   const filetype = result.id.split(".").pop();
   const id = result.id.replace("." + filetype, ""); //This is the id from the JSON object
   const checksum = result.checksum;

   const existingImage = await payload.find({
      collection: "images",
      where: {
         id: {
            equals: id,
         },
      },
   });

   if (existingImage.docs.length > 0) {
      // Check if file exists! Sometimes uploads fail even though a DB entry goes through.
      // Will attempt reupload of image if the image doesn't exist, otherwise skips.
      var fileurl = existingImage.docs?.[0]?.url;
      var imgid = existingImage.docs?.[0]?.id;
      var imgchksum = existingImage.docs?.[0]?.checksum;

      if (overwriteexisting || imgchksum != checksum) {
         try {
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
            await delay(1000); // sleep(1000);
            console.log(`${id} Updated!`);
         } catch (e) {
            payload.logger.error(e);
         }
      } else {
         console.log(
            `${JSON.stringify(imgid)} Exists and checksum matches, skipping!`,
         );
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
   } else {
      try {
         const createItem = await payload.create({
            collection: "images",
            data: {
               id: id,
               createdBy: user,
               checksum: checksum,
            },
            filePath: path.resolve(__dirname, `./images/${id}.${filetype}`),
         });
         //Limit speed
         await delay(1000); // sleep(1000);
         console.log(`${id} Import completed!`);
      } catch (e) {
         payload.logger.error(e);
      }
   }
   count++;
   console.log(`${count} / ${data.length} Completed`);
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

// URL Check function to confirm if image file exists.
// CAUTION! This is heavy on the server! Only run if absolutely necessary. It counts as a call to the image server! Doing this iteratively across all images too often can max out image requests.
function URLExists(url: any) {
   return fetch(url)
      .then((res) => {
         if (res.status == 404) {
            return false;
         } else {
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
