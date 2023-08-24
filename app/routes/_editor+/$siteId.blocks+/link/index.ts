import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { request as gqlRequest, gql } from "graphql-request";
import { select, type Select } from "payload-query";
import { singular } from "pluralize";
import { z } from "zod";
import { zx } from "zodix";

import type { Collection, Image } from "payload/generated-types";

export async function loader({
   context: { payload, user },
   request,
}: LoaderArgs) {
   const { linkUrl } = zx.parseQuery(request, {
      linkUrl: z.string(),
   });

   const url = new URL(linkUrl).pathname;
   const pathSection = url.split("/");

   switch (pathSection[2]) {
      case "collections": {
         const slug = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: pathSection[1],
               },
            },
            user,
         });
         const site = slug?.docs[0];

         //Singleton
         if (pathSection[4]) {
            const entryId = pathSection[4];
            const collectionId = pathSection[3];
            if (site.type == "custom") {
               const formattedName = singular(toWords(collectionId, true));
               const document = gql`
                  query ($entryId: String!) {
                     entryIcon: ${formattedName}(id: $entryId) {
                        name
                        icon {
                           url
                        }
                     }
                  }
               `;
               const endpoint = `https://${site.slug}-db.${
                  site.domain ?? "mana.wiki"
               }/api/graphql`;
               const result: any = await gqlRequest(endpoint, document, {
                  entryId,
               });
               return result.entryIcon;
            }
            //If not custom site, fetch local api entries collection
            const doc = await payload.findByID({
               collection: "entries",
               id: entryId,
               depth: 1,
               overrideAccess: false,
               user,
            });
            const entry = select({ id: false, name: true, icon: true }, doc);

            const iconSelect: Select<Image> = {
               id: false,
               url: true,
            };
            const entryIcon = entry.icon && select(iconSelect, entry.icon);

            return { ...entry, icon: entryIcon };
         }
         //If collection path 4 is null, search the collection list page instead
         else if (pathSection[3]) {
            const { docs } = await payload.find({
               collection: "collections",
               where: {
                  site: {
                     equals: site.id,
                  },
                  slug: {
                     equals: pathSection[3],
                  },
               },
               depth: 1,
               overrideAccess: false,
               user,
            });

            const collectionSelect: Select<Collection> = {
               id: false,
               name: true,
               icon: true,
            };

            const iconSelect: Select<Image> = {
               id: false,
               url: true,
            };

            const collection = select(collectionSelect, docs[0]);
            const collectionIcon =
               collection.icon && select(iconSelect, collection.icon);
            return { ...collection, icon: collectionIcon };
         }
      }
      // Posts version (future)
      // case "posts": {
      //    if (pathSection[3]) {
      //       const postId = pathSection[3];
      //       const doc = await payload.findByID({
      //          collection: "posts",
      //          id: postId,
      //          depth: 1,
      //          overrideAccess: false,
      //          user,
      //       });
      //       const filtered = select({ name: true, banner: true }, doc);
      //       return filtered;
      //    }
      //    return;
      // }
      default:
         return;
   }
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   // const siteId = params?.siteId ?? customConfig?.siteId;

   switch (intent) {
      case "createUpdate": {
      }
   }
};

const capitalizeFirstLetter = (string: string): string =>
   string.charAt(0).toUpperCase() + string.slice(1);

//We need to construct the Graphql label the same way payload does from the slug
//Following functions are copied over from payload core
const toWords = (inputString: string, joinWords = false): string => {
   const notNullString = inputString || "";
   const trimmedString = notNullString.trim();
   const arrayOfStrings = trimmedString.split(/[\s-]/);
   const splitStringsArray = [] as any;
   arrayOfStrings.forEach((tempString) => {
      if (tempString !== "") {
         const splitWords = tempString.split(/(?=[A-Z])/).join(" ");
         splitStringsArray.push(capitalizeFirstLetter(splitWords));
      }
   });

   return joinWords
      ? splitStringsArray.join("").replace(/\s/gi, "")
      : splitStringsArray.join(" ");
};
