import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/$siteId.c_+/src/components";
import {
   customEntryMeta,
   fetchEntry,
} from "~/routes/_site+/$siteId.c_+/src/functions";

export { customEntryMeta as meta };

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
         variables: {},
      },
      // rest: {
      //    depth: 1,
      // },
   });

   return json({
      entry,
   });
}

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   return (
      <Entry>
         <div>{entry.name}</div>
      </Entry>
   );
}

//The $entryId variable is optional, but always passed in with the query.
const QUERY = gql`
   query ($entryId: String!) { {
      CollectionName(id: $entryId) {
         id
         slug
         name
         icon {
            id
            url
         } 
      }
   }
`;
