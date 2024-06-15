#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

# _Collections for Agent etc, usually don't change much
pnpm import_collection_data collection:_rarities,filename:_Rarity.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_character-camps,filename:_CharacterCamp.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_damage-elements,filename:_DamageElement.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_damage-types,filename:_DamageType.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_desc-icons,filename:_DescIcon.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_stats,filename:_Stat.json,idname:data_key,sync:false,overwrite:false

# MaterialClasses
pnpm import_collection_data collection:_material-classes,filename:_MaterialClass.json,idname:data_key,sync:false,overwrite:false
# Materials
pnpm import_collection_data collection:materials,filename:Material.json,idname:data_key,sync:false,overwrite:false

# Agents
pnpm import_collection_data collection:agents,filename:Agent.json,idname:data_key,sync:false,overwrite:false
# Skills
pnpm import_collection_data collection:skills,filename:Skill.json,idname:data_key,sync:false,overwrite:false
# Talents
pnpm import_collection_data collection:talents,filename:Talent.json,idname:data_key,sync:false,overwrite:false

# Bangboos
pnpm import_collection_data collection:bangboos,filename:Bangboo.json,idname:data_key,sync:false,overwrite:false
# Bangboo-Skills
pnpm import_collection_data collection:bangboo-skills,filename:BangbooSkill.json,idname:data_key,sync:false,overwrite:false
# Bangboo-Talents
pnpm import_collection_data collection:bangboo-talents,filename:BangbooTalent.json,idname:data_key,sync:false,overwrite:false

# W-Engines
pnpm import_collection_data collection:w-engines,filename:WEngine.json,idname:data_key,sync:false,overwrite:false
# Weapon Level + Weapon Star JSON constants
pnpm import_collection_data collection:_data-jsons,filename:_DataJsonsWLevelStar.json,idname:data_key,sync:false,overwrite:false

# Disk Drives
pnpm import_collection_data collection:disk-drive-sets,filename:DiskDriveSet.json,idname:data_key,sync:false,overwrite:false