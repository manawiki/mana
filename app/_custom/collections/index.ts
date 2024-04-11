import { _Alignments } from "./_alignments";
import { _Attributes } from "./_attributes";
import { _Availabilities } from "./_availabilities";
import { _BuffCategories } from "./_buff-categories";
import { _CeRarities } from "./_ce-rarities";
import { _CeTypeImages } from "./_ce-type-images";
import { _Chapters } from "./_chapters";
import { _ClassRarities } from "./_class-rarities";
import { _Classes } from "./_classes";
import { _ClassSkillTypes } from "./_class-skill-types";
import { _CommandCards } from "./_command-cards";
import { _CraftEssenceTypeSpecifics } from "./_craft-essence-type-specifics";
import { _Cvs } from "./_cvs";
import { _DeckLayouts } from "./_deck-layouts";
import { _EnemyTraits } from "./_enemy-traits";
import { _EnemyTypes } from "./_enemy-types";
import { _FieldTypes } from "./_field-types";
import { _Genders } from "./_genders";
import { _GrowthCurves } from "./_growth-curves";
import { _Illustrators } from "./_illustrators";
import { _InterludeQuestRewards } from "./_interlude-quest-rewards";
import { _ItemTypes } from "./_item-types";
import { _LevelUpSkillImportanceClassifications } from "./_level-up-skill-importance-classifications";
import { _MangaCharacterImages } from "./_manga-character-images";
import { _MangaSeries } from "./_manga-series";
import { _NPAttackTypes } from "./_np-attack-types";
import { _NPClassifications } from "./_np-classifications";
import { _QuestTypes } from "./_quest-types";
import { _Rarities } from "./_rarities";
import { _ReleaseStatuses } from "./_release-statuses";
import { _SkillClassificationSpecifics } from "./_skill-classification-specifics";
import { _SkillImages } from "./_skill-images";
import { _StarRarities } from "./_star-rarities";
import { _StatusEffects } from "./_status-effects";
import { _Tags } from "./_tags";
import { _Targets } from "./_targets";
import { _Traits } from "./_traits";
import { AppendSkills } from "./append-skills";
import { ClassSkills } from "./class-skills";
import { CommandCodes } from "./command-codes";
import { Costumes } from "./costumes";
import { CraftEssences } from "./craft-essences";
import { Enemies } from "./enemies";
import { Locations } from "./locations";
import { Materials } from "./materials";
import { MangaPages } from "./manga-pages";
import { MysticCodeSkills } from "./mystic-code-skills";
import { MysticCodes } from "./mystic-codes";
import { NoblePhantasms } from "./noble-phantasms";
import { Quests } from "./quests";
import { Servants } from "./servants";
import { ServantSkills } from "./servant-skills";

export const CustomDefaultPriorities = {
  servants: 90,
  "craft-essences": 70,
  "command-codes": 50,
  materials: 30,
};

export const CustomSearchCollections = [
  "servants",
  "craft-essences",
  "command-codes",
  "materials",
];

export const CustomCollections = [
  Servants,
  ServantSkills,
  NoblePhantasms,
  ClassSkills,
  AppendSkills,
  CraftEssences,
  CommandCodes,
  Materials,
  Costumes,
  Enemies,
  Locations,
  Quests,
  MangaPages,
  MysticCodeSkills,
  MysticCodes,
  _Alignments,
  _Attributes,
  _Availabilities,
  _BuffCategories,
  _CeRarities,
  _CeTypeImages,
  _Chapters,
  _ClassRarities,
  _Classes,
  _ClassSkillTypes,
  _CommandCards,
  _CraftEssenceTypeSpecifics,
  _Cvs,
  _DeckLayouts,
  _EnemyTraits,
  _EnemyTypes,
  _FieldTypes,
  _Genders,
  _GrowthCurves,
  _Illustrators,
  _InterludeQuestRewards,
  _ItemTypes,
  _LevelUpSkillImportanceClassifications,
  _MangaCharacterImages,
  _MangaSeries,
  _NPAttackTypes,
  _NPClassifications,
  _QuestTypes,
  _Rarities,
  _ReleaseStatuses,
  _SkillClassificationSpecifics,
  _SkillImages,
  _StarRarities,
  _StatusEffects,
  _Tags,
  _Targets,
  _Traits,
];
