import qs from "qs";

import { config } from "./app/_custom/config";

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
   return {
      corsOrigins: [
         "https://starrail-static.mana.wiki",
         "https://mana.wiki",
         "https://static.mana.wiki",
         "http://localhost:3000",
      ],
      cors: ["mana.wiki", "static.mana.wiki", "starrail-static.mana.wiki"],
   };
   // const customSitesQuery = qs.stringify(
   //    {
   //       where: {
   //          type: {
   //             equals: "custom",
   //          },
   //       },
   //       select: {
   //          slug: true,
   //          type: true,
   //          domain: true,
   //       },
   //    },
   //    { addQueryPrefix: true }
   // );

   // const customSitesUrl = `https://mana-core-fwq2wjp57a-uc.a.run.app/api/sites${customSitesQuery}`;

   // try {
   //    const { docs } = await (await fetch(customSitesUrl)).json();

   //    const siteCorsOrigins = docs.flatMap((site: any) => {
   //       if (site.type == "custom" && site.domain)
   //          return [
   //             `https://${site.slug}-static.mana.wiki`,
   //             `https://${site.domain}`,
   //          ];
   //       if (site.type == "core" && site.domain)
   //          return `https://${site.domain}`;
   //       if (site.type == "custom")
   //          return `https://${site.slug}-static.mana.wiki`;
   //       return null;
   //    });

   //    const siteCors = docs.flatMap((site: any) => {
   //       if (site.type == "custom" && site.domain)
   //          return [`${site.slug}-static.mana.wiki`, site.domain];
   //       if (site.type == "core" && site.domain) return site.domain;
   //       if (site.type == "custom") return `${site.slug}-static.mana.wiki`;
   //       return null;
   //    });

   //    return {
   //       corsOrigins: [
   //          "https://mana.wiki",
   //          "https://static.mana.wiki",
   //          "http://localhost:3000",
   //          ...siteCorsOrigins,
   //       ],
   //       cors: ["mana.wiki", "static.mana.wiki", ...siteCors],
   //    };
   // } catch (err) {
   //    return {
   //       corsOrigins: [
   //          "https://mana.wiki",
   //          "https://static.mana.wiki",
   //          "http://localhost:3000",
   //       ],
   //       cors: ["mana.wiki", "static.mana.wiki"],
   //    };
   // }
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
