export const loginPath =
   process.env.NODE_ENV == "development"
      ? "http://localhost:3000/login"
      : `https://${process.env.AUTH_HOST_DOMAIN ?? "mana.wiki"}/login`;

export const joinPath =
   process.env.NODE_ENV == "development"
      ? "http://localhost:3000/join"
      : `https://${process.env.AUTH_HOST_DOMAIN ?? "mana.wiki"}/join`;
