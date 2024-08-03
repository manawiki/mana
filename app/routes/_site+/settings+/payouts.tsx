import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   return null;
}

export default function AdPayouts() {
   return <div>{/* <div>Ad Payouts</div> */}</div>;
}

export const meta: MetaFunction = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
      //@ts-ignore
   )?.data?.site.name;

   return [
      {
         title: `Payouts | Settings - ${siteName}`,
      },
   ];
};
