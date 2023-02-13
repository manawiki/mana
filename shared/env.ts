export type envType = "local" | "dev-server" | "production";

export const serverEnv = process.env
   .PAYLOAD_PUBLIC_SERVER_ENVIRONMENT as envType;

export const domainCookie =
   serverEnv == "local"
      ? "localhost"
      : serverEnv == "dev-server"
      ? ".manatee.wiki"
      : ".mana.wiki";
