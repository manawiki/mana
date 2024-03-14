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
import { Main } from "~/_custom/components/weapons/Main";
import { Skill } from "~/_custom/components/weapons/Skill";
import { Ascension } from "~/_custom/components/weapons/Ascension";
import { Gallery } from "~/_custom/components/weapons/Gallery";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchWeaponData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: WeaponQuery,
    },
  });

  const fetchCurveData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: CurveQuery,
    },
  });

  const [{ entry }, data] = await Promise.all([
    fetchWeaponData,
    fetchCurveData,
  ]);

  return json({
    entry,
    weaponCurveData: data?.entry?.data?.WeaponCurves?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, weaponCurveData } = useLoaderData<typeof loader>();
  var char = {
    Weapon: entry.data.Weapon,
    Curves: weaponCurveData,
  };

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Skill data={char} />
        <Ascension data={char} />
        <Gallery data={char} />
      </Entry>
    </>
  );
}

const WeaponQuery = gql`
  query Weapon($entryId: String!) {
    Weapon(id: $entryId) {
      id
      name
      desc
      slug: id
      rarity {
        id
        color
      }
      icon {
        url
      }
      type {
        name
      }
      splash {
        url
      }
      stats {
        attribute {
          name
          icon {
            url
          }
        }
        percent
        value
      }
      skill_name
      skill_desc
      skill_params
      ascension_costs {
        items {
          item {
            id
            name
            icon {
              url
            }
            rarity {
              id
              color
            }
          }
          cnt
        }
        gold
      }
    }
  }
`;

const CurveQuery = gql`
  query {
    WeaponCurves {
      docs {
        id
        values {
          level
          ascension_level
          value
        }
      }
    }
  }
`;
