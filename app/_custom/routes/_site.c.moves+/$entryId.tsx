import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";
import { MovesMain } from "./components/Moves.Main";

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
      },
   });
   return json({
      entry,
   });
}

const SECTIONS = {
   main: MovesMain,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   //@ts-ignore
   const move = entry?.data.move as Move;

   return <Entry customComponents={SECTIONS} customData={move} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      move: Move(id: $entryId) {
         id
         slug
         name
      }
   }
`;
