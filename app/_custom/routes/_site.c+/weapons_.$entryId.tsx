// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

// Custom Component Imports
import { WeaponsMain } from "~/_custom/components/weapons/weapons.Main";
import { WeaponsSkill } from "~/_custom/components/weapons/weapons.Skill";
import { WeaponsGallery } from "~/_custom/components/weapons/weapons.Gallery";
import { WeaponsAscension } from "~/_custom/components/weapons/weapons.Ascension";

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
         query: WeaponQuery,
      },
   });

   return json({
      entry,
   });
}

const SECTIONS = {
   main: WeaponsMain,
   skill: WeaponsSkill,
   ascension: WeaponsAscension,
   gallery: WeaponsGallery,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   const char = {
      Weapon: entry.data.Weapon,
      Curves: entry.data.WeaponCurves.docs,
   };

   return <Entry customComponents={SECTIONS} customData={char} />;
}

const WeaponQuery = gql`
   query Weapon($entryId: String!) {
      Weapon(id: $entryId) {
         id
         name
         desc
         slug: id
         rarity {
            id
            color
         }
         icon {
            url
         }
         type {
            name
         }
         splash {
            url
         }
         stats {
            attribute {
               name
               icon {
                  url
               }
               percent
            }
            ratio
            value
         }
         skill_name
         skill_desc
         skill_params
         ascension_costs {
            items {
               item {
                  id
                  name
                  icon {
                     url
                  }
                  rarity {
                     id
                     color
                  }
               }
               cnt
            }
            gold
         }
      }
      WeaponCurves {
         docs {
            id
            values {
               level
               ascension_level
               value
            }
         }
      }
   }
`;
