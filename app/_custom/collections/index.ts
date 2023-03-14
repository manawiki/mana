import { Materials } from "./materials";
import { Character } from "./character";
import { Trace } from "./trace";
import { Eidolon } from "./eidolon";
import { SkillTree } from "./skillTree";
import { LightCone } from "./lightCone";
import { RelicSet } from "./relicSet";
import { Relic } from "./relic";
import { EnemySkill } from "./enemySkill";
import { Enemy } from "./enemy";
import { Achievement } from "./achievement";

import { termRarity } from "./termRarity";
import { termElement } from "./termElement";
import { termStattype } from "./termStattype";
import { termPath } from "./termPath";
import { termItemtype } from "./termItemtype";
import { termRelicstat } from "./termRelicstat";
import { termEnemystatusres } from "./termEnemystatusres";
import { termAchievementseries } from "./termAchievementseries";

export const CustomCollections = [
   Character,
   Materials,
   Trace,
   Eidolon,
   SkillTree,
   LightCone,
   RelicSet,
   Relic,
   EnemySkill,
   Enemy,
   Achievement,
   termElement,
   termItemtype,
   termPath,
   termRarity,
   termStattype,
   termRelicstat,
   termEnemystatusres,
   termAchievementseries,
];
