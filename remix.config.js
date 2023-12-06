const { flatRoutes } = require("remix-flat-routes");

const customConfig = require("./app/_custom/config.json");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
   serverModuleFormat: "cjs",
   tailwind: true,
   postcss: true, // commented out to speed up hmr, uncomment if you need to use postcss.
   publicPath: process.env.STATIC_URL
      ? `${process.env.STATIC_URL}/build/`
      : "/build/",
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
};

// flat routes with mana characteristics
async function manaRoutes(defineRoutes) {
   let routes = flatRoutes(["routes", "_custom/routes"], defineRoutes);

   if (customConfig?.domain) {
      routes = {
         ...routes,
         "routes/_home+/_layout": {
            id: "routes/_home+/_layout",
            parentId: "root",
            file: "routes/_site+/$siteId+/_layout.tsx",
         },
         "routes/_home+/_index": {
            index: true,
            id: "routes/_home+/_index",
            parentId: "routes/_home+/_layout",
            file: "routes/_site+/$siteId+/_index.tsx",
         },
      };
   }
   return routes;
}
