const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */

function getPublicPath() {
   const staticAssetsUrl = process.env.STATIC_URL;
   if (!staticAssetsUrl) return "/build/";
   return `${staticAssetsUrl}/build/`;
}

module.exports = {
   future: {
      v2_routeConvention: true,
      v2_meta: true,
      v2_normalizeFormMethod: true,
      v2_errorBoundary: true,
      unstable_dev: true,
   },
   serverModuleFormat: "cjs",
   tailwind: true,
   // postcss: true, // commented out to speed up hmr, uncomment if you need to use postcss.
   publicPath: getPublicPath(),
   ignoredRouteFiles: ["**/.*"],
   routes: async (defineRoutes) => {
      return flatRoutes(["routes", "_custom/routes"], defineRoutes);
   },
   serverDependenciesToBundle: ["nanoid", "array-move"],
};
