import { _CharacterCamps } from "./_character-camps";
import { _DamageElements } from "./_damage-elements";
import { _DamageTypes } from "./_damage-types";
import { _DescIcons } from "./_desc-icons";
import { _Rarities } from "./_rarities";
import { _Stats } from "./_stats";
import { Agents } from "./agents";
import { Bangboos } from "./bangboos";
import { Materials } from "./materials";
import { Skills } from "./skills";
import { Talents } from "./talents";

export const CustomCollections = [
  Agents,
  Bangboos,
  Materials,
  Skills,
  Talents,
  _CharacterCamps,
  _DamageElements,
  _DamageTypes,
  _DescIcons,
  _Rarities,
  _Stats,
];

export const CustomSearchCollections = ["agents", "bangboos", "materials"];

export const CustomDefaultPriorities = {
  agents: 90,
  bangboos: 70,
  materials: 30,
};
