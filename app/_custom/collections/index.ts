import { Attributes } from "./attributes";
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
import { Rarities } from "./rarities";
import { ResonatorCurves } from "./resonator-curves";
import { ResonatorSkillTrees } from "./resonator-skill-trees";
import { ResonatorSkillTypes } from "./resonator-skill-types";
import { ResonatorSkills } from "./resonator-skills";
import { Resonators } from "./resonators";
import { SonataEffects } from "./sonata-effects";
import { Trophies } from "./trophies";
import { TrophyCategories } from "./trophy-categories";
import { TrophyGroups } from "./trophy-groups";
import { Tutorials } from "./tutorials";
import { WeaponCurves } from "./weapon-curves";
import { WeaponTypes } from "./weapon-types";
import { Weapons } from "./weapons";

export const CustomCollections = [
   Attributes,
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
   Rarities,
   ResonatorCurves,
   ResonatorSkillTrees,
   ResonatorSkillTypes,
   ResonatorSkills,
   Resonators,
   SonataEffects,
   Trophies,
   TrophyCategories,
   TrophyGroups,
   Tutorials,
   WeaponCurves,
   WeaponTypes,
   Weapons
];

export const CustomSearchCollections = [
   "items",
   "trophies",
   "weapons",
   "echoes",
];

export const CustomDefaultPriorities = {
   weapons: 90,
   echoes: 80,
   items: 70,
   trophies: 60,
};
