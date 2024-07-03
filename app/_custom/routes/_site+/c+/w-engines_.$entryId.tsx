// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { ImageGallery } from "~/_custom/components/w-engines/ImageGallery";
import { Main } from "~/_custom/components/w-engines/Main";
import { Talents } from "~/_custom/components/w-engines/Talents";
import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";
import type { WEngine as WEngineType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { WEngines } from "../../../collections/w-engines";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";

// Custom Site / Collection Config Imports

// Custom Component Imports
export { entryMeta as meta };

// Loader definition - loads Entry data!
export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const fetchWEngineData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });
   const fetchWLevelData = fetchList({
      payload,
      params,
      request,
      user,
      gql: {
         query: WLEVEL_QUERY,
      },
   });

   const [{ entry }, wlevel] = await Promise.all([
      fetchWEngineData,
      fetchWLevelData,
   ]);

   return json({
      entry,
      wLevelData: wlevel?.list?.data?.DataJsons?.docs,
   });
}

const SECTIONS = {
   main: Main,
   talents: Talents,
   gallery: ImageGallery,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const char = loaderdata?.entry?.data?.WEngine as WEngineType;

   return (
      <>
         {/* <Entry customComponents={SECTIONS} customData={char} /> */}
         <Entry>
            <Main data={loaderdata} />
            <Talents data={char} />
            <ImageGallery data={char} />

            <ZZZUnderConstruction />
         </Entry>
      </>
   );
}

const QUERY = gql`
query WEngine($entryId: String!) {
  WEngine(id: $entryId) {
    id
    slug
    name
    desc
    comment
    icon {
      url
    }
    icon_full {
      url
    }
    icon_big {
      url
    }
    rarity {
      id
      name
      icon_item {
        url
      }
    }
    specialty {
      name
      icon {
        url
      }
    }
    stat_primary {
      stat {
        id
        name
      }
      value
    }
    stat_secondary {
      stat {
        id
        name
        fmt
        divisor
      }
      value
    }
    talent_title
    talent {
      level
      desc
    }
  }
}
`;

const WLEVEL_QUERY = gql`
query {
  DataJsons {
    docs {
      id
      json
    }
  }
}
`;
