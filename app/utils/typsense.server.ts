import Typesense from "typesense";

export const typesensePrivateClient = new Typesense.Client({
   apiKey: process.env.TYPESENSE_PRIVATE_KEY ?? "", // Be sure to use an API key that only allows search operations
   nodes: [
      {
         host: "tif2s7d9m8bqwypzp-1.a1.typesense.net",
         port: 443,
         protocol: "https",
      },
   ],
   connectionTimeoutSeconds: 2,
});
