const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
   future: {
      v2_routeConvention: true,
      v2_meta: true,
      unstable_postcss: true,
      unstable_tailwind: true,
   },
   ignoredRouteFiles: ["**/.*"],
   routes: async (defineRoutes) => {
      return flatRoutes(["routes", "_custom/routes"], defineRoutes);
   },
   serverDependenciesToBundle: ["nanoid"],
};
