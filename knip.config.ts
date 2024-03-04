import type { KnipConfig } from "knip";

export default {
   entry: [
      "core.server.ts",
      "app/db/payload.custom.config.ts",
      "app/db/payload.config.ts ",
      "app/db/collections/index.ts",
      "app/_custom/collections/index.ts",
   ],
   ignore: ["types/**/*.d.ts", "public/**/*"],
   remix: { config: "remix.config.js" },
   rules: {
      binaries: "error",
      classMembers: "error",
      dependencies: "error",
      devDependencies: "error",
      duplicates: "error",
      enumMembers: "error",
      exports: "error",
      files: "error",
      nsExports: "error",
      nsTypes: "error",
      types: "error",
      unlisted: "error",
      unresolved: "error",
   },
} satisfies KnipConfig;
