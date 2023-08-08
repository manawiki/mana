const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
   future: {
      v2_routeConvention: true,
      v2_meta: true,
      v2_normalizeFormMethod: true,
      v2_errorBoundary: true,
      v2_headers: true,
      v2_dev: true,
   },
   serverModuleFormat: "cjs",
   tailwind: true,
   postcss: true, // commented out to speed up hmr, uncomment if you need to use postcss.
   publicPath: process.env.STATIC_URL
      ? `${process.env.STATIC_URL}/build/`
      : "/build/",

   serverDependenciesToBundle: ["nanoid", "array-move"],
   // ignore all files in routes folder to prevent
   // default remix convention from picking up routes
   ignoredRouteFiles: ["**/.*"],
   routes: async (defineRoutes) => {
      let routes = flatRoutes(["routes", "_custom/routes"], defineRoutes);
      return routes;
   },
};
