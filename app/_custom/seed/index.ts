import payload from "payload";
import path from "path";

require("dotenv").config();

const { PAYLOADCMS_SECRET, MONGO_URL } = process.env;

const seedImages = async (): Promise<void> => {
   console.log(process.argv.slice(2));
   await payload.init({
     secret: PAYLOADCMS_SECRET as string,
     mongoURL: MONGO_URL as string,
     local: true,
     onInit: (_payload) => {
      _payload.logger.info(`Payload initialized...`);
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
};

seedImages();