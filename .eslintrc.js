/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
  "rules": {
     //import
     "import/no-cycle": "error",
     "import/no-unresolved": "error",
     "import/no-default-export": "warn",
     "import/order": [
       "error",
       {
         "groups": ["builtin", "external", "internal"],
         "pathGroups": [
           {
             "pattern": "react",
             "group": "external",
             "position": "before"
           }
         ],
         "pathGroupsExcludedImportTypes": ["react"],
         "newlines-between": "always",
         "alphabetize": {
           "order": "asc",
           "caseInsensitive": true
         }
       }
     ],
  },
  "overrides": [
    {
      "files": [
        "./app/root.tsx",
        "./app/entry.client.tsx",
        "./app/entry.server.tsx",
        "./app/routes/**/*.tsx"
      ],
      "rules": {
        "import/no-default-export": "off"
      }
    }
  ]
};
