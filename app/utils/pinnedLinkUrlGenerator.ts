export const pinnedLinkUrlGenerator = (item: any) => {
   const type = item.relation?.relationTo;

   switch (type) {
      case "customPages": {
         const slug = item.relation?.value.customPageSlug;
         return `/${slug}`;
      }
      case "collections": {
         const slug = item.relation?.value.collectionSlug;
         return `/c/${slug}`;
      }
      case "entries": {
         const slug = item.relation?.value.slug;
         const id = item.relation?.value.id;
         const collection = item.relation?.value.collectionEntity.slug;
         return `/c/${collection}/${id}/${slug}`;
      }
      case "posts": {
         const id = item.relation?.value.id;
         return `/p/${id}`;
      }
      default:
         return "/";
   }
};
