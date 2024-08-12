export type ManaConfig = {
   title?: string; //Title of the site, used in meta tags
   fromEmail?: string; //Email address to send emails from
   fromName?: string; //Name to send emails from
   typesenseHost?: string; //Host of the typesense server
   typesenseSearchOnlyKey?: string; //API key that only allows search operations
};

export const settings: ManaConfig = {};
