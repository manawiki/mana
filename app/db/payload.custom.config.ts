import { buildConfig } from "payload/config";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";
import path from "path";
import { Images } from "./collections/Images";
import { BackMana } from "./components/BackMana";
import { Logo } from "./components/Logo";
import { Users } from "./collections/CustomUsers";
import {
   CustomCollections,
   CustomSearchCollections,
} from "../_custom/collections";
import searchPlugin from "./plugins/search";
const mockModulePath = path.resolve(__dirname, "./emptyObject.js");

dotenv.config();

const bucketName = process.env.PAYLOAD_PUBLIC_BUCKET ?? "";

const adapter = s3Adapter({
   config: {
      endpoint: "https://s3.us-west-004.backblazeb2.com",
      credentials: {
         accessKeyId: process.env.PAYLOAD_PUBLIC_BACKBLAZE_KEYID || "",
         secretAccessKey:
            process.env.PAYLOAD_PUBLIC_BACKBLAZE_APPLICATION_KEY || "",
      },
      region: "us-west-004",
   },
   bucket: bucketName,
});

export default buildConfig({
   serverURL:
      process.env.NODE_ENV == "development"
         ? "http://localhost:4000"
         : `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki`,
   admin: {
      components: {
         beforeNavLinks: [BackMana],
         graphics: {
            Icon: Logo,
            Logo: Logo,
         },
      },
      css: path.resolve(__dirname, "./db.css"),
      user: "users",
      meta: {
         favicon: "/favicon.ico",
         ogImage: "/og-image.png",
         titleSuffix: "Mana",
      },
   },
   graphQL: {
      disable: true,
   },
   plugins: [
      cloudStorage({
         collections: {
            images: {
               adapter,
               generateFileURL: (file) => {
                  const { filename } = file;
                  return `https://static.mana.wiki/${process.env.PAYLOAD_PUBLIC_SITE_ID}/${filename}`;
               },
               prefix: process.env.PAYLOAD_PUBLIC_SITE_ID,
            },
         },
      }),
      searchPlugin({
         collections: [...CustomSearchCollections],
         searchOverrides: {
            fields: [
               {
                  name: "icon",
                  type: "relationship",
                  relationTo: "images",
                  hasMany: false,
                  admin: {
                     readOnly: true,
                  },
               },
            ],
         },
         beforeSync: ({ originalDoc, searchDoc }) => {
            return {
               ...searchDoc,
               icon: originalDoc?.icon?.id ?? "",
               name: originalDoc?.name,
            };
         },
      }),
   ],
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
   collections: [Users, Images, ...CustomCollections],
});
