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

import { CharacterStatBlock } from "~/_custom/components/characters/CharacterStatBlock";
import { ImageGallery } from "~/_custom/components/characters/ImageGallery";
import { SkillTree } from "~/_custom/components/characters/SkillTree";
import { PromotionCost } from "~/_custom/components/characters/PromotionCost";
import { Traces } from "~/_custom/components/characters/Traces";
import { Eidolons } from "~/_custom/components/characters/Eidolons";
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
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as Character;

   // ======================
   // Pull Skill Tree data for character
   // ======================

   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const url = `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/skillTrees?limit=20&depth=3&where[character][equals]=${entryId}`;
   const skillTreeRaw = await (await fetch(url)).json();
   const skillTreeData = skillTreeRaw.docs;

   return json({ entryDefault, defaultData, skillTreeData });
}

export default function CharacterEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   const { skillTreeData } = useLoaderData<typeof loader>();

   // console.log(defaultData);
   // console.log(skillTreeData);
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            {/* Character Image with Element / Path */}
            <CharacterStatBlock pageData={defaultData} />

            {/* Traces / Skills */}
            <H2 text="Traces" />
            <Traces pageData={defaultData} skillTreeData={skillTreeData} />

            {/* Skill Tree */}
            <H2 text="Tree" />
            <SkillTree pageData={defaultData} skillTreeData={skillTreeData} />

            {/* Eidolons */}
            <H2 text="Eidolons" />
            <Eidolons pageData={defaultData} />

            {/* Promotion Costs */}
            <H2 text="Promotion Cost" />
            <PromotionCost pageData={defaultData} />

            {/* Image Gallery Section showing all relevant images */}
            <H2 text="Image Gallery" />
            <ImageGallery pageData={defaultData} />

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
