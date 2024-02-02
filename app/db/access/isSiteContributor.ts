import type { Site } from "payload/generated-types";

export const isSiteContributor = (userId: string, site: Site) => {
   const siteContributors = site.contributors;

   if (siteContributors) {
      //@ts-ignore
      return siteContributors.includes(userId);
   }

   return false;
};
