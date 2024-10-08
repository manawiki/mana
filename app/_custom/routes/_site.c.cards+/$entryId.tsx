import css from "@mountainpass/react-pokemon-cards/dist/css/cards.css";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Outlet,
   useLoaderData,
   useMatches,
   useRouteLoaderData,
} from "@remix-run/react";
import { gql } from "graphql-request";

import type { Card } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { CardsMain } from "./components/Cards.Main";

export { entryMeta as meta };

export const links = () => [{ rel: "stylesheet", href: css }];

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
   main: CardsMain,
};

export function useEntryLoaderData() {
   return useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.c.cards+/$entryId",
   );
}

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   const matches = useMatches();

   console.log(matches);

   //@ts-ignore
   const card = entry?.data.card as Card;

   return (
      <>
         <Entry customComponents={SECTIONS} customData={card} /> <Outlet />
      </>
   );
}

const QUERY = gql`
   query ($entryId: String!) {
      card: Card(id: $entryId) {
         id
         slug
         name
         hp
         retreatCost
         image {
            url
         }
      }
   }
`;
