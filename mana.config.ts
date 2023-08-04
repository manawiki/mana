import qs from "qs";

import { config } from "./app/_custom/config";
import { fetchWithCache } from "./app/utils/cache.server";

type ManaConfig = {
   title: string;
   domain: string;
   domainFull: string;
   fromEmail: string;
   fromName: string;
   siteId?: string;
};

type CorsConfig = {
   corsOrigins: string[];
   cors: string[];
};

export const corsConfig = async (): Promise<CorsConfig> => {
   const customSitesQuery = qs.stringify(
      {
         where: {
            type: {
               equals: "custom",
            },
         },
         select: {
            slug: true,
            type: true,
            domain: true,
         },
      },
      { addQueryPrefix: true }
   );
   const customSitesUrl = `https://mana.wiki/api/sites${customSitesQuery}`;

   const { docs } = await fetchWithCache(customSitesUrl);

   const siteCorsOrigins = docs.flatMap((site: any) => {
      if (site.type == "custom" && site.domain)
         return [
            `https://${site.slug}-static.mana.wiki`,
            `https://${site.domain}`,
         ];
      if (site.type == "core" && site.domain) return `https://${site.domain}`;
      if (site.type == "custom") return `https://${site.slug}-static.mana.wiki`;
      return null;
   });

   const siteCors = docs.flatMap((site: any) => {
      if (site.type == "custom" && site.domain)
         return [`${site.slug}-static.mana.wiki`, site.domain];
      if (site.type == "core" && site.domain) return site.domain;
      if (site.type == "custom") return `${site.slug}-static.mana.wiki`;
      return null;
   });

   return {
      corsOrigins: [
         process.env.NODE_ENV == "production"
            ? "https://mana.wiki"
            : "http://localhost:3000",
         ...siteCorsOrigins,
      ],
      cors: ["mana.wiki", "static.mana.wiki", ...siteCors],
   };
};

export const settings: ManaConfig = {
   title: "Mana - A new kind of wiki",
   fromEmail: "dev@mana.wiki",
   fromName: "No Reply - Mana Wiki",
   siteId: config.siteId,
   domain: config.domain ?? "mana.wiki",
   domainFull:
      process.env.NODE_ENV == "production"
         ? `https://${config.domain ? config.domain : "mana.wiki"}`
         : "http://localhost:3000",
};
