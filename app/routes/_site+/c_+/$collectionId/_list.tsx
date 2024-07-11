import { defer } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLocation, useParams } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Avatar } from "~/components/Avatar";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";

import { fetchListCore } from "./utils/fetchListCore.server";
import { listMeta } from "./utils/listMeta";
import { List } from "../_components/List";

export { listMeta as meta };

type ListRowDefault = {
   name: string;
   slug: string;
   icon: {
      url: string;
   };
};

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const list = fetchListCore({
      request,
      payload,
      siteSlug,
      user,
   });

   return defer({ list });
}

export default function CollectionList() {
   const columnHelper = createColumnHelper<ListRowDefault>();
   const { pathname } = useLocation();

   const collectionId = useParams()?.collectionId ?? pathname.split("/")[2];

   const columns = [
      columnHelper.accessor("name", {
         header: "Name",
         cell: (info) => (
            <Link
               to={`/c/${collectionId}/${info.row.original.slug}`}
               className="flex items-center gap-2 group py-0.5"
            >
               <Avatar
                  className="size-7 flex-none"
                  initials={
                     info.row.original.icon?.url
                        ? undefined
                        : info.row.original.name.charAt(0)
                  }
                  src={info.row.original.icon?.url}
                  options="aspect_ratio=1:1&height=120&width=120"
               />
               <span className="font-semibold group-hover:underline decoration-zinc-400 underline-offset-2">
                  {info.getValue()}
               </span>
            </Link>
         ),
      }),
   ];
   return <List key={collectionId} columns={columns} />;
}
