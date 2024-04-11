import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Entry } from "./components/Entry";
import { fetchEntry } from "./utils/fetchEntry.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
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
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site?.name;

   return [
      {
         title: `${data?.entry.name} | ${data?.entry.collectionName} - ${siteName}`,
      },
   ];
};

export default function CollectionEntry() {
   return <Entry />;
}
