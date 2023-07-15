import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";

import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getEmbeddedContent,
} from "~/modules/collections";
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
import { EntryContentEmbed } from "~/modules/collections/components/EntryContentEmbed";

import type {
   Character,
   SkillTree as SkillTreeType,
} from "payload/generated-custom-types";
import { fetchWithCache } from "~/utils/cache.server";

export { meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const [embeddedContent, { data, errors }] = await Promise.all([
      getEmbeddedContent({
         collection: "characters",
         payload,
         params,
         request,
         user,
      }),
      fetchWithCache(
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
      ),
   ]);

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      throw new Error();
   }

   return json({
      entryDefault: data.character as Character,
      skillTreeData: data.skillTree.docs as SkillTreeType[],
      embeddedContent,
   });
}

export default function CharacterEntry() {
   const { entryDefault, skillTreeData, embeddedContent } =
      useLoaderData<typeof loader>();

   const links = [
      { name: "Traces", link: "traces" },
      { name: "Skill Tree", link: "tree" },
      { name: "Eidolons", link: "eidolons" },
      { name: "Materials", link: "promotion" },
      { name: "Gallery", link: "gallery" },
      { name: "Profile", link: "profile" },
   ];

   const { siteId, entryId } = useParams();
   const fetcher = useFetcher();
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Shortcut Navigation */}
            <Navigation links={links} />

            {/* Character Image with Element / Path */}
            <CharacterStatBlock pageData={entryDefault} />
            <EntryContentEmbed
               title="Teams"
               sectionId="teams"
               collectionEntity="characters"
               siteId={siteId}
               fetcher={fetcher}
               entryId={entryId}
               defaultValue={embeddedContent}
            />
            <EntryContentEmbed
               title="Recommended Light Cones"
               sectionId="light-cones"
               collectionEntity="characters"
               siteId={siteId}
               fetcher={fetcher}
               entryId={entryId}
               defaultValue={embeddedContent}
            />
            <div id="traces"></div>
            {/* Traces / Skills */}
            <H2 text="Traces" />
            <Traces pageData={entryDefault} skillTreeData={skillTreeData} />

            <div id="tree"></div>
            {/* Skill Tree */}
            <H2 text="Tree" />
            <SkillTree pageData={entryDefault} skillTreeData={skillTreeData} />

            <div id="eidolons"></div>
            {/* Eidolons */}
            <H2 text="Eidolons" />
            <Eidolons pageData={entryDefault} />

            <div id="promotion"></div>
            {/* Promotion Costs */}
            <H2 text="Promotion Cost" />
            <PromotionCost pageData={entryDefault} />

            {/* Total Materials */}
            <H2 text="Total Material Cost" />
            <TotalMaterialCost
               pageData={entryDefault}
               skillTreeData={skillTreeData}
            />

            <div id="gallery"></div>
            {/* Image Gallery Section showing all relevant images */}
            <H2 text="Image Gallery" />
            <ImageGallery pageData={entryDefault} />

            {/* Video Section */}
            <Videos pageData={entryDefault} />

            <div id="profile"></div>
            {/* Profile Data/CV */}
            <Profile pageData={entryDefault} />

            {/* Story Section with drop downs */}
            <Story pageData={entryDefault} />

            {/* Voice Line Section */}
            <VoiceLines pageData={entryDefault} />
         </EntryContent>
      </EntryParent>
   );
}

const CharacterQuery = `
query ($charId: String!) {
 character: Character(id: $charId) {
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

 skillTree: SkillTrees(limit: 1000, where: { character: { equals: $charId } }) {
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
