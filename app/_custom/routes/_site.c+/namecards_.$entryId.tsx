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
import type { Item as ItemType } from "~/db/payload-custom-types";
import { Items } from "../../collections/items";

// Custom Component Imports
import { Main } from "~/_custom/components/namecards/Main";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchItemData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: QUERY,
    },
  });

  const [{ entry }] = await Promise.all([fetchItemData]);

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
  var char = entry.data.Namecard;
  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
      </Entry>
    </>
  );
}

const QUERY = gql`
  query Namecard($entryId: String!) {
    Namecard(id: $entryId) {
      id
      name
      desc
      fight_desc
      rarity {
        id
        color
      }
      obtain_data {
        desc
      }
      image {
        url
      }
      icon {
        url
      }
    }
  }
`;
