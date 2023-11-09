import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { SkillTree as SkillTreeType } from "payload/generated-custom-types";

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
import { H2 } from "~/components/Headers";
import { Entry } from "~/routes/_site+/$siteId.c_+/components/Entry";
import {
   customEntryMeta,
   fetchEntry,
} from "~/routes/_site+/$siteId.c_+/functions/entry";
import { fetchWithCache } from "~/utils/cache.server";

export { customEntryMeta as meta };
export { ErrorBoundary } from "~/components/ErrorBoundary";

async function fetchGQL(query: string, variables?: Record<string, any>) {
   const { data, errors } = await fetchWithCache(
      `https://${settings.siteId}-db.${settings.domain}/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query,
            variables,
         }),
      },
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      // throw new Error();
   }

   return data;
}

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

export default function CharacterEntry() {
   const { entry, skillTreeData } = useLoaderData<typeof loader>();

   const links = [
      { name: "Traces", link: "traces" },
      { name: "Skill Tree", link: "tree" },
      { name: "Eidolons", link: "eidolons" },
      { name: "Materials", link: "promotion" },
      { name: "Gallery", link: "gallery" },
      { name: "Profile", link: "profile" },
   ];

   return (
      <Entry>
         {/* Shortcut Navigation */}
         <Navigation links={links} />

         {/* Character Image with Element / Path */}
         <CharacterStatBlock pageData={entry.data.character} />
         <div id="traces"></div>
         {/* Traces / Skills */}
         <H2 text="Traces" />
         <Traces
            pageData={entry.data.character}
            skillTreeData={skillTreeData}
         />

         <div id="tree"></div>
         {/* Skill Tree */}
         <H2 text="Tree" />
         <SkillTree
            pageData={entry.data.character}
            skillTreeData={skillTreeData}
         />

         <div id="eidolons"></div>
         {/* Eidolons */}
         <H2 text="Eidolons" />
         <Eidolons pageData={entry.data.character} />

         <div id="promotion"></div>
         {/* Promotion Costs */}
         <H2 text="Promotion Cost" />
         <PromotionCost pageData={entry.data.character} />

         {/* Total Materials */}
         <H2 text="Total Material Cost" />
         <TotalMaterialCost
            pageData={entry.data.character}
            skillTreeData={skillTreeData}
         />

         <div id="gallery"></div>
         {/* Image Gallery Section showing all relevant images */}
         <H2 text="Image Gallery" />
         <ImageGallery pageData={entry.data.character} />

         {/* Video Section */}
         <Videos pageData={entry.data.character} />

         <div id="profile"></div>
         {/* Profile Data/CV */}
         <Profile pageData={entry.data.character} />

         {/* Story Section with drop downs */}
         <Story pageData={entry.data.character} />

         {/* Voice Line Section */}
         <VoiceLines pageData={entry.data.character} />
      </Entry>
   );
}

const CharacterQuery = `
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

const SkillTreeQuery = `
query ($entryId: JSON) {
 skillTree: SkillTrees(limit: 1000, where: { character: { equals: $entryId } }) {
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
