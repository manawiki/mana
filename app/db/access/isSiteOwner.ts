export const isSiteOwner = (
   userId: string | undefined,
   siteOwner: string | undefined,
) => {
   return userId === siteOwner;
};
