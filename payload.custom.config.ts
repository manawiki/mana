import { buildConfig } from "payload/config";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";
import { CustomCollections } from "./app/_custom/collections";
import { serverEnv } from "./shared";
import { Users } from "./db/collections/CustomUsers";
import { Images } from "./db/collections/Images";

dotenv.config();

const allowedSites = [
   "https://manatee.wiki",
   "https://mana.wiki",
   "https://starrail.mana.wiki",
   "https://starrail.manatee.wiki",
];

const bucketName = serverEnv === "production" ? "mana-prod" : "mana-dev";

const csrfDomains =
   serverEnv == "local" ? ["http://localhost:4000"] : allowedSites;

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
   admin: {
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
                  return `https://static.mana.wiki/file/${bucketName}/${process.env.PAYLOAD_PUBLIC_SITE_ID}/${file}`;
               },
               prefix: process.env.PAYLOAD_PUBLIC_SITE_ID,
            },
         },
      }),
   ],
   collections: [Users, Images, ...CustomCollections],
   csrf: csrfDomains,
});
