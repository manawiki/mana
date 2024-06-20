#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

# Items
pnpm import_collection_data collection:materials,filename:Item.json,idname:drupal_nid,sync:false,overwrite:false

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

# Banners
pnpm import_collection_data collection:summon-events,filename:SummonEvent.json,idname:drupal_nid,sync:false,overwrite:false

# ServantRedirects
pnpm import_collection_data collection:servant-redirects,filename:ServantRedirect.json,idname:drupal_nid,sync:false,overwrite:false