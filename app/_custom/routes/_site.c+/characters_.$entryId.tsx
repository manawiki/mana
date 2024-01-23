// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import type { Character as CharacterType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { Characters } from "../../collections/characters";

import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { Main } from "~/_custom/components/characters/Main";
import { Skills } from "~/_custom/components/characters/Skills";
import { FactorySkills } from "~/_custom/components/characters/FactorySkills";
import { Profile } from "~/_custom/components/characters/Profile";
import { VoiceLines } from "~/_custom/components/characters/VoiceLines";
import { BreakCost } from "~/_custom/components/characters/BreakCost";
import { SkillCost } from "~/_custom/components/characters/SkillCost";

// Custom Site / Collection Config Imports

// Custom Component Imports
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
  factory: FactorySkills,
  break: BreakCost,
  skillcost: SkillCost,
  profile: Profile,
  voice: VoiceLines,
  gallery: ImageGallery,
};

export default function EntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const char = entry?.data?.Character as CharacterType;
  // console.log(char);

  return <Entry customComponents={SECTIONS} customData={char} />;
}

const QUERY = gql`
  query Character($entryId: String!) {
    Character(id: $entryId) {
      id
      name
      eng_name
      slug
      rarity {
        id
        name
        hex
      }
      icon {
        url
      }
      image {
        url
      }
      icon_round {
        url
      }
      icon_bg_charinfo {
        url
      }
      energy_shard_type {
        id
        name
        icon {
          url
        }
      }
      profession {
        id
        name
        icon {
          url
        }
      }
      weapon_type {
        id
        name
        icon {
          url
        }
      }
      attributes {
        stat {
          id
          name
          icon {
            url
          }
        }
        values
      }
      skills {
        skill {
          id
          name
          icon {
            url
          }
          icon_bg_type
          levels {
            level
            description
            cost_val
            cool_down
            max_charge_time
            blackboard
          }
        }
      }
      factory_skills {
        factory_skill {
          name
          desc
          icon {
            url
          }
          building_type
          type {
            data_key
            name
          }
        }
        break_stage
      }
      profile_record {
        title
        text
      }
      profile_voice {
        title
        text
      }
      break_data {
        max_level
        required_item {
          item {
            id
            name
            rarity {
              id
            }
            icon {
              url
            }
          }
          count
        }
      }
      skill_level_up {
        skill {
          name
        }
        level
        gold_cost
        item_cost {
          item {
            id
            name
            slug
            icon {
              url
            }
            rarity {
              id
            }
          }
          count
        }
      }
    }
  }
`;
