import { _Classes } from "./_classes";
import { _Companies } from "./_companies";
import { _Rarities } from "./_rarities";
import { _WarehouseCategories } from "./_warehouseCategories";
import { Dolls } from "./dolls";
import { Items } from "./items";
import { Skins } from "./skins";
import { SkinThemes } from "./skinThemes";

export const CustomCollections = [
   _Classes,
   _Companies,
   _Rarities,
   _WarehouseCategories,
   Dolls,
   Items,
   Skins,
   SkinThemes,
];

export const CustomSearchCollections = [
   "dolls",
   "items",
   "skins",
   "skinThemes",
];

export const CustomDefaultPriorities = {
   dolls: 70,
   items: 60,
   skins: 50,
};
