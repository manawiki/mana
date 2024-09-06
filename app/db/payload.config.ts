import path from "path";

import { viteBundler } from "@payloadcms/bundler-vite";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { selectPlugin } from "payload-query";

import { collections } from "./collections";
import { Logo } from "./components/Logo";

const adapter = s3Adapter({
   config: {
      endpoint: "https://s3.us-west-004.backblazeb2.com",
      credentials: {
         accessKeyId: process.env.BACKBLAZE_KEYID || "",
         secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY || "",
      },
      region: "us-west-004",
   },
   bucket: process.env.BACKBLAZE_BUCKET ?? "mana-prod",
});

export default buildConfig({
   editor: slateEditor({}),
   db: mongooseAdapter({
      url: `${process.env.DB_URI}`,
      transactionOptions: false, //disable mongo transactions
   }),
   cors: "*",
   admin: {
      bundler: viteBundler(),
      //Ensure that the build directory is not emptied on build
      vite: (incomingViteConfig) => ({
         ...incomingViteConfig,
         build: {
            ...incomingViteConfig.build,
            emptyOutDir: false,
         },
      }),
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
      selectPlugin(),
      cloudStorage({
         collections: {
            images: {
               adapter,
               generateFileURL: (file) => {
                  const { filename } = file;
                  return `https://static.mana.wiki/${filename}`;
               },
            },
         },
      }),
   ],
   graphQL: {
      maxComplexity: 2000,
   },
   globals: [],
   collections,
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
   // disable Payload ratelimit, rely on flyio request limit instead
   rateLimit: {
      skip: () => true,
   },
});
