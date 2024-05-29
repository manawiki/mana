import { Factions } from "./factions";
import { Materials } from "./materials";
import { MaterialTypes } from "./material-types";
import { Medals } from "./medals";
import { MedalSets } from "./medal-sets";
import { MedalTypes } from "./medal-types";
import { Operators } from "./operators";
import { OperatorTags } from "./operator-tags";
import { Positions } from "./positions";
import { Professions } from "./professions";
import { RangesData } from "./ranges-data";
import { Rarities } from "./rarities";
import { SkinBrands } from "./skin-brands";
import { SkinQuotes } from "./skin-quotes";
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
