import Typesense from "typesense";

import { settings } from "../config";

export const typesensePrivateClient = new Typesense.Client({
   apiKey: process.env.TYPESENSE_PRIVATE_KEY ?? "", // Be sure to use an API key that only allows search operations
   nodes: [
      {
         host: settings?.typesenseHost ?? "search.mana.wiki",
         port: 443,
         protocol: "https",
      },
   ],
   connectionTimeoutSeconds: 2,
});
