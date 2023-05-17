import { buildConfig } from "payload/config";
import path from "path";
import { collections } from "./collections";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";
import { Logo } from "./components/Logo";
import { BackMana } from "./components/BackMana";
import { cachePlugin } from "@aengz/payload-redis-cache";
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
      webpack: (config) => ({
         ...config,
         resolve: {
            ...config.resolve,
            alias: {
               ...config?.resolve?.alias,
               [path.resolve(
                  __dirname,
                  "../../node_modules/@aengz/payload-redis-cache"
               )]: mockModulePath,
            },
         },
      }),
   },
   cors: ["mana.wiki", "starrail-static.mana.wiki"],
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
      //@ts-ignore
      ...(process.env.NODE_ENV == "production" ? [cachePlugin({})] : []),
   ],
   collections,
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
});
