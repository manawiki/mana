import { buildConfig } from "payload/config";
import path from "path";
import { collections } from "./collections";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import dotenv from "dotenv";
import { Logo } from "./components/Logo";
import { BackMana } from "./components/BackMana";
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
               react: path.join(__dirname, "../../node_modules/react"),
               "react-dom": path.join(
                  __dirname,
                  "../../node_modules/react-dom"
               ),
               payload: path.join(__dirname, "../../node_modules/payload"),
            },
         },
      }),
   },
   cors: ["mana.wiki", "starrail-static.mana.wiki", "static.mana.wiki"],
   plugins: [
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
      searchPlugin({
         collections: ["customPages", "entries", "posts", "collections"],
         searchOverrides: {
            fields: [
               {
                  name: "slug",
                  label: "Slug",
                  type: "text",
                  admin: {
                     readOnly: true,
                  },
               },
               {
                  name: "site",
                  type: "relationship",
                  relationTo: "sites",
                  hasMany: false,
                  maxDepth: 1,
                  index: true,
                  admin: {
                     readOnly: true,
                  },
               },
               {
                  name: "icon",
                  type: "relationship",
                  relationTo: "images",
                  hasMany: false,
                  admin: {
                     readOnly: true,
                  },
               },
               {
                  name: "collectionEntity",
                  type: "relationship",
                  relationTo: "collections",
                  hasMany: false,
                  admin: {
                     readOnly: true,
                  },
               },
            ],
         },
         beforeSync: ({ originalDoc, searchDoc }) => {
            const type = searchDoc.doc.relationTo;
            switch (type) {
               case "customPages": {
                  return {
                     ...searchDoc,
                     name: originalDoc?.name,
                     site: originalDoc?.site.id,
                     icon: originalDoc?.icon.id,
                     slug: originalDoc?.slug,
                  };
               }
               case "collections": {
                  return {
                     ...searchDoc,
                     name: originalDoc?.name,
                     site: originalDoc?.site,
                     icon: originalDoc?.icon,
                     slug: originalDoc?.slug,
                  };
               }
               case "entries": {
                  return {
                     ...searchDoc,
                     name: originalDoc?.name,
                     site: originalDoc?.site.id,
                     icon: originalDoc?.icon.id,
                     collectionEntity: originalDoc?.collectionEntity,
                  };
               }
               case "posts": {
                  return {
                     ...searchDoc,
                     name: originalDoc?.name,
                     site: originalDoc?.site.id,
                     slug: originalDoc?.slug,
                     postId: originalDoc?.id,
                  };
               }
               default:
                  return {
                     ...searchDoc,
                     site: originalDoc?.site.id,
                     name: originalDoc?.name,
                  };
            }
         },
         defaultPriorities: {
            collections: 10,
            customPages: 10,
            entries: 9,
            posts: 8,
         },
      }),
   ],
   collections,
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
});
