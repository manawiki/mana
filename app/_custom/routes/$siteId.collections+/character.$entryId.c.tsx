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
import type { CharacterLKJ16E5IhH } from "payload/generated-types";
import { Image } from "~/components/Image";

import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { SkillTree } from "~/_custom/components/characters/SkillTree";
import { PromotionCost } from "~/_custom/components/characters/PromotionCost";
import { Traces } from "~/_custom/components/characters/Traces";
import { Eidolons } from "~/_custom/components/characters/Eidolons";
import { VoiceLines } from "~/_custom/components/characters/VoiceLines";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as CharacterLKJ16E5IhH;

   //Feel free to query for more data here

   // ======================
   // Pull Skill Tree data for character
   // ======================
   const url = new URL(request.url).pathname;
   const cid = url.split("/")[4];

   const skillTreeRaw = await payload.find({
      // @ts-ignore
      collection: `skillTree-lKJ16E5IhH`,
      where: {
         character: {
            equals: "character-" + cid,
         },
      },
      depth: 3,
      limit: 20,
   });

   const skillTreeData = skillTreeRaw.docs;

   // ======================
   // ======================

   return json({ entryDefault, defaultData, skillTreeData });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   const { skillTreeData } = useLoaderData<typeof loader>();

   console.log(defaultData);
   console.log(skillTreeData);
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Character Image with Element / Path */}
            <CharacterStatBlock pageData={defaultData} />

            {/* Traces / Skills */}
            <h2>Traces</h2>
            <Traces pageData={defaultData} skillTreeData={skillTreeData} />

            {/* Skill Tree */}
            <h2>Tree</h2>
            <SkillTree pageData={defaultData} skillTreeData={skillTreeData} />

            {/* Eidolons */}
            <h2>Eidolons</h2>
            <Eidolons pageData={defaultData} />

            {/* Promotion Costs */}
            <h2>Promotion Cost</h2>
            <PromotionCost pageData={defaultData} />

            {/* Image Gallery Section showing all relevant images */}
            <h2>Image Gallery</h2>
            <ImageGallery pageData={defaultData} />

            {/* Voice Line Section */}
            <VoiceLines pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}

const Stats = () => {
   return <div>This is stats</div>;
};

// ========================================
// Lol manually putting stat data in for now since not sure if Strapi ready to go
// --- Will be loaded properly from DB ---
// ========================================
// ========================================
// ========================================
