import { Factions } from "./factions";
import { Materials } from "./materials";
import { MaterialTypes } from "./materialTypes";
import { Medals } from "./medals";
import { MedalSets } from "./medalSets";
import { MedalTypes } from "./medalTypes";
import { Operators } from "./operators";
import { OperatorTags } from "./operatorTags";
import { Positions } from "./positions";
import { Professions } from "./professions";
import { RangesData } from "./rangesData";
import { Rarities } from "./rarities";
import { SkinBrands } from "./skinBrands";
import { SkinQuotes } from "./skinQuotes";
import { Skins } from "./skins";

export const CustomCollections = [
   Factions,
   Materials,
   MaterialTypes,
   Medals,
   MedalSets,
   MedalTypes,
   Operators,
   OperatorTags,
   Positions,
   Professions,
   RangesData,
   Rarities,
   SkinBrands,
   SkinQuotes,
   Skins,
];

export const CustomSearchCollections = [
   "materials",
   "medals",
   "operators",
   "skins",
];

export const CustomDefaultPriorities = {
   medals: 20,
   materials: 30,
   skins: 40,
   operators: 60,
};
