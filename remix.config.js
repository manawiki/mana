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
      v2_headers: true,
      v2_dev: true,
   },
   serverModuleFormat: "cjs",
   tailwind: true,
   postcss: true, // commented out to speed up hmr, uncomment if you need to use postcss.
   publicPath: getPublicPath(),
   // ignore all files in routes folder to prevent
   // default remix convention from picking up routes
   ignoredRouteFiles: ["**/.*"],
   routes: async (defineRoutes) => {
      return flatRoutes(["routes", "_custom/routes"], defineRoutes);
   },
   serverDependenciesToBundle: ["nanoid", "array-move", "capacitor-plugin-ios-webview-configurator"],
};
