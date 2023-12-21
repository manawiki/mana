import type { MetaFunction } from "@remix-run/react";

export const listMeta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site;

   const collectionId = matches[2].pathname.split("/")[2];

   const collection = site?.collections?.find(
      (collection: any) => collection.slug === collectionId,
   );

   return [
      {
         title: `${collection?.name} | ${site?.name}`,
      },
   ];
};
