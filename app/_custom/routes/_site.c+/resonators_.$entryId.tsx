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
import { TotalMaterialCost } from "~/_custom/components/resonators/TotalMaterialCost";
import { Profile } from "~/_custom/components/resonators/Profile";
import { Story } from "~/_custom/components/resonators/Story";
import { VoiceLines } from "~/_custom/components/resonators/VoiceLines";
import { Gallery } from "~/_custom/components/resonators/Gallery";
import { Specialty } from "~/_custom/components/resonators/Specialty";

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

  const fetchRecipeData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: RecipeQuery,
    },
  });

  const [{ entry }, data, data2] = await Promise.all([
    fetchResonatorData,
    fetchCurveData,
    fetchRecipeData,
  ]);

  return json({
    entry,
    curveData: data?.entry?.data?.ResonatorCurves?.docs,
    recipeData: data2?.entry?.data?.CookingRecipes?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry, curveData, recipeData } = useLoaderData<typeof loader>();
  var char = {
    Resonator: entry.data.Resonator,
    Curves: curveData,
    Recipes: recipeData,
  };

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Skill data={char} />
        <ResonanceChain data={char} />
        <Ascension data={char} />
        <TotalMaterialCost data={char} />
        <Specialty data={char} />
        <Gallery data={char} />
        <Profile data={char} />
        <Story data={char} />
        <VoiceLines data={char} />
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
          params
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
      overclock_diagnostic_report
      vo_en
      vo_ja
      vo_ko
      vo_zh
      stories {
        title
        content
      }
      quotes {
        title
        content
        vo_zh {
          url
        }
        vo_ja {
          url
        }
        vo_en {
          url
        }
        vo_ko {
          url
        }
      }

      card_img {
        url
      }
      gacha_splash_bg {
        url
      }
      gacha_splash_fg {
        url
      }
      gacha_splash_full {
        url
      }
      gacha_share_img {
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

const RecipeQuery = gql`
  query CookingRecipes($entryId: JSON!) {
    CookingRecipes(where: { special_dishes__resonator: { equals: $entryId } }) {
      docs {
        id
        result_item {
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
        special_dishes {
          resonator {
            id
            name
          }
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
        }
      }
    }
  }
`;
