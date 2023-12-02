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
import type { Bangboo as BangbooType } from "~/db/payload-custom-types";
import { Bangboos } from "../../../collections/bangboos";

// Custom Component Imports
import { Main } from "~/_custom/components/bangboos/Main";
// import { Skills } from "~/_custom/components/bangboos/Skills";
import { ImageGallery } from "~/_custom/components/bangboos/ImageGallery";

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
  // skills: Skills,
  // talents: Talents,
  gallery: ImageGallery,
};

import { ZZZUnderConstruction } from "~/_custom/components/ZZZUnderConstruction";

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.Bangboo as BangbooType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        {/* <Skills data={char} /> */}
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
      name
      desc
      slug
      hp
      atk
      def
      impact
      icon_full {
        url
      }
      icon {
        url
      }
      rarity {
        id
        name
        icon {
          url
        }
      }
    }
  }
`;
