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
import searchPlugin from "./plugins/search";

const bucketName = process.env.PAYLOAD_PUBLIC_BUCKET
   ? process.env.PAYLOAD_PUBLIC_BUCKET
   : "mana-prod";

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
         ? "http://localhost:3000"
         : `https://${process.env.PAYLOAD_PUBLIC_HOST_DOMAIN}`,
   editor: slateEditor({}),
   db: mongooseAdapter({
      url: `${process.env.MONGODB_URI}/mana-prod`,
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
                     site: originalDoc?.site.id,
                     icon: originalDoc?.icon?.id,
                     slug: originalDoc?.slug,
                  };
               }
               case "entries": {
                  return {
                     ...searchDoc,
                     name: originalDoc?.name,
                     site: originalDoc?.site.id,
                     icon: originalDoc?.icon?.id,
                     collectionEntity: originalDoc?.collectionEntity.id,
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
   globals: [],
   collections,
   typescript: {
      outputFile: path.resolve(__dirname, "./payload-types.ts"),
   },
});
