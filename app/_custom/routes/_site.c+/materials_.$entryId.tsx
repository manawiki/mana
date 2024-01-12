// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Main } from "~/_custom/components/materials/Main";
import { Obtain } from "~/_custom/components/materials/Obtain";
import type { Material as MaterialType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

// Custom Site / Collection Config Imports

// Custom Component Imports
export { entryMeta as meta };

// Loader definition - loads Entry data!
export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });
   return json({
      entry,
   });
}

const SECTIONS = {
   main: Main,
   obtain: Obtain,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const mat = entry?.data?.Material as MaterialType;

   return <Entry customComponents={SECTIONS} customData={mat} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      Material(id: $entryId) {
         id
         name
         desc
         obtain_way {
            desc
            icon {
               url
            }
         }
         no_obtain_way_hint
         type {
            id
         }
         showing_type {
            id
         }
         valuable_tab_type {
            id
         }
         icon {
            url
         }
         rarity {
            id
            name
            icon {
               url
            }
         }
         max_backpack_stack_count
         max_stack_count
         backpack_can_discard
         price
         slug
      }
   }
`;
