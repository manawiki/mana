export const apiPath =
   process.env.NODE_ENV == "development"
      ? "localhost:3000"
      : process.env.API_ENDPOINT ?? "mana.wiki";

export const apiDBPath = process.env.API_ENDPOINT ?? "mana.wiki";
