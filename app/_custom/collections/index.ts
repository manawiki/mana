import { _Rarities } from "./_rarities";
import { _WarehouseCategories } from "./_warehouseCategories";
import { Dolls } from "./dolls";
import { Items } from "./items";

export const CustomCollections = [
   _Rarities,
   _WarehouseCategories,
   Dolls,
   Items,
];

export const CustomSearchCollections = [
   "dolls",
   "items",
];

export const CustomDefaultPriorities = {
   dolls: 70,
   items: 60,
};
