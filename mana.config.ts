type ManaConfig = {
   title: string;
   domain: string;
   domainFull: string;
   fromEmail: string;
   fromName: string;
   siteId?: string;
   corsOrigins: string[];
   cors: string[];
};
export const settings: ManaConfig = {
   title: "Mana - A new kind of wiki",
   domain: "mana.wiki",
   domainFull:
      process.env.NODE_ENV == "production"
         ? "https://mana.wiki"
         : "http://localhost:3000",
   fromEmail: "dev@mana.wiki",
   fromName: "No Reply - Mana Wiki",
   corsOrigins: [
      "https://mana.wiki",
      "https://starrail-static.mana.wiki",
      "https://neuralcloud-static.mana.wiki",
      "https://static.mana.wiki",
      "http://localhost:3000",
   ],
   cors: ["mana.wiki", "static.mana.wiki", "starrail-static.mana.wiki", "neuralcloud-static.mana.wiki"],
   siteId: "neuralcloud",
};
