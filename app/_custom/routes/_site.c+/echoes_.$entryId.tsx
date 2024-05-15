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
import { Items } from "../../collections/items";

// Custom Component Imports
import { Main } from "~/_custom/components/echoes/Main";
import { Skill } from "~/_custom/components/echoes/Skill";
import { Sonata } from "~/_custom/components/echoes/Sonata";
import { Stats } from "~/_custom/components/echoes/Stats";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const fetchEchoData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });
   const fetchStatsData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: STAT_QUERY,
      },
   });

   const [{ entry }, data] = await Promise.all([fetchEchoData, fetchStatsData]);

   return json({
      entry,
      StatsData: data.entry?.data?.EchoMainSubStats?.docs,
   });
}

const SECTIONS = {
   main: Main,
   // gallery: ImageGallery,
};

export default function EntryPage() {
   const { entry, StatsData } = useLoaderData<typeof loader>();
   const char = entry?.data?.Echo as EchoType;
   const stats = StatsData;
   console.log(stats);

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={char} />
            <Skill data={char} />
            <Sonata data={char} />
            <Stats data={stats} />
         </Entry>
      </>
   );
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
   }
`;

const STAT_QUERY = gql`
   query EchoMainSubStats {
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
