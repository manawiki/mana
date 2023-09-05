import { _Rarities } from "./_rarities";
import { _WarehouseCategories } from "./_warehouseCategories";
import { Dolls } from "./dolls";

export const CustomCollections = [
   Dolls, 
   _Rarities,
   _WarehouseCategories
];

export const CustomSearchCollections = [
   "dolls"
];

export const CustomDefaultPriorities = {
   dolls: 70,
};
