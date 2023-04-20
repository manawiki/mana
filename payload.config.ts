import { buildConfig } from "payload/config";
import path from "path";
import { collections } from "./db/collections";
import { Users } from "./db/collections/Users";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";

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
   admin: {
      user: Users.slug,
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
                  return `https://static.mana.wiki/file/${bucketName}/${filename}`;
               },
            },
         },
      }),
   ],
   collections,
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
});
