import config from "./app/_custom/config.json";

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
};

export const settings: ManaConfig = {
   title: "Mana - A new kind of wiki",
   fromEmail: "dev@mana.wiki",
   fromName: "No Reply - Mana Wiki",
   siteId: config?.siteId,
   domain: config?.domain ? config?.domain : "mana.wiki",
   domainFull:
      process.env.NODE_ENV == "production"
         ? `https://${config?.domain ? config?.domain : "mana.wiki"}`
         : "http://localhost:3000",
};
