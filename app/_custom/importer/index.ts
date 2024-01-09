import fs from "fs";

import type { Payload } from "payload";
import payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;
const USER_ID = "644069d751c100f909f89e62"; // TODO(dim): Not hardcode this value.

interface IDataSource {
   data: IDataEntry[];
   images: IImageEntry[];
}

interface IDataEntry {
   table?: string;
   id: any;
   checksum: string;
}

interface IImageEntry {
   id: string;
   path: string;
   checksum: string;
}

const sleep = (milliseconds: any) => {
   const start = new Date().getTime();
   for (let i = 0; i < 1e7; i += 1) {
      if (new Date().getTime() - start > milliseconds) {
         break;
      }
   }
};

// TODO(dim): This format isn't final.
const importData = async (data: IDataEntry): Promise<void> => {
   const collection = data.table as string;
   delete data.table;
   await payload.create({
      collection: collection,
      data: {
         ...data,
      },
   });
};

const importAssets = async (data: IImageEntry[]): Promise<void> => {
   console.log(`[*] Importing ${data.length} assets...`);

   for (const entry of data) {
      await payload.create({
         collection: "images",
         data: {
            id: entry.id,
            checksum: entry.checksum,
            createdBy: USER_ID,
         },
         filePath: entry.path,
      });

      sleep(1000);
   }
};

const run = async (): Promise<void> => {
   const data: IDataSource = JSON.parse(
      fs.readFileSync(process.argv[2], "utf8")
   );

   await payload.init({
      secret: PAYLOADCMS_SECRET as string,
      mongoURL: CUSTOM_MONGO_URL as string,
      local: true,
      onInit: (_payload: Payload) => {
         _payload.logger.info("Payload initialized...");
      },
   });

   await importAssets(data.images).then(
      () => {
         payload.logger.info(`[*] All assets imported.`)
         process.exit(0);
      },
      (err) => {
         console.error(err);
         process.exit(-1);
      }
   );

   Promise.all(data.data.map((entry: IDataEntry) => importData(entry))).then(
      () => {
         payload.logger.info(`All data imported.`);
         process.exit(0);
      },
      (err) => {
         console.error(err);
         process.exit(-1);
      }
   );
};

run();
