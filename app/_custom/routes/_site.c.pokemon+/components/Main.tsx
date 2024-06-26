import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type { Pokemon as PokemonType } from "~/db/payload-custom-types";

export function Main({ data: pokemon }: { data: PokemonType }) {
   const images = useMemo(
      () => [
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
      ],
      [pokemon],
   );

   const [selectedImage, setSelectedImage] = useState(images[0]);

   useLayoutEffect(() => {
      setSelectedImage(images[0]);
   }, [images]);

   return (
      <div className="laptop:grid laptop:grid-cols-2 laptop:gap-4">
         <section>
            <div className="bg-2-sub shadow-sm shadow-1 border rounded-lg border-color-sub mb-3 relative z-20">
               <div className="border-b bg-3-sub border-color-sub p-2 gap-2 justify-between rounded-t-lg flex items-center">
                  {pokemon.number && (
                     <div className="dark:bg-dark500 font-bold bg-zinc-100 rounded-md px-2 py-1.5 text-xs space-x-0.5">
                        <span className="text-1">#</span>
                        <span>{pokemon.number}</span>
                     </div>
                  )}
                  <div className="flex items-center gap-2">
                     {pokemon?.type?.map((type) => (
                        <Tooltip key={type.name} placement="top">
                           <TooltipTrigger>
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
                        {images.map(
                           (image) =>
                              image.imageUrl && (
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
                              ),
                        )}
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
