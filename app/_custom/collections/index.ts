import { _CharacterCamps } from "./_character-camps";
import { _DamageElements } from "./_damage-elements";
import { _DamageTypes } from "./_damage-types";
import { Characters } from "./characters";

export const CustomCollections = [
  Characters,
  _CharacterCamps,
  _DamageElements,
  _DamageTypes,
];

export const CustomSearchCollections = ["characters"];

export const CustomDefaultPriorities = {
  characters: 90,
};
