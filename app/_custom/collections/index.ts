import { _CharacterCamps } from "./_character-camps";
import { _DamageElements } from "./_damage-elements";
import { _DamageTypes } from "./_damage-types";
import { Agents } from "./agents";

export const CustomCollections = [
  Agents,
  _CharacterCamps,
  _DamageElements,
  _DamageTypes,
];

export const CustomSearchCollections = ["agents"];

export const CustomDefaultPriorities = {
  agents: 90,
};
