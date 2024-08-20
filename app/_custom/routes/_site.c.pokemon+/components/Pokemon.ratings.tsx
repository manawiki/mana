import { Link } from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import type { Pokemon as PokemonType } from "~/db/payload-custom-types";

import { RatingsLabel } from "./RatingsLabel";

export function Ratings({ pokemon }: { pokemon: PokemonType }) {
   const hasAnyRatings =
      pokemon.ratings?.attackerRating ||
      pokemon.ratings?.greatLeagueRating ||
      pokemon.ratings?.ultraLeagueRating ||
      pokemon.ratings?.masterLeagueRating;
   return (
      <>
         {hasAnyRatings && (
            <div className="divide-y divide-color-sub border border-color-sub rounded-lg bg-2-sub shadow-sm shadow-1 overflow-hidden">
               {pokemon.ratings?.attackerRating && (
                  <Link
                     to="/c/tier-lists/attackers-tier-list"
                     className="relative flex items-center dark:hover:bg-dark400 hover:bg-white justify-between gap-1.5 p-2.5"
                  >
                     <div className="flex items-center gap-2.5">
                        <Image
                           height={28}
                           width={28}
                           url="https://static.mana.wiki/entry-icon-l4FBMpUP6D-klgH3zLS_e.png"
                           options="height=120&width=120"
                           alt="Attacker Tier List"
                        />
                        <div className="font-semibold text-sm">
                           Attackers Tier List
                        </div>
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
                     className="relative flex items-center dark:hover:bg-dark400 hover:bg-white justify-between gap-1.5 p-2.5"
                  >
                     <div className="flex items-center gap-2.5">
                        <Image
                           height={28}
                           width={28}
                           url="https://static.mana.wiki/entry-icon-TkBwBHXbgb4E8xmhDXmnj.png"
                           options="height=120&width=120"
                           alt="Great League Rating"
                        />
                        <div className="font-semibold text-sm">
                           Great League PVP
                        </div>
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
                     className="relative flex items-center dark:hover:bg-dark400 hover:bg-white justify-between gap-1.5 p-2.5"
                  >
                     <div className="flex items-center gap-2.5">
                        <Image
                           height={28}
                           width={28}
                           url="https://static.mana.wiki/entry-icon-pXFr_gG0jDPlKKZRF_-Fb.png"
                           options="height=120&width=120"
                           alt="Ultra League Rating"
                        />
                        <div className="font-semibold text-sm">
                           Ultra League PVP
                        </div>
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
                     className="relative flex items-center dark:hover:bg-dark400 hover:bg-white justify-between gap-1.5 p-2.5"
                  >
                     <div className="flex items-center gap-2.5">
                        <Image
                           height={28}
                           width={28}
                           url="https://static.mana.wiki/entry-icon-0zMXRTy0xlTZ5TwiaRGmo.png"
                           options="height=120&width=120"
                           alt="Master League Rating"
                        />
                        <div className="font-semibold text-sm">
                           Master League PVP
                        </div>
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
         )}
      </>
   );
}
