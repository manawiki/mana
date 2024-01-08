// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Main } from "~/_custom/components/servants/Main";
import { NoblePhantasm } from "~/_custom/components/servants/NoblePhantasm";
import { Skills } from "~/_custom/components/servants/Skills";
import { Stats } from "~/_custom/components/servants/Stats";
import { Traits } from "~/_custom/components/servants/Traits";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import type { Servant as ServantType } from "~/db/payload-custom-types";

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
   stats: Stats,
   traits: Traits,
   skills: Skills,
   noblePhantasm: NoblePhantasm,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const servant = entry?.data?.Servant as ServantType;
   console.log(servant);

   return <Entry customComponents={SECTIONS} customData={servant} />;
}

// Add stats under atk_lv120 later.
const QUERY = gql`
   query ($entryId: String!) {
      Servant(id: $entryId) {
         id
         name
         library_id
         cost
         hp_base
         hp_max
         hp_grail
         hp_lv120
         atk_base
         atk_max
         atk_grail
         atk_lv120

         star_generation_rate
         star_absorption
         instant_death_chance
         np_charge_per_hit
         np_charge_when_attacked
         np_per_hit_quick
         np_per_hit_arts
         np_per_hit_buster
         np_per_hit_extra
         np_per_hit_np
         damage_distribution_quick
         damage_distribution_arts
         damage_distribution_buster
         damage_distribution_extra
         damage_distribution_np
         num_hits_quick
         num_hits_arts
         num_hits_buster
         num_hits_extra
         bond_experience
         class {
            name
            icon {
               url
            }
         }
         attribute {
            id
            name
         }
         growth_curve {
            name
         }
         deck_layout {
            name
         }
         alignment {
            id
            name
         }
         illustrator {
            id
            name
         }
         cv {
            id
            name
         }
         icon {
            url
         }
         image_stage_1 {
            url
         }
         image_stage_2 {
            url
         }
         image_stage_3 {
            url
         }
         image_stage_4 {
            url
         }
         star_rarity {
            name
         }
         tags {
            id
            name
            icon {
               url
            }
         }
         traits {
            id
            name
         }
         damage_rating
         critical_rating
         support_rating
         durability_rating
         utility_rating
         np_gain_rating
         writeup_overview
         writeup_gameplay_tips
         writeup_tier_list_explanation
         writeup_strengths
         writeup_weaknesses
         writeup_skill_level_explanation
         writeup_recommended_ces
         recommended_ces {
            id
            name
            icon {
               url
            }
         }
         writeup_skill_level_recommendation {
            level_up_skill {
               name
               _skill_Image {
                  icon {
                     url
                  }
               }
               cooldown
               description
               effect_value_table
            }
            level_up_importance {
               name
               description
            }
         }
         interlude_quests {
            quest {
               id
               name
            }
            quest_nickname
            ascension
            bond
            chapter {
               name
            }
            available
            interlude_reward {
               icon {
                  url
               }
            }
            specific_info
         }
         skills {
            skill {
               name
               _skill_Image {
                  icon {
                     url
                  }
               }
               cooldown
               description
               effect_value_table
            }
            unlock
            upgrades {
               skill {
                  name
                  _skill_Image {
                     icon {
                        url
                     }
                  }
                  cooldown
                  description
                  effect_value_table
               }
               unlock
            }
         }
         append_skills {
            name
            description
            effect_value_table
            skill_image {
               icon {
                  url
               }
            }
         }
         class_skills {
            name
            description
            skill_image {
               icon {
                  url
               }
            }
         }
         class_skill_unlock
         noble_phantasm_base {
            name
            sub_name
            rank
            np_classification {
               name
            }
            card_type {
               name
               icon {
                  url
               }
            }
            target_type
            hit_count
            description
            description_overcharge
            effect_list {
               effect_display
               values_per_level
            }
            effect_list_overcharge {
               effect_display
               values_per_level
            }
            unlock_condition
            video_link
            np_upgrades {
               name
               sub_name
               rank
               np_classification {
                  name
               }
               card_type {
                  name
                  icon {
                     url
                  }
               }
               target_type
               hit_count
               description
               description_overcharge
               effect_list {
                  effect_display
                  values_per_level
               }
               effect_list_overcharge {
                  effect_display
                  values_per_level
               }
               unlock_condition
               video_link
            }
         }
         ascension_materials {
            qp_cost
            materials {
               material {
                  id
                  name
                  icon {
                     url
                  }
               }
               qty
            }
         }
         skill_enhancements {
            qp_cost
            materials {
               material {
                  id
                  name
                  icon {
                     url
                  }
               }
               qty
            }
         }
         append_skill_enhancements {
            qp_cost
            materials {
               material {
                  id
                  name
                  icon {
                     url
                  }
               }
               qty
            }
         }
         introduction
         lore
         valentines_ce {
            id
            name
            description
            icon {
               url
            }
         }
         country_origin
         series
         str_grade
         agl_grade
         luk_grade
         end_grade
         mp_grade
         np_grade
         str_bar
         agl_bar
         luk_bar
         end_bar
         mp_bar
         np_bar
         profile_entries {
            title
            text
         }
         voice_lines {
            title
            text
         }
         summon_availability {
            name
            description
         }
         spoiler_name
         aka_aliases_nicknames
         slug
         authored_by
         tier_list_score
      }
   }
`;
