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
import type { Material as MaterialType } from "~/db/payload-custom-types";
import { Materials } from "../../../collections/materials";

// Custom Component Imports
import { Main } from "~/_custom/components/materials/Main";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

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
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.Material as MaterialType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        {/* <ImageGallery data={char} /> */}

        {/* <ZZZUnderConstruction /> */}
      </Entry>
    </>
  );
}

const QUERY = gql`
  query Material($entryId: String!) {
    Material(id: $entryId) {
      id
      name
      desc
      desc_flavor
      slug
      rarity {
        name
        icon {
          url
        }
      }
      class {
        name
      }
      icon {
        url
      }
    }
  }
`;
