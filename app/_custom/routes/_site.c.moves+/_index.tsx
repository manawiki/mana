import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Move } from "~/db/payload-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";

import { ChargeBar } from "../_site.c.pokemon+/components/ChargeBar";

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const list = await fetchList({
      params,
      request,
      payload,
      user,
      gql: {
         query: MOVES,
      },
   });
   return json({ list });
}

export default function ListPage() {
   return (
      <List
         viewType="list"
         gridView={gridView}
         columns={columns}
         columnViewability={{ type: false }}
         filters={filters}
      />
   );
}

const columnHelper = createColumnHelper<Move>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         prefetch="intent"
         to={`/c/pokemon/${info.row.original.slug}`}
      >
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
            to={`/c/moves/${info.row.original.slug ?? info.row.original.id}`}
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
            <span className="font-semibold space-y-1 group-hover:underline decoration-zinc-400 underline-offset-2">
               <span>{info.getValue()}</span>
               <ChargeBar value={info.row.original.pve?.energyDeltaCharge} />
            </span>
         </Link>
      ),
   }),
   columnHelper.accessor("type", {
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.type?.slug);
      },
   }),
   columnHelper.accessor("category", {
      header: "Type",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.category);
      },
   }),
   columnHelper.accessor("pve.damagePerSecond", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger className="flex items-center gap-1">
                  <Icon size={12} name="info" className="text-1" />
                  DPS
               </TooltipTrigger>
               <TooltipContent>Damage Per Second</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor("pve.energyPerSecond", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger className="flex items-center gap-1">
                  <Icon size={12} name="info" className="text-1" />
                  EPS
               </TooltipTrigger>
               <TooltipContent>Energy Per Second</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) => info.getValue() ?? "-",
   }),
   columnHelper.accessor("pve.damagePerEnergy", {
      header: () => (
         <>
            <Tooltip placement="top">
               <TooltipTrigger className="flex items-center gap-1">
                  <Icon size={12} name="info" className="text-1" />
                  DPE
               </TooltipTrigger>
               <TooltipContent>Damage Per Energy (PvE)</TooltipContent>
            </Tooltip>
         </>
      ),
      cell: (info) => info.getValue() ?? "-",
   }),
];

const MOVES = gql`
   query {
      listData: Moves(limit: 5000) {
         totalDocs
         docs {
            id
            category
            name
            slug
            icon {
               url
            }
            type {
               slug
               name
               icon {
                  url
               }
            }
            pve {
               power
               duration
               damagePerSecond
               damagePerEnergy
               energyPerSecond
               energyDeltaCharge
            }
         }
      }
   }
`;

const filters = [
   {
      id: "category",
      label: "Category",
      cols: 2,
      options: [
         {
            label: "Fast",
            value: "fast",
         },
         {
            label: "Charge",
            value: "charge",
         },
      ],
   },
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
