import { Attributes } from "./attributes";
import { Elements } from "./elements";
import { ItemBagSlots } from "./itemBagSlots";
import { ItemCategories } from "./itemCategories";
import { Items } from "./items";
import { Rarities } from "./rarities";
import { ThropyCategories } from "./thropyCategories";
import { ThropyGroups } from "./thropyGroups";
import { TrophyCategories } from "./trophy-categories";
import { TrophyGroups } from "./trophy-groups";
import { Trophies } from "./trophies";
import { WeaponCurves } from "./weaponCurves";
import { Weapons } from "./weapons";
import { WeaponTypes } from "./weaponTypes";

export const CustomCollections = [
  Attributes,
  Elements,
  ItemBagSlots,
  ItemCategories,
  Items,
  Rarities,
  ThropyCategories,
  ThropyGroups,
  TrophyCategories,
  TrophyGroups,
  Trophies,
  WeaponCurves,
  Weapons,
  WeaponTypes,
];

export const CustomSearchCollections = ["items", "trophies", "weapons"];

export const CustomDefaultPriorities = {
  weapons: 90,
  items: 80,
  trophies: 70,
};
