import { Types } from "./_types";
import { EvolutionRequirements } from "./evolution-requirements";
import { Moves } from "./moves";
import { Pokemon } from "./pokemon";
import { RaidGuides } from "./raid-guides";
import { Weather } from "./weather";

export const CustomCollections = [
   Pokemon,
   Moves,
   Types,
   Weather,
   EvolutionRequirements,
   RaidGuides,
];

export const CustomSearchCollections = ["pokemon", "moves", "raid-guides"];

export const CustomDefaultPriorities = {
   pokemon: 70,
   "raid-guides": 70,
   moves: 60,
};
