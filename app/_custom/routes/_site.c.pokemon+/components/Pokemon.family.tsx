import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Image } from "~/components/Image";
import type {
   Pokemon as PokemonType,
   PokemonFamily as PokemonFamilyType,
   EvolutionRequirement,
} from "~/db/payload-custom-types";

function FamilyItem({
   pokemon,
   evolutionReqs,
}: {
   pokemon: PokemonType | undefined;
   evolutionReqs?: EvolutionRequirement[] | null | undefined;
}) {
   return (
      <NavLink
         to={`/c/pokemon/${pokemon?.slug}`}
         className={({ isActive, isPending }) =>
            clsx(
               "border rounded-lg p-2 pr-8 gap-2 items-center shadow-sm shadow-1",
               isActive
                  ? "dark:bg-dark450 bg-zinc-50 border-zinc-300 dark:border-zinc-600"
                  : "bg-3-sub border-color-sub hover:bg-zinc-50 dark:hover:bg-dark450 dark:hover:border-zinc-600 hover:border-zinc-300",
            )
         }
      >
         <div className="flex gap-2.5 items-center">
            <Image
               width={80}
               height={80}
               url={pokemon?.icon?.url}
               className="size-9"
               options="aspect_ratio=1:1"
               alt={pokemon?.name ?? "Icon"}
            />
            <div>
               <span className="font-semibold text-sm">{pokemon?.name}</span>
               {evolutionReqs?.map((row) => (
                  <div className="text-1 text-xs" key={row.id}>
                     {row.name}
                  </div>
               ))}
            </div>
         </div>
      </NavLink>
   );
}

export function PokemonFamily({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamilyType };
}) {
   const family = data.family;

   const stage =
      family?.stage4Pokemon && family.stage4Pokemon?.length > 0
         ? 4
         : family?.stage3Pokemon && family.stage3Pokemon?.length > 0
           ? 3
           : family?.stage2Pokemon && family.stage2Pokemon?.length > 0
             ? 2
             : 1;

   return (
      family && (
         <div className="flex max-laptop:flex-col gap-6 laptop:gap-4 pb-4 pt-1 justify-stretch">
            <div className="flex flex-col gap-2 flex-grow">
               <div className="flex items-center gap-2">
                  <div className="font-mono font-bold text-sm">Stage 1</div>
                  <span className="h-0.5 flex-grow dark:bg-dark500 rounded-full" />
               </div>
               <FamilyItem pokemon={family?.basePokemon} />
            </div>
            {family?.stage2Pokemon && family.stage2Pokemon?.length > 0 && (
               <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2">
                     <div className="font-mono font-bold text-sm">Stage 2</div>
                     <span className="h-0.5 flex-grow dark:bg-dark500 rounded-full" />
                  </div>
                  {family?.stage2Pokemon?.map((row) => (
                     <FamilyItem
                        key={row.id}
                        pokemon={row.pokemon}
                        evolutionReqs={row.evolutionRequirements}
                     />
                  ))}
               </div>
            )}
            {family?.stage3Pokemon && family.stage3Pokemon?.length > 0 && (
               <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2">
                     <div className="font-mono font-bold text-sm">Stage 3</div>
                     <span className="h-0.5 flex-grow dark:bg-dark500 rounded-full" />
                  </div>
                  {family?.stage3Pokemon?.map((row) => (
                     <FamilyItem
                        key={row.id}
                        pokemon={row.pokemon}
                        evolutionReqs={row.evolutionRequirements}
                     />
                  ))}
               </div>
            )}
            {family?.stage4Pokemon && family.stage4Pokemon?.length > 0 && (
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <div className="font-mono font-bold text-sm">Stage 4</div>
                     <span className="h-0.5 flex-grow dark:bg-dark500 rounded-full" />
                  </div>
                  {family?.stage4Pokemon?.map((row) => (
                     <FamilyItem
                        key={row.id}
                        pokemon={row.pokemon}
                        evolutionReqs={row.evolutionRequirements}
                     />
                  ))}
               </div>
            )}
         </div>
      )
   );
}
