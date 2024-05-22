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
import { Main } from "~/_custom/components/sonata-effects/Main";
import { Echoes } from "~/_custom/components/sonata-effects/Echoes";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchSonataData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: QUERY,
    },
  });

  const fetchEchoData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: ECHO_QUERY,
    },
  });

  const [{ entry }, echo] = await Promise.all([fetchSonataData, fetchEchoData]);

  return json({
    entry,
    echoData: echo?.entry?.data?.Echoes?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, echoData } = useLoaderData<typeof loader>();
  var char = {
    Sonata: entry.data.SonataEffect,
    Echoes: echoData,
  };

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Echoes data={char} />
      </Entry>
    </>
  );
}

const QUERY = gql`
  query SonataEffect($entryId: String!) {
    SonataEffect(id: $entryId) {
      id
      name
      slug
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
`;

const ECHO_QUERY = gql`
  query Echoes($entryId: JSON!) {
    Echoes(where: { sonata_effect_pool: { equals: $entryId } }) {
      docs {
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
        class {
          id
          name
          cost
        }
        element {
          id
          name
          icon {
            url
          }
        }
        sonata_effect_pool {
          id
          name
          icon {
            url
          }
          color
        }
      }
    }
  }
`;
