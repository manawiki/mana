import Payload from "payload";
import path from "path";
require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

//Array of objects matching the payload shape, change to match your needs
const data = require("./example.json");

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

//Uploads image using the id from the JSON object to locate the file
const seedUploads = async (result: any) => {
   const id = result.id; //This is the id from the JSON object
   const createItem = await payload.create({
      collection: "images",
      data: {
         id,
      },
      filePath: path.resolve(__dirname, `./images/${id}.png`),
   });
   //Limit speed
   sleep(1000);
   console.log(`${JSON.stringify(createItem)} Import completed!`);
};

const seedDocument = async (result: any) => {
   const foo = result.id;
   const prepared = { ...result, image: foo };
   console.log(prepared);
   // process.exit(0);

   const createItem = await payload.create({
      collection: "",
      data: {
         id: foo,
      },
   });
   sleep(1000);
   console.log(`${JSON.stringify(createItem)} Import completed!`);
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
