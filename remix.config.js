const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
   serverModuleFormat: "cjs",
   tailwind: true,
   postcss: true, // commented out to speed up hmr, uncomment if you need to use postcss.
   serverDependenciesToBundle: [
      "nanoid",
      "react-code-block",
      /^remix-utils.*/,
      /^@epic-web.*/,
   ],
   // ignore all files in routes folder to prevent
   // default remix convention from picking up routes
   ignoredRouteFiles: ["**/.*"],
   routes: manaRoutes,
   browserNodeBuiltinsPolyfill: {
      modules: {
         buffer: true,
      },
   },
};

// flat routes with mana characteristics
async function manaRoutes(defineRoutes) {
   let routes = flatRoutes(["routes", "_custom/routes"], defineRoutes);

   if (process.env.IS_HOME) {
      routes = {
         ...routes,
         "routes/_site+/_layout": {
            id: "routes/_site+/_layout",
            parentId: "root",
            file: "routes/_home+/_layout.tsx",
         },
         "routes/_site+/_index/index": {
            index: true,
            id: "routes/_site+/_index",
            parentId: "routes/_site+/_layout",
            file: "routes/_home+/_index.tsx",
         },
      };
      return routes;
   }
   routes = {
      ...routes,
      "routes/_home+/_layout": {
         id: "routes/_home+/_layout",
         parentId: "root",
         file: "routes/_site+/_layout.tsx",
      },
      "routes/_home+/_index": {
         index: true,
         id: "routes/_home+/_index",
         parentId: "routes/_home+/_layout",
         file: "routes/_site+/_index/index.tsx",
      },
   };
   return routes;
}
