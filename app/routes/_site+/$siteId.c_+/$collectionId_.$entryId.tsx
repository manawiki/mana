import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { CollectionHeader, EntryContentEmbed } from "./src/components";
import { getAllEntryData } from "./src/functions";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });
   return json({ entry });
}

export const meta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site?.name;

   return [
      {
         title: `${data?.entry.name} | ${data?.entry.collectionName} - ${siteName}`,
      },
   ];
};

export default function CollectionEntryWiki() {
   const { entry } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 max-desktop:pt-14">
         <CollectionHeader />
         {entry.sections?.map((row) => (
            <div key={row?.id}>
               <EntryContentEmbed sectionId={row.id} title={row?.name} />
            </div>
         ))}
      </div>
   );
}
