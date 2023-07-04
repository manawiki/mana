1) Run all Parsers for HSR (see https://github.com/naluwiki/Parsers/tree/main/HonkaiStarRail) and save JSON output for data to import.

2) Place all json files into the import_files folder and run the "renameAllFiles.ps1" powershell script to remove date and type prefix/suffix for import script to accept the files.

3) In the root directory, ensure .env variables are set.

4) Run in the root directory (imports ALL existing collection types): pnpm importall

Note: Package.json scripts needs to have the following added:

      "seed": "cross-env PAYLOAD_CONFIG_PATH=payload.config.ts ts-node -T app/_custom/seed/index.ts",
	  "importtest": "cross-env PAYLOAD_CONFIG_PATH=payload.config.ts ts-node -T app/_custom/import/import_Materials.ts",
	  "importall": "cross-env PAYLOAD_CONFIG_PATH=payload.config.ts ts-node -T app/_custom/import/import_termPath.ts && ts-node -T app/_custom/import/import_termElement.ts && ts-node -T app/_custom/import/import_termStattype.ts"