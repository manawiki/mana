import { useState } from "react";

import { Listbox, Transition } from "@headlessui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Pokemon as PokemonType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "../classes";
import { Pokemon } from "../collections/pokemon";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });

   return json({
      entry,
   });
}

const SECTIONS = {
   main: Main,
   ratings: Ratings,
   moves: Moves,
   other: OtherInfo,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   const pokemon = entry.data.pokemon as PokemonType;

   return <Entry customComponents={SECTIONS} customData={pokemon} />;
}

function Main({ data: pokemon }: { data: PokemonType }) {
   const images = [
      {
         id: pokemon?.images?.goImage?.id,
         name: "GO",
         imageUrl: pokemon?.images?.goImage?.url,
      },
      {
         id: pokemon?.images?.goShinyImage?.id,
         name: "GO Shiny",
         imageUrl: pokemon?.images?.goShinyImage?.url,
      },
      {
         id: pokemon?.icon?.id,
         name: "Sugimori",
         imageUrl: pokemon?.icon?.url,
      },
      {
         id: pokemon?.images?.florkImage?.id,
         name: "Flork",
         imageUrl: pokemon?.images?.florkImage?.url,
      },
      {
         id: pokemon?.images?.shuffleImage?.id,
         name: "Shuffle",
         imageUrl: pokemon?.images?.shuffleImage?.url,
      },
   ];

   const [selectedImage, setSelectedImage] = useState(images[0]);

   return (
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
         <section>
            <div className="bg-2-sub shadow-sm shadow-1 border rounded-lg border-color-sub mb-3">
               <div className="border-b bg-3-sub border-color-sub p-2 gap-2 justify-between rounded-t-lg flex items-center">
                  {pokemon.number && (
                     <div className="dark:bg-dark500 font-bold bg-zinc-100 rounded-md px-2 py-1.5 text-xs space-x-0.5">
                        <span className="text-1">#</span>
                        <span>{pokemon.number}</span>
                     </div>
                  )}
                  <div className="flex items-center gap-2">
                     {pokemon?.type?.map((type) => (
                        <Tooltip key={type.id} placement="top">
                           <TooltipTrigger key={type.id}>
                              <Image
                                 height={28}
                                 width={28}
                                 url={type?.icon?.url}
                                 options="height=80&width=80"
                                 alt={type?.name}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{type?.name}</TooltipContent>
                        </Tooltip>
                     ))}
                  </div>
               </div>
               <div className="flex items-center h-60 justify-center">
                  <Image
                     height={240}
                     width={240}
                     className="object-contain"
                     url={selectedImage?.imageUrl}
                     options="height=240"
                     alt={selectedImage?.name}
                  />
               </div>
               <Listbox
                  by="id"
                  value={selectedImage}
                  onChange={setSelectedImage}
               >
                  <Listbox.Button
                     className="flex px-3 py-3.5 hover:underline bg-3-sub rounded-b-lg
                     border-t border-color-sub justify-between w-full items-center gap-2 text-sm"
                  >
                     <div className="flex items-center gap-2.5">
                        <Icon
                           name="image"
                           className="text-zinc-400 dark:text-zinc-500"
                           size={17}
                        />
                        <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                        <span className="font-semibold">
                           {selectedImage?.name}
                        </span>
                     </div>
                     <Icon
                        name="chevrons-up-down"
                        size={18}
                        className="text-zinc-500 text-sm font-semibold"
                     />
                  </Listbox.Button>
                  <Transition
                     enter="transition duration-100 ease-out"
                     enterFrom="transform scale-95 opacity-0"
                     enterTo="transform scale-100 opacity-100"
                     leave="transition duration-75 ease-out"
                     leaveFrom="transform scale-100 opacity-100"
                     leaveTo="transform scale-95 opacity-0"
                  >
                     <Listbox.Options
                        className="border-color-sub bg-2-sub shadow-1 absolute left-0
                        mt-2 w-full rounded-lg border shadow-lg grid grid-cols-3 gap-2 p-2"
                     >
                        {images.map((image) => (
                           <Listbox.Option key={image.id} value={image}>
                              {({ active, selected }) => (
                                 <div
                                    className={clsx(
                                       "rounded-lg cursor-pointer border",
                                       active
                                          ? "dark:bg-dark450 bg-zinc-100 border-zinc-200 dark:!border-zinc-600"
                                          : "dark:border-zinc-700 dark:bg-dark400 bg-zinc-100 border-zinc-100",
                                       selected
                                          ? "dark:bg-dark400 border-zinc-200/90 dark:!border-zinc-600"
                                          : "dark:border-zinc-700 dark:bg-dark400 bg-zinc-100 border-zinc-100",
                                    )}
                                 >
                                    <div className="mx-auto w-14 h-14 flex items-center justify-center ">
                                       <Image
                                          url={image?.imageUrl}
                                          options="aspect_ratio=1:1&height=120&width=120"
                                          alt={image?.name}
                                       />
                                    </div>
                                    <div className="text-xs pt-1 pb-2 font-semibold text-1 text-center">
                                       {image.name}
                                    </div>
                                 </div>
                              )}
                           </Listbox.Option>
                        ))}
                     </Listbox.Options>
                  </Transition>
               </Listbox>
            </div>
         </section>
         <section>
            <div className="grid grid-cols-3 bg-2-sub divide-x divide-color-sub shadow-sm shadow-1 border rounded-lg border-color-sub mb-3">
               <div className="p-2.5 text-center">
                  <div className="text-sm font-bold">{pokemon.baseAttack}</div>
                  <div className="text-[10px] font-bold text-red-500">ATK</div>
               </div>
               <div className="p-2.5 text-center">
                  <div className="text-sm font-bold">{pokemon.baseDefense}</div>
                  <div className="text-[10px] font-bold text-green-500">
                     DEF
                  </div>
               </div>
               <div className="p-2.5 text-center">
                  <div className="text-sm font-bold">{pokemon.baseStamina}</div>
                  <div className="text-[10px] font-bold text-blue-500">STA</div>
               </div>
            </div>
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
         mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
            >
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Lvl 50</span>
                     <span className="text-1 text-xs">Max CP</span>
                  </div>
                  <div className="text-sm font-semibold">
                     {pokemon.level50CP}
                  </div>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Lvl 40</span>
                  </div>
                  <div className="text-sm font-semibold">
                     {pokemon.level40CP}
                  </div>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Lvl 25</span>
                     <span className="text-1 text-xs">Weather Boost</span>
                  </div>
                  <div className="text-sm font-semibold">
                     {pokemon.level25CP}
                  </div>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Lvl 20</span>
                     <span className="text-1 text-xs">Raids/Eggs</span>
                  </div>
                  <div className="text-sm font-semibold">
                     {pokemon.level20CP}
                  </div>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">Lvl 15</span>
                     <span className="text-1 text-xs">Research</span>
                  </div>
                  <div className="text-sm font-semibold">
                     {pokemon.level15CP}
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
}

function Ratings({ data: pokemon }: { data: PokemonType }) {
   const exists =
      pokemon.ratings?.attackerRating ||
      pokemon.ratings?.greatLeagueRating ||
      pokemon.ratings?.ultraLeagueRating ||
      pokemon.ratings?.masterLeagueRating;
   return (
      <>
         <div
            className={clsx(
               exists
                  ? "border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-lg overflow-hidden"
                  : "",
            )}
         >
            {pokemon.ratings?.attackerRating && (
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-3">
                     <Image
                        height={24}
                        width={24}
                        url="https://static.mana.wiki/pokemongo/attackers-tier-list.png"
                        options="height=40&width=40"
                        alt="Attacker Tier List"
                     />
                     <div className="font-semibold text-sm">
                        Attackers Tier List
                     </div>
                  </div>
                  <div className="text-xs bg-white border shadow-sm shadow-1 border-color-sub justify-center dark:bg-dark400 w-12 h-8 rounded-md flex items-center gap-1">
                     <span className="font-bold">
                        <RatingsLabel
                           fieldName="attackerRating"
                           value={pokemon.ratings?.attackerRating}
                        />
                     </span>
                     <span className="text-1">Tier</span>
                  </div>
               </div>
            )}
            {pokemon.ratings?.greatLeagueRating && (
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-3">
                     <Image
                        height={24}
                        width={24}
                        url="https://static.mana.wiki/pokemongo/great_league.webp"
                        options="height=40&width=40"
                        alt="Great League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Great League PVP
                     </div>
                  </div>
                  <div className="text-xs bg-white border shadow-sm shadow-1 border-color-sub justify-center dark:bg-dark400 w-12 h-8 rounded-md flex items-center gap-1">
                     <span className="font-bold">
                        <RatingsLabel
                           fieldName="greatLeagueRating"
                           value={pokemon.ratings?.greatLeagueRating}
                        />
                     </span>
                     <span className="dark:text-zinc-500 text-zinc-400">/</span>
                     <span className="text-1">5</span>
                  </div>
               </div>
            )}
            {pokemon.ratings?.ultraLeagueRating && (
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-3">
                     <Image
                        height={24}
                        width={24}
                        url="https://static.mana.wiki/pokemongo/ultra_league.png"
                        options="height=40&width=40"
                        alt="Ultra League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Ultra League PVP
                     </div>
                  </div>
                  <div className="text-xs bg-white border shadow-sm shadow-1 border-color-sub justify-center dark:bg-dark400 w-12 h-8 rounded-md flex items-center gap-1">
                     <span className="font-bold">
                        <RatingsLabel
                           fieldName="ultraLeagueRating"
                           value={pokemon.ratings?.ultraLeagueRating}
                        />
                     </span>
                     <span className="dark:text-zinc-500 text-zinc-400">/</span>
                     <span className="text-1">5</span>
                  </div>
               </div>
            )}
            {pokemon.ratings?.masterLeagueRating && (
               <div className="p-3 justify-between flex items-center gap-2">
                  <div className="flex items-center gap-3">
                     <Image
                        height={24}
                        width={24}
                        url="https://static.mana.wiki/pokemongo/master_league.png"
                        options="height=40&width=40"
                        alt="Master League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Master League PVP
                     </div>
                  </div>
                  <div className="text-xs bg-white border shadow-sm shadow-1 border-color-sub justify-center dark:bg-dark400 w-12 h-8 rounded-md flex items-center gap-1">
                     <span className="font-bold">
                        <RatingsLabel
                           fieldName="masterLeagueRating"
                           value={pokemon.ratings?.masterLeagueRating}
                        />
                     </span>
                     <span className="dark:text-zinc-500 text-zinc-400">/</span>
                     <span className="text-1">5</span>
                  </div>
               </div>
            )}
         </div>
      </>
   );
}

function Moves({ data: pokemon }: { data: PokemonType }) {
   return (
      <>
         <h3>Fast</h3>
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-lg overflow-hidden mb-3">
            {pokemon.fastMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/pokemongo/c/moves/${row?.move?.slug}`}
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
                  <div className="flex items-center gap-3 p-3">
                     {row?.category && (
                        <div className="text-[10px] capitalize font-bold text-1 bg-3-sub py-1 px-2 rounded-lg border border-color-sub">
                           {row?.category}
                        </div>
                     )}
                     <Tooltip placement="top">
                        <TooltipTrigger className="rounded-full w-6 h-6 border shadow-sm shadow-1 border-color-sub flex items-center justify-center bg-white dark:bg-zinc-800">
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
                        rounded-lg shadow-sm shadow-1 border border-color bg-white dark:bg-dark400"
                     >
                        {row.move?.pve?.power}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <h3>Charge</h3>
         <div className="border border-color-sub divide-y divide-color-sub bg-2-sub shadow-sm shadow-1 rounded-lg overflow-hidden">
            {pokemon.chargeMoves?.map((row) => (
               <div className="flex items-center" key={row?.move?.id}>
                  <Link
                     prefetch="intent"
                     to={`/pokemongo/c/moves/${row?.move?.slug}`}
                     className="flex items-center w-full gap-2.5 hover:underline flex-grow p-3"
                  >
                     <Image
                        height={24}
                        width={24}
                        url={row?.move?.icon?.url}
                        options="height=40&width=40"
                        alt={row?.move?.name}
                     />
                     <div className="text-sm font-semibold flex-grow">
                        {row?.move?.name}
                     </div>
                  </Link>
                  <div className="flex items-center gap-3 p-3">
                     {row?.category && (
                        <div className="text-[10px] capitalize font-bold text-1 bg-3-sub py-1 px-2 rounded-lg border border-color-sub">
                           {row?.category}
                        </div>
                     )}
                     <Tooltip placement="top">
                        <TooltipTrigger className="rounded-full w-6 h-6 border shadow-sm shadow-1 border-color-sub flex items-center justify-center bg-white dark:bg-zinc-800">
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
                        rounded-lg shadow-sm shadow-1 border border-color bg-white dark:bg-dark400"
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

function OtherInfo({ data: pokemon }: { data: PokemonType }) {
   return (
      <>
         <div className={`${InfoBlock_Container} mb-3`}>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Purification Cost</div>
               <div className={InfoBlock_Content}>
                  <Label
                     fieldName="purificationCost"
                     value={pokemon.purificationCost}
                  />
               </div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Second Charge Move Cost</div>
               <div className={InfoBlock_Content}>
                  <Label
                     fieldName="secondChargeMoveCost"
                     value={pokemon.secondChargeMoveCost}
                  />
               </div>
            </div>
         </div>
         <section className="grid grid-cols-2 gap-4">
            <div className={InfoBlock_Container}>
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Flee Rate</div>
                  <div className={InfoBlock_Content}>{pokemon.fleeRate} %</div>
               </div>
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Buddy Distance</div>
                  <div className={InfoBlock_Content}>
                     <Label
                        fieldName="buddyDistance"
                        value={pokemon.buddyDistance}
                     />
                  </div>
               </div>
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Catch Rate</div>
                  <div className={InfoBlock_Content}>{pokemon.catchRate} %</div>
               </div>
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Female Ratio</div>
                  <div className={InfoBlock_Content}>
                     {pokemon.femaleRate} %
                  </div>
               </div>
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Male Ratio</div>
                  <div className={InfoBlock_Content}>{pokemon.maleRate} %</div>
               </div>
            </div>
         </section>
      </>
   );
}

function RatingsLabel({
   fieldName,
   value,
}: {
   fieldName: string;
   value: string | undefined;
}) {
   const getLabel = Pokemon?.fields
      .find((element: any) => element?.label == "Ratings")
      //@ts-ignore
      ?.fields[0]?.fields?.find((element: any) => element.name == fieldName)
      .options.find((element: any) => element.value == value);
   return <>{getLabel?.label && getLabel.label}</>;
}

function Label({
   fieldName,
   value,
}: {
   fieldName: string;
   value: string | undefined;
}) {
   //@ts-ignore
   const getLabel = Pokemon?.fields
      .find((element: any) => element?.name == fieldName)
      //@ts-ignore
      .options.find((element: any) => element.value == value);
   return <>{getLabel?.label && getLabel.label}</>;
}

const QUERY = gql`
   query ($entryId: String!) {
      pokemon: Pokemon(id: $entryId) {
         id
         slug
         name
         number
         baseAttack
         baseDefense
         baseStamina
         level50CP
         level40CP
         level25CP
         level20CP
         level15CP
         raidBossTier
         femaleRate
         maleRate
         fleeRate
         buddyDistance
         catchRate
         purificationCost
         secondChargeMoveCost
         weight
         height
         ratings {
            attackerRating
            greatLeagueRating
            ultraLeagueRating
            masterLeagueRating
         }
         fastMoves {
            category
            move {
               id
               name
               slug
               category
               pve {
                  power
               }
               icon {
                  url
               }
               type {
                  boostedWeather {
                     name
                     icon {
                        url
                     }
                  }
               }
            }
         }
         chargeMoves {
            category
            move {
               id
               name
               slug
               category
               pve {
                  power
               }
               icon {
                  url
               }
               type {
                  boostedWeather {
                     name
                     icon {
                        url
                     }
                  }
               }
            }
         }
         icon {
            id
            url
         }
         type {
            name
            icon {
               url
            }
         }
         images {
            goImage {
               id
               url
            }
            goShinyImage {
               id
               url
            }
            florkImage {
               id
               url
            }
            shuffleImage {
               id
               url
            }
         }
      }
   }
`;
