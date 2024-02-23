#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

# Importing Costumes (301b) and latesr
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