// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { Image } from "~/components/Image";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

// Custom Component Imports
export { entryMeta as meta };

// Custom Site / Collection Config Imports
import type { Echo as EchoType } from "~/db/payload-custom-types";

// Custom Component Imports
import { EchoesSkill } from "~/_custom/components/echoes/echoes.Skill";
import { EchoesSonata } from "~/_custom/components/echoes/echoes.Sonata";
import { EchoesMainStats } from "~/_custom/components/echoes/echoes.MainStats";
import { EchoesSubStats } from "~/_custom/components/echoes/echoes.SubStats";
import { EchoesMain } from "~/_custom/components/echoes/echoes.Main";

const SECTIONS = {
   main: EchoesMain,
   skill: EchoesSkill,
   "sonata-effects-possible": EchoesSonata,
   "possible-main-stats": EchoesMainStats,
   "possible-sub-stats": EchoesSubStats,
};

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

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   return <Entry customComponents={SECTIONS} customData={entry} />;
}

const QUERY = gql`
   query Echo($entryId: String!) {
      Echo(id: $entryId) {
         id
         name
         slug
         rarity {
            id
            color
         }
         icon {
            url
         }
         element {
            id
            name
            icon {
               url
            }
         }
         class {
            id
            name
            cost
         }
         skill {
            desc
            icon {
               url
            }
            cd
            params
         }
         sonata_effect_pool {
            id
            name
            color
            icon {
               url
            }
            effects {
               pieces
               effect
               params
            }
         }
      }
      EchoMainSubStats {
         docs {
            id
            name
            stats {
               id
               name
               icon {
                  url
               }
            }
         }
      }
   }
`;
