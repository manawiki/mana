// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

// Custom Site / Collection Config Imports

// Custom Component Imports
import { ImageGallery } from "~/_custom/components/bangboos/ImageGallery";
import { Main } from "~/_custom/components/bangboos/Main";
import { Skills } from "~/_custom/components/bangboos/Skills";
import { Talents } from "~/_custom/components/bangboos/Talents";
import { Ascension } from "~/_custom/components/bangboos/Ascension";
import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";
import type { Bangboo as BangbooType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { Bangboos } from "../../../collections/bangboos";

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
   skills: Skills,
   talents: Talents,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const char = entry?.data?.Bangboo as BangbooType;
   //console.log(char);

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={char} />
            {/*<Skills data={char} />}
            <Talents data={char} />*/}
            <Ascension data={char} />
            <ImageGallery data={char} />

            <ZZZUnderConstruction />
         </Entry>
      </>
   );
}

const QUERY = gql`
   query Bangboo($entryId: String!) {
   Bangboo(id: $entryId) {
      id
      slug
      name
      desc
      rarity {
         id
         name
         icon {
         url
         }
      }
      icon {
         url
      }
      icon_full {
         url
      }
      stats {
         stat {
         id
         name
         fmt
         divisor
         icon {
            url
         }
         }
         base
         growth
      }
      ascensions {
         asc
         lv_min
         lv_max
         stat_adv {
         stat {
            id
            name
            icon {
               url
            }
         }
         value
         }
         stat_add {
         stat {
            id
            name
            icon {
               url
            }
         }
         value
         }
         materials {
         material {
            id
            slug
            name
            icon {
               url
            }
         }
         qty
         }
      }
      skills {
         relationTo
         value {
         __typename
         ... on BangbooSkill {
            id
            name
            desc
            icon {
               url
            }
            params {
               title
               params
            }
         }
         ... on BangbooTalent {
            id
            icon {
               url
            }
            levels {
               rank
               desc
               params {
               title
               params
               }
            }
         }
         }
      }
   }
   }
`;
