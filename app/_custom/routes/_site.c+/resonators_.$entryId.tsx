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
import { Main } from "~/_custom/components/resonators/Main";
import { Skill } from "~/_custom/components/resonators/Skill";
import { ResonanceChain } from "~/_custom/components/resonators/ResonanceChain";
import { Ascension } from "~/_custom/components/resonators/Ascension";
//import { Profile } from "~/_custom/components/resonators/Profile";
//import { Story } from "~/_custom/components/resonators/Story";
//import { VoiceLines } from "~/_custom/components/resonators/VoiceLines";
//import { Gallery } from "~/_custom/components/resonators/Gallery";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchResonatorData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: ResonatorQuery,
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
    fetchResonatorData,
    fetchCurveData,
  ]);

  return json({
    entry,
    curveData: data?.entry?.data?.ResonatorCurves?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, curveData } = useLoaderData<typeof loader>();
  var char = {
    Resonator: entry.data.Resonator,
    Curves: curveData,
  };

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Skill data={char} />
        <ResonanceChain data={char} />
        <Ascension data={char} />
        {/* <Gallery data={char} /> */}
        {/* <Profile data={char} /> */}
        {/* <Story data={char} /> */}
        {/* <VoiceLines data={char} /> */}
      </Entry>
    </>
  );
}

const ResonatorQuery = gql`
  query Resonator($entryId: String!) {
    Resonator(id: $entryId) {
      id
      name
      nickname
      intro
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
      weapon_type {
        id
        name
      }
      stats {
        attribute {
          id
          name
          icon {
            url
          }
          percent
          visible
        }
        value
      }
      ascension_costs {
        level
        items {
          item {
            id
            slug
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
      }
      resonance_chain {
        name
        desc
        icon {
          url
        }
      }
      skill_tree {
        id
        node_type
        bonus_name
        bonus_desc
        bonus_icon {
          url
        }
        unlock_costs {
          item {
            id
            slug
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
        resonator_skill {
          id
          slug
          name
          desc
          icon {
            url
          }
          type {
            name
          }
          max_lv
          details {
            name
            values {
              level
              value
            }
          }
          upgrade_costs {
            lv
            items {
              item {
                id
                slug
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
          }
        }
      }

      birthday
      gender
      birthplace
      affiliation
      resonance_power
      resonance_eval_report
      stories {
        title
        content
      }
      quotes {
        title
        content
        vo_cn {
          url
        }
        vo_jp {
          url
        }
        vo_en {
          url
        }
        vo_kr {
          url
        }
      }

      splash {
        url
      }
    }
  }
`;

const CurveQuery = gql`
  query ResonatorCurves {
    ResonatorCurves(limit: 200, sort: "level") {
      docs {
        id
        level
        lb_lv
        ratios {
          value
        }
      }
    }
  }
`;
