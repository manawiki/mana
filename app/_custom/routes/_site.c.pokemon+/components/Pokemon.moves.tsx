import { Link } from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { H2Plain } from "~/components/Headers";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type {
   PokemonFamily,
   Pokemon as PokemonType,
} from "~/db/payload-custom-types";

import { ChargeBar } from "./ChargeBar";

export function Moves({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamily };
}) {
   const pokemon = data.pokemon;

   return (
      <>
         <H2Plain text="Fast" className="!text-xl" />
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-xl overflow-hidden mb-3">
            {pokemon.fastMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/c/moves/${row?.move?.slug}`}
                     className="flex items-center w-full gap-4 group flex-grow p-3 pr-0"
                  >
                     <div className="flex-grow space-y-2.5">
                        <div className="flex items-center gap-2">
                           <Tooltip placement="right">
                              <TooltipTrigger>
                                 <Image
                                    height={21}
                                    width={21}
                                    url={row?.move?.icon?.url}
                                    options="height=40&width=40"
                                    alt={row?.move?.name}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>
                                 {row?.move?.type?.name} Type
                              </TooltipContent>
                           </Tooltip>
                           <div className="group-hover:underline font-bold">
                              {row?.move?.name}
                              {row?.category && (
                                 <Badge className="capitalize !text-xs ml-2">
                                    {row?.category}
                                 </Badge>
                              )}
                           </div>
                        </div>
                        <div className="flex items-center gap-3 border-t dark:border-zinc-700 pt-2 mt-1.5">
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-16">
                                 <div className="text-1">CD</div>
                                 {row?.move?.pve?.duration}
                              </TooltipTrigger>
                              <TooltipContent>Move Cooldown</TooltipContent>
                           </Tooltip>
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-20">
                                 <div className="text-1">DPS</div>
                                 {row?.move?.pve?.damagePerSecond}
                              </TooltipTrigger>
                              <TooltipContent>Damage Per Second</TooltipContent>
                           </Tooltip>
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono">
                                 <div className="text-1">EPS</div>
                                 {row?.move?.pve?.energyPerSecond}
                              </TooltipTrigger>
                              <TooltipContent>Energy Per Second</TooltipContent>
                           </Tooltip>
                        </div>
                     </div>
                  </Link>
                  <div className="flex flex-col gap-2 p-2.5">
                     <Tooltip placement="left">
                        <TooltipTrigger
                           className="font-bold text-sm w-10 text-center h-7 flex items-center justify-center 
                          rounded-lg border dark:border-zinc-500 bg-white dark:bg-dark500"
                        >
                           {row.move?.pve?.power}
                        </TooltipTrigger>
                        <TooltipContent>Move Power</TooltipContent>
                     </Tooltip>
                     <Tooltip placement="left">
                        <TooltipTrigger
                           className="rounded-lg h-7 w-10 border dark:border-zinc-700
                                  flex items-center justify-center bg-white dark:bg-zinc-700/10"
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
                           Boosted in{" "}
                           <span className="!font-bold !italic">
                              {row.move?.type?.boostedWeather?.name}
                           </span>{" "}
                           weather
                        </TooltipContent>
                     </Tooltip>
                  </div>
               </div>
            ))}
         </div>
         <H2Plain text="Charge" className="!text-xl" />
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-xl overflow-hidden mb-3">
            {pokemon.chargeMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/c/moves/${row?.move?.slug}`}
                     className="flex items-center w-full gap-2.5 group flex-grow p-3 pr-0"
                  >
                     <div className="flex-grow space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="font-bold flex-grow space-y-2">
                              <div className="flex items-center gap-4 justify-between">
                                 <div className="flex items-center gap-2">
                                    <Tooltip placement="right">
                                       <TooltipTrigger>
                                          <Image
                                             height={21}
                                             width={21}
                                             url={row?.move?.icon?.url}
                                             options="height=40&width=40"
                                             alt={row?.move?.name}
                                          />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          {row?.move?.type?.name} Type
                                       </TooltipContent>
                                    </Tooltip>
                                    <div className="group-hover:underline">
                                       {row?.move?.name}
                                    </div>
                                    {row?.category && (
                                       <Badge className="capitalize !text-xs">
                                          {row?.category}
                                       </Badge>
                                    )}
                                 </div>
                                 <ChargeBar
                                    value={row?.move?.pve?.energyDeltaCharge}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 border-t dark:border-zinc-700 pt-2 mt-1.5">
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-12">
                                 <div className="text-1">CD</div>
                                 {row?.move?.pve?.duration}
                              </TooltipTrigger>
                              <TooltipContent>Move Cooldown</TooltipContent>
                           </Tooltip>
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-20">
                                 <div className="text-1">DPS</div>
                                 {row?.move?.pve?.damagePerSecond}
                              </TooltipTrigger>
                              <TooltipContent>Damage Per Second</TooltipContent>
                           </Tooltip>
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-16">
                                 <div className="text-1">DPE</div>
                                 {row?.move?.pve?.damagePerEnergy}
                              </TooltipTrigger>
                              <TooltipContent>Damage Per Energy</TooltipContent>
                           </Tooltip>
                           <Tooltip placement="top">
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-mono w-16">
                                 <div className="text-1">DW</div>
                                 {row?.move?.pve?.dodgeWindow}
                              </TooltipTrigger>
                              <TooltipContent>Dodge Window</TooltipContent>
                           </Tooltip>
                        </div>
                     </div>
                  </Link>
                  <div className="flex items-center gap-3 p-3 flex-none">
                     <div className="flex justify-end flex-col gap-2">
                        <Tooltip placement="left">
                           <TooltipTrigger
                              className="font-bold text-sm w-10 text-center h-7 flex items-center justify-center 
                              rounded-lg border dark:border-zinc-500 bg-white dark:bg-dark500"
                           >
                              {row.move?.pve?.power}
                           </TooltipTrigger>
                           <TooltipContent>Move Power</TooltipContent>
                        </Tooltip>
                        <Tooltip placement="left">
                           <TooltipTrigger
                              className="rounded-lg h-7 w-10 border dark:border-zinc-700 self-end
                                  flex items-center justify-center bg-white dark:bg-zinc-700/10"
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
                              Boosted in{" "}
                              <span className="!font-bold !italic">
                                 {row.move?.type?.boostedWeather?.name}
                              </span>{" "}
                              weather
                           </TooltipContent>
                        </Tooltip>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </>
   );
}
