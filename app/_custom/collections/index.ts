import { Attributes } from "./attributes";
import { EchoClasses } from "./echo-classes";
import { EchoSkills } from "./echo-skills";
import { Echoes } from "./echoes";
import { Elements } from "./elements";
import { ItemBagSlots } from "./item-bag-slots";
import { ItemCategories } from "./item-categories";
import { Items } from "./items";
import { Rarities } from "./rarities";
import { Resonators } from "./resonators";
import { ResonatorCurves } from "./resonator-curves";
import { SonataEffects } from "./sonata-effects";
import { Trophies } from "./trophies";
import { TrophyCategories } from "./trophy-categories";
import { TrophyGroups } from "./trophy-groups";
import { WeaponCurves } from "./weapon-curves";
import { WeaponTypes } from "./weapon-types";
import { Weapons } from "./weapons";

export const CustomCollections = [
   Attributes,
   EchoClasses,
   EchoSkills,
   Echoes,
   Elements,
   ItemBagSlots,
   ItemCategories,
   Items,
   Rarities,
   ResonatorCurves,
   Resonators,
   SonataEffects,
   Trophies,
   TrophyCategories,
   TrophyGroups,
   WeaponCurves,
   WeaponTypes,
   Weapons,
];

export const CustomSearchCollections = [
   "items",
   "trophies",
   "weapons",
   "echoes"
];

export const CustomDefaultPriorities = {
   weapons: 90,
   echoes: 80,
   items: 70,
   trophies: 60,
};
