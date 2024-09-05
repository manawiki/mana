import type { MetaFunction } from "@remix-run/node";

import type { loader as siteLayoutLoader } from "~/routes/_site+/_layout";

export const meta: MetaFunction<
   null,
   {
      "routes/_site+/_layout": typeof siteLayoutLoader;
   }
> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;
   return [
      {
         title: `Community - ${siteName}`,
      },
   ];
};

export default function PostList() {
   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-3 laptop:pt-6">
         <div className="relative flex items-center pb-5">
            <h1 className="font-header text-3xl font-bold pr-3">Community</h1>
            <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
         </div>
         <div className="text-1">Coming soon!</div>
      </main>
   );
}
