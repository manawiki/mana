import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import type { Move } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { MovesMain } from "./components/Moves.main";
import { PokemonWithMove } from "./components/Moves.pokemon-with-move";
import { MovesPVEInfo } from "./components/Moves.pve-info";
import { MovesPVPInfo } from "./components/Moves.pvp-info";

export { entryMeta as meta };

const SECTIONS = {
   main: MovesMain,
   "pve-info": MovesPVEInfo,
   "pvp-info": MovesPVPInfo,
   "pokemon-with-move": PokemonWithMove,
};

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

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   //@ts-ignore
   const move = entry.data.move as Move;

   return <Entry customComponents={SECTIONS} customData={move} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      move: Move(id: $entryId) {
         id
         slug
         name
         category
         icon {
            id
            url
         }
         type {
            name
            icon {
               url
            }
         }
         pve {
            power
            duration
            damagePerSecond
            energyPerSecond
            damagePerEnergy
            damageWindowStart
            damageWindowEnd
            energyDeltaFast
            damagePerEnergyDamagePerSecond
            energyDeltaCharge
         }
         pvp {
            power
            damagePerEnergy
            energyDeltaFast
            energyDeltaCharge
            secondDurationFast
            turnDurationFast
         }
         probability
         stageDelta
         stageMax
         stat
         subject
         pokemonWithMove {
            id
            name
            baseAttack
            slug
            level50CP
            type {
               name
               slug
               icon {
                  url
               }
            }
            icon {
               url
            }
         }
      }
   }
`;
