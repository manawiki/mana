import path from "path";

import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import { buildConfig } from "payload/config";

import { Users } from "./collections/CustomUsers";
import { Images } from "./collections/Images";
import { Logo } from "./components/Logo";
import searchPlugin from "./plugins/search";
import { settings } from "../../mana.config";
import {
   CustomCollections,
   CustomSearchCollections,
   CustomDefaultPriorities,
} from "../_custom/collections";

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
         : `https://${settings.siteId}-db.${settings.domain}`,
   editor: slateEditor({}),
   db: mongooseAdapter({
      url: process.env.CUSTOM_MONGO_URL ?? false,
   }),
   admin: {
      bundler: webpackBundler(),
      components: {
         graphics: {
            Icon: Logo,
            Logo: Logo,
         },
      },
      user: "users",
      meta: {
         favicon: "/favicon.ico",
         ogImage: "/og-image.png",
         titleSuffix: "Mana",
      },
   },
   plugins: [
      cloudStorage({
         collections: {
            images: {
               adapter,
               generateFileURL: (file) => {
                  const { filename } = file;
                  return `https://static.mana.wiki/${settings.siteId}/${filename}`;
               },
               prefix: settings.siteId,
            },
         },
      }),
      searchPlugin({
         collections: [...CustomSearchCollections],
         defaultPriorities: CustomDefaultPriorities,
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
      outputFile: path.resolve(__dirname, "./payload-custom-types.ts"),
   },
   collections: [Users, Images, ...CustomCollections],
});
