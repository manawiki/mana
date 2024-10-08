import { Link } from "@remix-run/react";

import { Image } from "~/components/Image";

import type { Card } from "~/db/payload-custom-types";
import { ShinyCard } from "./ShinyCard";

export function CardsMain({ data }: { data: Card }) {
   const card = data;

   // get card rarity type data from data
   const rarity = "rare secret";

   return (
      <div className="tablet:flex pb-4 tablet:gap-4">
         <Link to="holo">
            <ShinyCard
               rarity={rarity}
               style={{ width: "367px", height: "512px" }}
            >
               <Image
                  className="rounded-lg overflow-hidden mx-auto max-tablet:mb-4"
                  url={card.image?.url}
                  alt={card.name ?? "Card Image"}
               />
            </ShinyCard>
         </Link>
         <section className="mb-8 flex-grow">
            <div
               className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
               mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
            >
               <div className="p-3 justify-between flex items-center gap-2">
                  <span className="font-semibold text-sm">Type</span>
                  <span className="text-sm font-semibold">
                     {card.pokemonType?.name}
                  </span>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <span className="font-semibold text-sm">HP</span>
                  <span className="text-sm font-semibold">{card.hp}</span>
               </div>
               <div className="p-3 justify-between flex items-center gap-2">
                  <span className="font-semibold text-sm">Retreat Cost</span>
                  <span className="text-sm font-semibold">
                     {card.retreatCost}
                  </span>
               </div>
            </div>
         </section>
      </div>
   );
}
