import { _ItemObtainWays } from "./_item-obtain-ways";
import { _ItemShowingTypes } from "./_item-showing-types";
import { _ItemTypes } from "./_item-types";
import { _ItemValuableTabTypes } from "./_item-valuable-tab-types";
import { _Rarities } from "./_rarities";
import { Materials } from "./materials";

export const CustomDefaultPriorities = {
   materials: 30,
};

export const CustomSearchCollections = ["materials"];

export const CustomCollections = [
   Materials,
   _ItemObtainWays,
   _ItemShowingTypes,
   _ItemTypes,
   _ItemValuableTabTypes,
   _Rarities,
];
