import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

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

const SECTIONS = {
   main: "Main",
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   return <Entry customComponents={SECTIONS} customData={entry} />;
}

//The $entryId variable is optional, but always passed in with the query.
const QUERY = gql`
   query ($entryId: String!) {
      SingularCollectionName(id: $entryId) {
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
