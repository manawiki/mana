import type { CollectionConfig } from "payload/types";
import deepMerge from "ts-deepmerge";

import type { SearchConfig } from "../types";

// all settings can be overridden by the config
export const generateSearchCollection = (
   searchConfig: SearchConfig
): CollectionConfig =>
   //@ts-ignore
   deepMerge(
      {
         slug: "search",
         labels: {
            singular: "Search Result",
            plural: "Search Results",
         },
         admin: {
            useAsTitle: "name",
            defaultColumns: ["name"],
            description:
               "This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as are created or updated.",
            enableRichTextRelationship: false,
         },
         access: {
            read: (): boolean => true,
            create: (): boolean => false,
         },
         fields: [
            {
               name: "name",
               type: "text",
               index: true,
               admin: {
                  readOnly: true,
               },
            },
            {
               name: "priority",
               type: "number",
               admin: {
                  position: "sidebar",
               },
            },
            {
               name: "doc",
               type: "relationship",
               relationTo: searchConfig?.collections || [],
               required: true,
               index: true,
               maxDepth: 0,
               admin: {
                  readOnly: true,
                  position: "sidebar",
               },
            },
         ],
      },
      searchConfig?.searchOverrides || {}
   );
