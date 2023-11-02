import { Types } from "./_types";
import { EvolutionRequirements } from "./evolution-requirements";
import { Moves } from "./moves";
import { Pokemon } from "./pokemon";
import { Weather } from "./weather";

export const CustomCollections = [
   Pokemon,
   Moves,
   Types,
   Weather,
   EvolutionRequirements,
];

export const CustomSearchCollections = ["pokemon", "moves"];

export const CustomDefaultPriorities = {
   pokemon: 70,
   moves: 60,
};
