import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import type { Character } from "payload-types";

import type { SkillTree as SkillTreeType } from "payload/generated-custom-types";
import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { Eidolons } from "~/_custom/components/characters/Eidolons";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { Profile } from "~/_custom/components/characters/Profile";
import { PromotionCost } from "~/_custom/components/characters/PromotionCost";
import { SkillTree } from "~/_custom/components/characters/SkillTree";
import { Story } from "~/_custom/components/characters/Story";
import { TotalMaterialCost } from "~/_custom/components/characters/TotalMaterialCost";
import { Traces } from "~/_custom/components/characters/Traces";
import { VoiceLines } from "~/_custom/components/characters/VoiceLines";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

export { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const fetchCharacterData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: CharacterQuery,
      },
   });

   const fetchSkillTreeData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: SkillTreeQuery,
      },
   });

   const [{ entry }, data] = await Promise.all([
      fetchCharacterData,
      fetchSkillTreeData,
   ]);

   return json({
      entry,
      skillTreeData: data?.entry?.data?.skillTree?.docs as SkillTreeType[],
   });
}

const SECTIONS = {
   main: CharacterStatBlock,
   traces: Traces,
   tree: SkillTree,
   eidolons: Eidolons,
   promotion: PromotionCost,
   materials: TotalMaterialCost,
   gallery: ImageGallery,
   profile: Profile,
   story: Story,
   "voice-lines": VoiceLines,
};

export default function CharacterEntry() {
   const { entry, skillTreeData } = useLoaderData<typeof loader>();

   const data = {
      character: entry.data.character as Character,
      skillTree: skillTreeData,
   };

   return <Entry customComponents={SECTIONS} customData={data} />;
}

const CharacterQuery = gql`
   query ($entryId: String!) {
      character: Character(id: $entryId) {
         id
         name
         image_draw {
            url
         }
         element {
            icon {
               url
            }
         }
         path {
            name
            icon {
               url
            }
            icon_small {
               url
            }
            data_key
         }
         rarity {
            icon {
               url
            }
         }
         stats {
            label
            data
         }
         stats_csv
         traces {
            name
            desc_type
            icon {
               url
            }
            description_per_level {
               description
            }
         }
         icon {
            url
         }
         image_full {
            url
         }
         image_full_bg {
            url
         }
         image_full_front {
            url
         }
         image_action {
            url
         }
         image_round_icon {
            url
         }
         eidolons {
            image {
               url
            }
            icon {
               url
            }
            name
            rank
            description
         }
         promotion_cost {
            max_level
            material_qty {
               materials {
                  id
                  icon {
                     url
                  }
                  rarity {
                     display_number
                  }
                  name
               }
               qty
            }
         }
         cv_cn
         cv_jp
         cv_kr
         cv_en
         camp
         story {
            title
            unlock
            text
         }
         voice_lines {
            title
            text
            voice_en {
               url
            }
            voice_jp {
               url
            }
            voice_cn {
               url
            }
            voice_kr {
               url
            }
         }
      }
   }
`;

const SkillTreeQuery = gql`
   query ($entryId: JSON) {
      skillTree: SkillTrees(
         limit: 1000
         where: { character: { equals: $entryId } }
      ) {
         docs {
            anchor
            icon {
               url
            }
            name
            affected_skill {
               description_per_level {
                  description
               }
            }
            description
            level_up_cost {
               material_qty {
                  id
                  materials {
                     id
                     icon {
                        url
                     }
                     rarity {
                        display_number
                     }
                     name
                  }
                  qty
               }
            }
            req_ascension
            req_level
         }
      }
   }
`;
