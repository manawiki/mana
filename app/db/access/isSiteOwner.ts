import type { Site } from "payload/generated-types";

export const isSiteOwner = (
   userId: string,
   siteOwner: Site["owner"] | undefined,
) => {
   const isSiteOwner = userId == (siteOwner as any);
   if (isSiteOwner) return true;
   return false;
};
