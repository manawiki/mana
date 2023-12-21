import type { MetaFunction } from "@remix-run/react";

export const entryMeta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site?.name;
   return [
      {
         title: `${data?.entry.name} | ${data?.entry?.collectionName} - ${siteName}`,
      },
   ];
};
