import { Attributes } from "./attributes";
import { Elements } from "./elements";
import { ItemBagSlots } from "./item-bag-slots";
import { ItemCategories } from "./item-categories";
import { Items } from "./items";
import { Rarities } from "./rarities";
import { TrophyCategories } from "./trophy-categories";
import { TrophyGroups } from "./trophy-groups";
import { Trophies } from "./trophies";
import { WeaponCurves } from "./weapon-curves";
import { Weapons } from "./weapons";
import { WeaponTypes } from "./weapon-types";

export const CustomCollections = [
  Attributes,
  Elements,
  ItemBagSlots,
  ItemCategories,
  Items,
  Rarities,
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
