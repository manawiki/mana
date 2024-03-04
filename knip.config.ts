import type { KnipConfig } from "knip";

export default {
   entry: ["core.server.ts"],
   ignore: ["types/**/*.d.ts"],
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
