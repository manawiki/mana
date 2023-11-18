import { _EnergyShardTypes } from "./_energy-shard-types";
import { _FactorySkillTypes } from "./_factory-skill-types";
import { _ItemObtainWays } from "./_item-obtain-ways";
import { _ItemShowingTypes } from "./_item-showing-types";
import { _ItemTypes } from "./_item-types";
import { _ItemValuableTabTypes } from "./_item-valuable-tab-types";
import { _Professions } from "./_professions";
import { _Rarities } from "./_rarities";
import { _Stats } from "./_stats";
import { _WeaponTypes } from "./_weapon-types";
import { Buildings } from "./buildings";
import { Characters } from "./characters";
import { FactorySkills } from "./factory-skills";
import { Materials } from "./materials";
import { Skills } from "./skills";

export const CustomDefaultPriorities = {
   characters: 90,
   materials: 30,
};

export const CustomSearchCollections = ["characters", "materials"];

export const CustomCollections = [
   Characters,
   Materials,
   Skills,
   FactorySkills,
   Buildings,
   _EnergyShardTypes,
   _FactorySkillTypes,
   _ItemObtainWays,
   _ItemShowingTypes,
   _ItemTypes,
   _ItemValuableTabTypes,
   _Professions,
   _Rarities,
   _Stats,
   _WeaponTypes,
];
