#"import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

# Characters
pnpm import_collection_data collection:characters,filename:Character.json,idname:data_key,sync:false,overwrite:false