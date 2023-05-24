import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";

import {
   EntryParent,
   EntryHeader,
   getDefaultEntryData,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import type { Character } from "payload/generated-types";

import { Navigation } from "~/_custom/components/characters/Navigation";
import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { SkillTree } from "~/_custom/components/characters/SkillTree";
import { Traces } from "~/_custom/components/characters/Traces";
import { Eidolons } from "~/_custom/components/characters/Eidolons";
import { PromotionCost } from "~/_custom/components/characters/PromotionCost";
import { TotalMaterialCost } from "~/_custom/components/characters/TotalMaterialCost";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { Videos } from "~/_custom/components/characters/Videos";
import { VoiceLines } from "~/_custom/components/characters/VoiceLines";
import { Profile } from "~/_custom/components/characters/Profile";
import { Story } from "~/_custom/components/characters/Story";

import { zx } from "zodix";
import { z } from "zod";
import { H2 } from "~/_custom/components/custom";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   /*const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as Character;*/

   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const CharacterQuery = `
   query ($id: String!) {
      character: Character(id: $id) {
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
    
      skillTree: SkillTrees(where: { character: { equals: $id } }) {
        docs {
          anchor
          name
          affected_skill {
            description_per_level {
              description
            }
          }
          level_up_cost {
            material_qty {
              id
              materials {
                icon {
                  url
                }
                rarity {
                  display_number
                }
                name
              }
            }
          }
          req_ascension
          req_level
        }
      }
    }    
   `

   const { data, errors } = await fetch(
      `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: CharacterQuery,
            variables: {
               charId: entryId,
            },
         }),
      }
   ).then((res) => res.json());

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({ entryDefault, defaultData: data.character, skillTreeData: data.skillTree.docs });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   const { skillTreeData } = useLoaderData<typeof loader>();

   const links = [
      { name: "Traces", link: "traces" },
      { name: "Skill Tree", link: "tree" },
      { name: "Eidolons", link: "eidolons" },
      { name: "Materials", link: "promotion" },
      { name: "Gallery", link: "gallery" },
      { name: "Profile", link: "profile" },
   ];
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Shortcut Navigation */}
            <Navigation links={links} />

            {/* Character Image with Element / Path */}
            <CharacterStatBlock pageData={defaultData} />

            <div id="traces"></div>
            {/* Traces / Skills */}
            <H2 text="Traces" />
            <Traces pageData={defaultData} skillTreeData={skillTreeData} />

            <div id="tree"></div>
            {/* Skill Tree */}
            <H2 text="Tree" />
            <SkillTree pageData={defaultData} skillTreeData={skillTreeData} />

            <div id="eidolons"></div>
            {/* Eidolons */}
            <H2 text="Eidolons" />
            <Eidolons pageData={defaultData} />

            <div id="promotion"></div>
            {/* Promotion Costs */}
            <H2 text="Promotion Cost" />
            <PromotionCost pageData={defaultData} />

            {/* Total Materials */}
            <H2 text="Total Material Cost" />
            <TotalMaterialCost
               pageData={defaultData}
               skillTreeData={skillTreeData}
            />

            <div id="gallery"></div>
            {/* Image Gallery Section showing all relevant images */}
            <H2 text="Image Gallery" />
            <ImageGallery pageData={defaultData} />

            {/* Video Section */}
            <Videos pageData={defaultData} />

            <div id="profile"></div>
            {/* Profile Data/CV */}
            <Profile pageData={defaultData} />

            {/* Story Section with drop downs */}
            <Story pageData={defaultData} />

            {/* Voice Line Section */}
            <VoiceLines pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}
