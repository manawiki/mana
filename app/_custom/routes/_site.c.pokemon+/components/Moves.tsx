import { Link } from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { H2Plain } from "~/components/Headers";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Pokemon as PokemonType } from "~/db/payload-custom-types";

import { ChargeBar } from "./ChargeBar";

export function Moves({ data: pokemon }: { data: PokemonType }) {
   return (
      <>
         <H2Plain text="Fast" className="!text-xl" />
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-lg overflow-hidden mb-3">
            {pokemon.fastMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/c/moves/${row?.move?.slug}`}
                     className="flex items-center w-full gap-2.5 hover:underline flex-grow p-3"
                  >
                     <Image
                        height={24}
                        width={24}
                        url={row.move?.icon?.url}
                        options="height=40&width=40"
                        alt={row?.move?.name}
                     />
                     <div className="text-sm font-semibold flex-grow">
                        {row?.move?.name}
                     </div>
                  </Link>
                  <div className="flex items-center gap-3 p-3 flex-none">
                     {row?.category && (
                        <Badge className="capitalize !text-xs">
                           {row?.category}
                        </Badge>
                     )}
                     <Tooltip placement="top">
                        <TooltipTrigger
                           className="rounded-lg h-7 px-0.5 border shadow-sm shadow-1 border-color-sub 
                                  flex items-center justify-center bg-white dark:bg-zinc-800"
                        >
                           <Image
                              height={28}
                              width={28}
                              url={row.move?.type?.boostedWeather?.icon?.url}
                              options="height=40&width=40"
                              alt={row.move?.type?.boostedWeather?.name}
                           />
                        </TooltipTrigger>
                        <TooltipContent>
                           {row.move?.type?.boostedWeather?.name}
                        </TooltipContent>
                     </Tooltip>
                     <div
                        className="font-semibold text-sm w-10 text-center h-7 flex items-center justify-center 
                          rounded-lg shadow-sm dark:shadow-zinc-800/80 border border-color-sub bg-white dark:bg-dark400"
                     >
                        {row.move?.pve?.power}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <H2Plain text="Charge" className="!text-xl" />
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-lg overflow-hidden">
            {pokemon.chargeMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/c/moves/${row?.move?.slug}`}
                     className="flex items-center w-full gap-2.5 hover:underline flex-grow p-3"
                  >
                     <Image
                        height={24}
                        width={24}
                        url={row?.move?.icon?.url}
                        options="height=40&width=40"
                        alt={row?.move?.name}
                     />
                     <div className="text-sm font-bold flex-grow space-y-1">
                        <div>{row?.move?.name}</div>
                        <ChargeBar value={row?.move?.pve?.energyDeltaCharge} />
                     </div>
                  </Link>
                  <div className="flex items-center gap-3 p-3 flex-none">
                     {row?.category && (
                        <Badge className="capitalize !text-xs">
                           {row?.category}
                        </Badge>
                     )}
                     <Tooltip placement="top">
                        <TooltipTrigger
                           className="rounded-lg h-7 px-0.5 border shadow-sm shadow-1 border-color-sub 
                        flex items-center justify-center bg-white dark:bg-zinc-800"
                        >
                           <Image
                              height={28}
                              width={28}
                              url={row.move?.type?.boostedWeather?.icon?.url}
                              options="height=40&width=40"
                              alt={row.move?.type?.boostedWeather?.name}
                           />
                        </TooltipTrigger>
                        <TooltipContent>
                           {row.move?.type?.boostedWeather?.name}
                        </TooltipContent>
                     </Tooltip>
                     <div
                        className="font-semibold text-sm w-12 text-center h-7 flex items-center justify-center 
                        rounded-lg shadow-sm dark:shadow-zinc-800/80 border border-color-sub bg-white dark:bg-dark400"
                     >
                        {row.move?.pve?.power}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </>
   );
}
