import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Avatar } from "~/components/Avatar";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Pokemon } from "~/db/payload-custom-types";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";

const columnHelper = createColumnHelper<Pokemon>();

export const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="relative flex flex-col items-center gap-1 p-2 group"
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
            loading="lazy"
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

export const columns = [
   columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
         <Link
            to={`/c/pokemon/${info.row.original.slug ?? info.row.original.id}`}
            className="flex items-center gap-2 group py-0.5"
         >
            <Avatar
               className="size-7 flex-none"
               initials={
                  info.row.original.icon?.url
                     ? undefined
                     : //@ts-ignore
                       info.row.original.name.charAt(0)
               }
               src={info.row.original.icon?.url}
               options="aspect_ratio=1:1&height=120&width=120"
            />
            <span className="font-bold group-hover:underline decoration-zinc-400 underline-offset-2">
               <span>{info.getValue()}</span>
            </span>
         </Link>
      ),
   }),
   columnHelper.accessor("type", {
      filterFn: (row, columnId, filterValue) => {
         const existingFilter =
            filterValue && filterValue.length > 0
               ? row?.original?.type?.some((type: any) =>
                    filterValue.includes(type.slug),
                 )
               : true;

         return existingFilter ?? true;
      },
   }),
];

export const filters = [
   {
      id: "type",
      label: "Type",
      cols: 3,
      options: [
         {
            label: "Bug",
            value: "bug",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Bug.svg",
         },
         {
            label: "Dark",
            value: "dark",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dark.svg",
         },
         {
            label: "Dragon",
            value: "dragon",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dragon.svg",
         },
         {
            label: "Electric",
            value: "electric",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Electric.svg",
         },
         {
            label: "Fairy",
            value: "fairy",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fairy.svg",
         },
         {
            label: "Fighting",
            value: "fighting",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fighting.svg",
         },
         {
            label: "Fire",
            value: "fire",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fire.svg",
         },
         {
            label: "Flying",
            value: "flying",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Flying.svg",
         },
         {
            label: "Ghost",
            value: "ghost",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ghost.svg",
         },
         {
            label: "Grass",
            value: "grass",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Grass.svg",
         },
         {
            label: "Ground",
            value: "ground",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ground.svg",
         },
         {
            label: "Ice",
            value: "ice",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ice.svg",
         },
         {
            label: "Normal",
            value: "normal",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Normal.svg",
         },
         {
            label: "Poison",
            value: "poison",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Poison.svg",
         },
         {
            label: "Psychic",
            value: "psychic",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Psychic.svg",
         },
         {
            label: "Rock",
            value: "rock",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Rock.svg",
         },
         {
            label: "Steel",
            value: "steel",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Steel.svg",
         },
         {
            label: "Water",
            value: "water",
            icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Water.svg",
         },
      ],
   },
];
