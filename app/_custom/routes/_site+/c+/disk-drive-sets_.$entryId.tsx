// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Effects } from "~/_custom/components/disk-drive-sets/Effects";
import { Main } from "~/_custom/components/disk-drive-sets/Main";
import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";
import type { DiskDriveSet as DiskDriveSetType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { DiskDriveSets } from "../../../collections/disk-drive-sets";

// Custom Site / Collection Config Imports

// Custom Component Imports

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
   effects: Effects,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const char = entry?.data?.DiskDriveSet as DiskDriveSetType;
   // console.log(char);

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={char} />
            <Effects data={char} />

            <ZZZUnderConstruction />
         </Entry>
      </>
   );
}

const QUERY = gql`
   query DiskDriveSet($entryId: String!) {
   DiskDriveSet(id: $entryId) {
      id
      slug
      name
      desc
      icon {
         url
      }
      rarity_possible {
         id
         name
         icon_item {
         url
         }
      }
      set_effect {
         num
         desc
      }
      partitions {
         name
         desc
         partition {
         name
         }
         main_stat_pool {
         stats {
            stat {
               name
               icon {
               url
               }
            }
            value
         }
         }
         sub_stat_pool {
         stats {
            stat {
               name
               icon {
               url
               }
            }
            value
         }
         }
      }
   }
   }
`;
