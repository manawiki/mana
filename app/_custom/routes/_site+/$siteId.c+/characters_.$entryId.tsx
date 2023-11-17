// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/$siteId.c_+/components/Entry";
import { H3, Image } from "~/components";
import {
   customEntryMeta,
   fetchEntry,
} from "~/routes/_site+/$siteId.c_+/functions/entry";
export { customEntryMeta as meta };

// Custom Site / Collection Config Imports
import type { Character as CharacterType } from "~/db/payload-custom-types";
import { Characters } from "../../../collections/characters";

// Custom Component Imports
import { Main } from "~/_custom/components/characters/Main";
import { Skills } from "~/_custom/components/characters/Skills";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";

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
   skills: Skills,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const char = entry?.data?.Character as CharacterType;
   // console.log(char);

   return <Entry customComponents={SECTIONS} customData={char} />;
}

const QUERY = gql`
   query Character($entryId: String!) {
      Character(id: $entryId) {
         id
         name
         eng_name
         slug
         rarity {
            id
            name
            hex
         }
         icon {
            url
         }
         image {
            url
         }
         icon_round {
            url
         }
         icon_bg_charinfo {
            url
         }
         energy_shard_type {
            id
            name
            icon {
               url
            }
         }
         profession {
            id
            name
            icon {
               url
            }
         }
         weapon_type {
            id
            name
            icon {
               url
            }
         }
         attributes {
            stat {
               id
               name
               icon {
                  url
               }
            }
            values
         }
         skills {
            skill {
               id
               name
               icon {
                  url
               }
               icon_bg_type
               levels {
                  level
                  description
                  cost_val
                  cool_down
                  max_charge_time
                  blackboard
               }
            }
         }
      }
   }
`;
