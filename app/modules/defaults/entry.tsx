import type { Params } from "@remix-run/react";
import { NavLink } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { ChevronRight } from "lucide-react";
import { z } from "zod";
import { zx } from "zodix";
import type { Payload } from "payload";

export const getDefaultEntryData = async ({
   payload,
   params,
}: {
   payload: Payload;
   params: Params;
}) => {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });
   const entry = await payload.findByID({
      collection: "entries",
      id: entryId,
   });
   return entry;
};

export const meta: V2_MetaFunction = ({ parentsData, data }) => {
   const siteName = parentsData["routes/$siteId"].site.name;
   return [
      {
         title: `${data.entryDefault.name} - ${siteName}`,
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
               isActive &&
               "font-semibold text-zinc-500 underline  dark:text-zinc-300"
            } flex items-center gap-3 decoration-yellow-300 underline-offset-2 hover:underline dark:decoration-yellow-400`
         }
         to={pathname}
      >
         <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-500" />
         <span>{data.entryDefault.name}</span>
      </NavLink>
   ),
};
