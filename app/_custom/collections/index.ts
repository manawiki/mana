import { Factions } from './factions';
import { Materials } from './materials';
import { MaterialTypes } from './materialTypes';
import { Medals } from './medals';
import { MedalSets } from './medalSets';
import { MedalTypes } from './medalTypes';
import { Operators } from './operators';
import { OperatorTags } from './operatorTags';
import { Positions } from './positions';
import { Professions } from './professions';
import { Rarities } from './rarities';

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
    Rarities
];

export const CustomSearchCollections = [
    "materials",
    "medals",
    "operators"
];

export const CustomDefaultPriorities = {
    materials: 50,
    medals: 40,
    operators: 60
};
