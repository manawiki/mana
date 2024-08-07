import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Avatar } from "~/components/Avatar";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Move, Pokemon } from "~/db/payload-custom-types";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";
const columnHelper = createColumnHelper<Pokemon>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         prefetch="intent"
         to={`/c/pokemon/${info.row.original.slug}`}
      >
         <div className="flex items-center gap-0.5 absolute top-0 left-0">
            {info.row.original.type?.map((type) => (
               <Tooltip key={type.name} placement="top">
                  <TooltipTrigger>
                     <Image
                        height={14}
                        width={14}
                        url={type?.icon?.url}
                        options="height=40&width=40"
                        alt={type?.name ?? ""}
                     />
                  </TooltipTrigger>
                  <TooltipContent>{type?.name}</TooltipContent>
               </Tooltip>
            ))}
         </div>
         <Image
            width={36}
            height={36}
            url={info.row.original.icon?.url}
            className="mx-auto"
            options="aspect_ratio=1:1&height=80&width=80"
         />
         <div
            className="truncate text-xs font-semibold text-center pt-1
               group-hover:underline decoration-zinc-400 underline-offset-2"
         >
            {info.getValue()}
         </div>
      </Link>
   ),
});

const columns = [
   columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
         <Link
            to={`/c/pokemon/${info.row.original.slug}`}
            className="flex items-center gap-2 group py-0.5"
         >
            <Avatar
               className="size-7 flex-none"
               initials={
                  info.row.original.icon?.url
                     ? undefined
                     : // @ts-ignore
                       info.row?.original?.name.charAt(0)
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
   columnHelper.accessor("level50CP", {
      header: "Lvl 50 CP",
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor("baseAttack", {
      header: "ATK",
      cell: (info) => info.getValue(),
   }),
];

export function PokemonWithMove({ data: move }: { data: Move }) {
   const { site } = useSiteLoaderData();

   const collection = site?.collections?.find(
      (collection) => collection.slug === "pokemon",
   );

   return (
      <>
         <ListTable
            gridView={gridView}
            defaultSort={[{ id: "baseAttack", desc: true }]}
            data={{ listData: { docs: move.pokemonWithMove } }}
            //@ts-ignore
            columns={columns}
            //@ts-ignore
            collection={collection}
         />
      </>
   );
}
