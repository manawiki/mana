import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { ChevronRight } from "lucide-react";
import { formatDistanceStrict } from "date-fns";

export async function loader({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });
   const entry = await payload.findByID({
      collection: "entries",
      id: entryId,
   });
   return json({ entry });
}

export const meta: V2_MetaFunction = ({ parentsData }) => {
   const name = parentsData["routes/$siteId"].site.name;
   return [
      {
         title: `Entry Page - ${name}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   breadcrumb: ({ pathname, data }: { pathname: string; data: any }) => (
      <NavLink
         end
         className={({ isActive }) =>
            `${
               isActive
                  ? "font-semibold text-zinc-500 underline  dark:text-zinc-300"
                  : ""
            } flex items-center gap-3 decoration-yellow-300 underline-offset-2 hover:underline dark:decoration-yellow-400`
         }
         to={pathname}
      >
         <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-500" />
         <span>{data.entry.name}</span>
      </NavLink>
   ),
};

export default function CollectionEntry() {
   const { entry } = useLoaderData<typeof loader>();

   return (
      <div
         className="post-content max-laptop:pt-24 max-laptop:pb-20 relative mx-auto 
      min-h-screen max-w-[728px] laptop:py-12 desktop:px-0"
      >
         <h1 className="pb-3 font-mono text-2xl font-semibold laptop:text-3xl">
            {entry?.name}
         </h1>
         <time
            className="block pb-5 text-sm dark:text-zinc-400"
            dateTime={entry?.updatedAt}
         >
            {formatDistanceStrict(
               new Date(entry?.updatedAt as string),
               new Date(),
               {
                  addSuffix: true,
               }
            )}
         </time>
         {entry.icon ? (
            <img
               alt={entry.name}
               //@ts-ignore
               src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=50,width=50,gravity=auto/${entry?.icon?.url}`}
            />
         ) : null}

         <Outlet />
      </div>
   );
}
