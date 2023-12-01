#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

# _Collections for Agent
pnpm import_collection_data collection:_rarities,filename:_Rarity.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_character-camps,filename:_CharacterCamp.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_damage-elements,filename:_DamageElement.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_damage-types,filename:_DamageType.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_desc-icons,filename:_DescIcon.json,idname:data_key,sync:false,overwrite:false
pnpm import_collection_data collection:_stats,filename:_Stat.json,idname:data_key,sync:false,overwrite:false

# Agents
pnpm import_collection_data collection:agents,filename:Agent.json,idname:data_key,sync:false,overwrite:false

# Skills
pnpm import_collection_data collection:skills,filename:Skill.json,idname:data_key,sync:false,overwrite:false

# Talents
pnpm import_collection_data collection:talents,filename:Talent.json,idname:data_key,sync:false,overwrite:false