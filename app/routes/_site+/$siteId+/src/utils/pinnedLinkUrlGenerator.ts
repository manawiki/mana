export const pinnedLinkUrlGenerator = (item: any, siteSlug: string) => {
   const type = item.relation?.relationTo;

   switch (type) {
      case "customPages": {
         const slug = item.relation?.value.customPageSlug;
         return `/${siteSlug}/${slug}`;
      }
      case "collections": {
         const slug = item.relation?.value.collectionSlug;
         return `/${siteSlug}/c/${slug}`;
      }
      case "entries": {
         const slug = item.relation?.value.slug;
         const id = item.relation?.value.id;
         const collection = item.relation?.value.collectionEntity.slug;
         return `/${siteSlug}/c/${collection}/${id}/${slug}`;
      }
      case "posts": {
         const id = item.relation?.value.id;
         return `/${siteSlug}/p/${id}`;
      }
      default:
         return "/";
   }
};
