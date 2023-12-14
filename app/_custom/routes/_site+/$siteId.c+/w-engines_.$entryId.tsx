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
import type { WEngine as WEngineType } from "~/db/payload-custom-types";
import { WEngines } from "../../../collections/w-engines";

// Custom Component Imports
import { Main } from "~/_custom/components/w-engines/Main";
import { Talents } from "~/_custom/components/w-engines/Talents";
import { ImageGallery } from "~/_custom/components/w-engines/ImageGallery";

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
  talents: Talents,
  gallery: ImageGallery,
};

import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.WEngine as WEngineType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
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
      name
      rarity {
        name
        icon_item {
          url
        }
      }
      icon {
        url
      }
      icon_full {
        url
      }
      icon_big {
        url
      }
      stat_primary {
        id: name
        name
        value
      }
      stat_secondary {
        id: name
        name
        value
      }
      talent_title
      talent {
        level
        desc
      }
      slug
    }
  }
`;
