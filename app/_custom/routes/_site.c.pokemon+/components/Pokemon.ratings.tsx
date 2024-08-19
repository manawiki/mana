import { Link } from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type {
   PokemonFamily,
   Pokemon as PokemonType,
} from "~/db/payload-custom-types";

import { RatingsLabel } from "./RatingsLabel";

export function Ratings({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamily };
}) {
   const pokemon = data.pokemon;

   return (
      <>
         <div className="space-y-3">
            {pokemon.ratings?.attackerRating && (
               <Link
                  to="/c/tier-lists/attackers-tier-list"
                  className="relative flex items-center justify-between dark:hover:border-zinc-600  
                  gap-1.5 p-2.5 bg-2-sub shadow-sm shadow-1 rounded-lg border border-color-sub"
               >
                  <div className="flex items-center gap-2.5">
                     <Image
                        height={32}
                        width={32}
                        url="https://static.mana.wiki/entry-icon-l4FBMpUP6D-klgH3zLS_e.png"
                        options="height=120&width=120"
                        alt="Attacker Tier List"
                     />
                     <div className="font-semibold text-sm">
                        Attackers Tier List
                     </div>
                     <Icon name="external-link" className="text-1" size={14} />
                  </div>
                  <Badge color="teal">
                     <RatingsLabel
                        fieldName="attackerRating"
                        value={pokemon.ratings?.attackerRating}
                     />{" "}
                     Tier
                  </Badge>
               </Link>
            )}
            {pokemon.ratings?.greatLeagueRating && (
               <Link
                  to="/c/tier-lists/great-league-pvp-tier-list"
                  className="relative flex items-center justify-between dark:hover:border-zinc-600  
                  gap-1.5 p-2.5 bg-2-sub shadow-sm shadow-1 rounded-lg border border-color-sub"
               >
                  <div className="flex items-center gap-2.5">
                     <Image
                        height={32}
                        width={32}
                        url="https://static.mana.wiki/entry-icon-TkBwBHXbgb4E8xmhDXmnj.png"
                        options="height=120&width=120"
                        alt="Great League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Great League PVP
                     </div>
                     <Icon name="external-link" className="text-1" size={14} />
                  </div>
                  <Badge color="blue">
                     <RatingsLabel
                        fieldName="greatLeagueRating"
                        value={pokemon.ratings?.greatLeagueRating}
                     />{" "}
                     / 5
                  </Badge>
               </Link>
            )}
            {pokemon.ratings?.ultraLeagueRating && (
               <Link
                  to="/c/tier-lists/ultra-league-pvp-tier-list"
                  className="relative flex items-center justify-between dark:hover:border-zinc-600  
                  gap-1.5 p-2.5 bg-2-sub shadow-sm shadow-1 rounded-lg border border-color-sub"
               >
                  <div className="flex items-center gap-2.5">
                     <Image
                        height={32}
                        width={32}
                        url="https://static.mana.wiki/entry-icon-pXFr_gG0jDPlKKZRF_-Fb.png"
                        options="height=120&width=120"
                        alt="Ultra League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Ultra League PVP
                     </div>
                     <Icon name="external-link" className="text-1" size={14} />
                  </div>
                  <Badge color="yellow">
                     <RatingsLabel
                        fieldName="ultraLeagueRating"
                        value={pokemon.ratings?.ultraLeagueRating}
                     />{" "}
                     / 5
                  </Badge>
               </Link>
            )}
            {pokemon.ratings?.masterLeagueRating && (
               <Link
                  to="/c/tier-lists/master-league-pvp-tier-list"
                  className="relative flex items-center justify-between dark:hover:border-zinc-600  
                  gap-1.5 p-2.5 bg-2-sub shadow-sm shadow-1 rounded-lg border border-color-sub"
               >
                  <div className="flex items-center gap-2.5">
                     <Image
                        height={32}
                        width={32}
                        url="https://static.mana.wiki/entry-icon-0zMXRTy0xlTZ5TwiaRGmo.png"
                        options="height=120&width=120"
                        alt="Master League Rating"
                     />
                     <div className="font-semibold text-sm">
                        Master League PVP
                     </div>
                     <Icon name="external-link" className="text-1" size={14} />
                  </div>
                  <Badge color="purple">
                     <RatingsLabel
                        fieldName="masterLeagueRating"
                        value={pokemon.ratings?.masterLeagueRating}
                     />{" "}
                     / 5
                  </Badge>
               </Link>
            )}
         </div>
      </>
   );
}
