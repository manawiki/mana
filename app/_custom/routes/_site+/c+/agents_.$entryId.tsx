// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

// Custom Site / Collection Config Imports

// Custom Component Imports
import { ImageGallery } from "~/_custom/components/agents/ImageGallery";
import { Main } from "~/_custom/components/agents/Main";
import { Skills } from "~/_custom/components/agents/Skills";
import { Talents } from "~/_custom/components/agents/Talents";
import { ZZZLoadingImage } from "~/_custom/components/ZZZLoadingImage";
import type { Agent as AgentType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { Agents } from "../../../collections/agents";

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
  skills: Skills,
  talents: Talents,
  gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.Agent as AgentType;
  // console.log(char);

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Skills data={char} />
        <Talents data={char} />
        <ImageGallery data={char} />
        <div className="my-4 dark:invert-0 invert h-28 w-full flex items-center justify-center">
          <ZZZLoadingImage />
        </div>
        <div className="text-center w-full text-2xl">Under Construction!</div>
      </Entry>
    </>
  );
}

const QUERY = gql`
  query Agent($entryId: String!) {
    Agent(id: $entryId) {
      id
      name
      name_code
      slug
      hp
      atk
      def
      hp_growth
      atk_growth
      def_growth
      impact
      crit
      crit_damage
      attribute_mastery
      icon_full {
        url
      }
      icon {
        url
      }
      icon_round {
        url
      }
      icon_general {
        url
      }
      rarity {
        id
        name
        icon {
          url
        }
      }
      damage_type {
        id
        name
        icon {
          url
        }
      }
      damage_element {
        id
        name
        icon {
          url
        }
      }
      character_camp {
        id
        name
        icon {
          url
        }
      }
      skill_basic {
        description {
          name
          desc
        }
        stats {
          title
          params
        }
      }
      skill_dodge {
        description {
          name
          desc
        }
        stats {
          title
          params
        }
      }
      skill_special {
        description {
          name
          desc
        }
        stats {
          title
          params
        }
      }
      skill_chain {
        description {
          name
          desc
        }
        stats {
          title
          params
        }
      }
      skill_core {
        description {
          name
          desc
        }
        stats {
          title
          params
        }
      }
      talents {
        name
        desc
        desc_flavor
      }
      ascension_data {
        asc
        lv_min
        lv_max
        hp_adv
        atk_adv
        def_adv
        materials {
          material {
            id
            slug
            rarity {
              id
            }
            icon {
              url
            }
          }
          qty
        }
      }
    }
  }
`;
