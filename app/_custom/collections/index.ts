import { Attributes } from "./attributes";
import { ConvenePools } from "./convene-pools";
import { ConveneTypes } from "./convene-types";
import { CookingRecipes } from "./cooking-recipes";
import { EchoClasses } from "./echo-classes";
import { EchoSkills } from "./echo-skills";
import { Echoes } from "./echoes";
import { EchoMainSubStats } from "./echo-main-sub-stats";
import { Elements } from "./elements";
import { ItemBagSlots } from "./item-bag-slots";
import { ItemCategories } from "./item-categories";
import { Items } from "./items";
import { Monsters } from "./monsters";
import { Namecards } from "./namecards";
import { ObtainDatas } from "./obtain-datas";
//import { QuestTypes } from "./quest-types";
//import { Quests } from "./quests";
import { Rarities } from "./rarities";
import { ResonatorCurves } from "./resonator-curves";
import { ResonatorSkillTrees } from "./resonator-skill-trees";
import { ResonatorSkillTypes } from "./resonator-skill-types";
import { ResonatorSkills } from "./resonator-skills";
import { Resonators } from "./resonators";
import { SonataEffects } from "./sonata-effects";
import { SynthesisRecipes } from "./synthesis-recipes";
import { Trophies } from "./trophies";
import { TrophyCategories } from "./trophy-categories";
import { TrophyGroups } from "./trophy-groups";
import { Tutorials } from "./tutorials";
import { WeaponCurves } from "./weapon-curves";
import { WeaponTypes } from "./weapon-types";
import { Weapons } from "./weapons";

export const CustomCollections = [
   Attributes,
   ConvenePools,
   ConveneTypes,
   CookingRecipes,
   EchoClasses,
   EchoSkills,
   Echoes,
   EchoMainSubStats,
   Elements,
   ItemBagSlots,
   ItemCategories,
   Items,
   Monsters,
   Namecards,
   ObtainDatas,
   //QuestTypes,
   //Quests,
   Rarities,
   ResonatorCurves,
   ResonatorSkillTrees,
   ResonatorSkillTypes,
   ResonatorSkills,
   Resonators,
   SonataEffects,
   SynthesisRecipes,
   Trophies,
   TrophyCategories,
   TrophyGroups,
   Tutorials,
   WeaponCurves,
   WeaponTypes,
   Weapons
];

export const CustomSearchCollections = [
   "echoes",
   "items",
   "monsters",
   "namecards",
   "resonators",
   "trophies",
   "weapons",
];

export const CustomDefaultPriorities = {
   echoes: 70,
   items: 60,
   monsters: 40,
   namecards: 30,
   resonators: 90,
   trophies: 50,
   weapons: 80,
};
