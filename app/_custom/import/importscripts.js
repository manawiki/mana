#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"
#"import_servant_stats": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_301a_ServantStats.ts"



# Items
pnpm import_collection_data collection:materials,filename:Item.json,idname:drupal_nid,sync:false,overwrite:false

# _EnemyTraits
pnpm import_collection_data collection:_enemy-traits,filename:_EnemyTrait.json,idname:drupal_tid,sync:false,overwrite:false
# _Trait
pnpm import_collection_data collection:_traits,filename:_Trait.json,idname:drupal_tid,sync:false,overwrite:false
# _StatusEffect
pnpm import_collection_data collection:_status-effects,filename:_StatusEffect.json,idname:drupal_tid,sync:false,overwrite:false
# _BuffCategory
pnpm import_collection_data collection:_buff-categories,filename:_BuffCategory.json,idname:drupal_tid,sync:false,overwrite:false
# _SkillClassificationSpecific
pnpm import_collection_data collection:_skill-classification-specifics,filename:_SkillClassificationSpecific.json,idname:drupal_tid,sync:false,overwrite:false
# _SkillImage
pnpm import_collection_data collection:_skill-images,filename:_SkillImage.json,idname:drupal_tid,sync:false,overwrite:false
# _Tag
pnpm import_collection_data collection:_tags,filename:_Tag.json,idname:drupal_tid,sync:false,overwrite:false

# _CV
pnpm import_collection_data collection:_cvs,filename:_CV.json,idname:data_key,sync:false,overwrite:false
# _Illustrator
pnpm import_collection_data collection:_illustrators,filename:_Illustrator.json,idname:data_key,sync:false,overwrite:false

# ServantSkill
pnpm import_collection_data collection:servant-skills,filename:ServantSkill.json,idname:drupal_nid,sync:false,overwrite:false

# _ClassSkillType
pnpm import_collection_data collection:_class-skill-types,filename:_ClassSkillType.json,idname:drupal_tid,sync:false,overwrite:false
# ClassSkill
pnpm import_collection_data collection:class-skills,filename:ClassSkill.json,idname:drupal_nid,sync:false,overwrite:false

# NoblePhantasm
pnpm import_collection_data collection:noble-phantasms,filename:NoblePhantasm.json,idname:drupal_nid,sync:false,overwrite:false

# _Chapter
pnpm import_collection_data collection:_chapters,filename:_Chapter.json,idname:drupal_tid,sync:false,overwrite:false

# Servant
pnpm import_collection_data collection:servants,filename:Servant.json,idname:drupal_nid,sync:false,overwrite:false
# ServantStat
pnpm import_collection_data collection:servants,filename:ServantStat.json,idname:drupal_nid,sync:false,overwrite:false

# CE
pnpm import_collection_data collection:craft-essences,filename:CE.json,idname:drupal_nid,sync:true,overwrite:false

# Importing Costumes (301b) and later
pnpm import_collection_data collection:costumes,filename:Costume.json,idname:drupal_nid,sync:false,overwrite:false

# Command Codes
pnpm import_collection_data collection:command-codes,filename:CommandCode.json,idname:drupal_nid,sync:true,overwrite:false



# _Class Rarities
pnpm import_collection_data collection:_class-rarities,filename:_ClassRarity.json,idname:drupal_tid,sync:false,overwrite:false
# _Enemy Types
pnpm import_collection_data collection:_enemy-types,filename:_EnemyType.json,idname:drupal_tid,sync:false,overwrite:false
# Enemies
pnpm import_collection_data collection:enemies,filename:Enemy.json,idname:drupal_nid,sync:false,overwrite:false

# Locations
pnpm import_collection_data collection:locations,filename:Location.json,idname:drupal_nid,sync:false,overwrite:false


# _Manga Character Images
pnpm import_collection_data collection:_manga-character-images,filename:_MangaCharacterImage.json,idname:drupal_tid,sync:false,overwrite:false
# _Manga Series
pnpm import_collection_data collection:_manga-series,filename:_MangaSeries.json,idname:drupal_tid,sync:false,overwrite:false
# Manga Pages
pnpm import_collection_data collection:manga-pages,filename:MangaPage.json,idname:drupal_nid,sync:false,overwrite:false

# Mystic Code Skills
pnpm import_collection_data collection:mystic-code-skills,filename:MysticCodeSkill.json,idname:drupal_nid,sync:false,overwrite:false
# Mystic Codes
pnpm import_collection_data collection:mystic-codes,filename:MysticCode.json,idname:drupal_nid,sync:false,overwrite:false

# Quests
pnpm import_collection_data collection:quests,filename:Quest.json,idname:drupal_nid,sync:false,overwrite:false
# _BreakBars
pnpm import_collection_data collection:_break-bars,filename:_BreakBar.json,idname:drupal_tid,sync:false,overwrite:false

# Banners
pnpm import_collection_data collection:summon-events,filename:SummonEvent.json,idname:drupal_nid,sync:false,overwrite:false

# ServantRedirects
pnpm import_collection_data collection:servant-redirects,filename:ServantRedirect.json,idname:drupal_nid,sync:false,overwrite:false