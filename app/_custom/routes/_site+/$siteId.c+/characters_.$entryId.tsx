import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type {
   Character,
   SkillTree as SkillTreeType,
} from "payload/generated-custom-types";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { Eidolons } from "~/_custom/components/characters/Eidolons";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { Navigation } from "~/_custom/components/characters/Navigation";
import { Profile } from "~/_custom/components/characters/Profile";
import { PromotionCost } from "~/_custom/components/characters/PromotionCost";
import { SkillTree } from "~/_custom/components/characters/SkillTree";
import { Story } from "~/_custom/components/characters/Story";
import { TotalMaterialCost } from "~/_custom/components/characters/TotalMaterialCost";
import { Traces } from "~/_custom/components/characters/Traces";
import { Videos } from "~/_custom/components/characters/Videos";
import { VoiceLines } from "~/_custom/components/characters/VoiceLines";
import { H2Default } from "~/components/H2";
import {
   Entry,
   EntryContentEmbed,
} from "~/routes/_site+/$siteId.c_+/src/components";
import {
   getAllEntryData,
   meta,
} from "~/routes/_site+/$siteId.c_+/src/functions";
import { fetchWithCache } from "~/utils/cache.server";

export { meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });

   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query: CharacterQuery,
            variables: {
               id: entryId, //this has to be String! for some reason
               charId: entryId, //this has to be JSON for some reason
            },
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      // throw new Error();
   }
   return json({
      entry,
      entryDefault: data.character as Character,
      skillTreeData: data.skillTree.docs as SkillTreeType[],
   });
}

export default function CharacterEntry() {
   const { entryDefault, skillTreeData } = useLoaderData<typeof loader>();

   console.log(entryDefault);

   const links = [
      { name: "Traces", link: "traces" },
      { name: "Skill Tree", link: "tree" },
      { name: "Eidolons", link: "eidolons" },
      { name: "Materials", link: "promotion" },
      { name: "Gallery", link: "gallery" },
      { name: "Profile", link: "profile" },
   ];

   return <div>test</div>;

   return (
      <Entry>
         {/* Shortcut Navigation */}
         <Navigation links={links} />

         {/* Character Image with Element / Path */}
         <CharacterStatBlock pageData={entryDefault} />
         <EntryContentEmbed title="Teams" sectionId="teams" />
         <EntryContentEmbed
            title="Recommended Light Cones"
            sectionId="light-cones"
         />
         <div id="traces"></div>
         {/* Traces / Skills */}
         <H2Default text="Traces" />
         <Traces pageData={entryDefault} skillTreeData={skillTreeData} />

         <div id="tree"></div>
         {/* Skill Tree */}
         <H2Default text="Tree" />
         <SkillTree pageData={entryDefault} skillTreeData={skillTreeData} />

         <div id="eidolons"></div>
         {/* Eidolons */}
         <H2Default text="Eidolons" />
         <Eidolons pageData={entryDefault} />

         <div id="promotion"></div>
         {/* Promotion Costs */}
         <H2Default text="Promotion Cost" />
         <PromotionCost pageData={entryDefault} />

         {/* Total Materials */}
         <H2Default text="Total Material Cost" />
         <TotalMaterialCost
            pageData={entryDefault}
            skillTreeData={skillTreeData}
         />

         <div id="gallery"></div>
         {/* Image Gallery Section showing all relevant images */}
         <H2Default text="Image Gallery" />
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
      </Entry>
   );
}

const CharacterQuery = `
query ($id: String!, $charId: JSON) {
 character: Character(id: $id) {
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
