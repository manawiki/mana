import type { Pokemon } from "payload/generated-custom-types";

export function parsePokemons(pokemons: { docs: Pokemon[] }) {
   return pokemons?.docs
      ?.map((pokemon: Pokemon) => parsePokemon(pokemon))
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
}

export function parsePokemon(pokemon: Pokemon) {
   let dex = pokemon.number,
      name = pokemon.name ?? pokemon.slug ?? pokemon.id,
      slug = pokemon.slug,
      id = pokemon.id,
      pokeType1 = pokemon.type?.[0]?.id,
      pokeType2 = pokemon.type?.[1]?.id,
      baseAtk = pokemon.baseAttack,
      baseDef = pokemon.baseDefense,
      baseStm = pokemon.baseStamina;

   let fastMoves = pokemon.fastMoves?.map((move) => move?.move?.id);
   let chargedMoves = pokemon.chargeMoves?.map((move) => move?.move?.id);

   // we won't be using these for now, may need to rework this as toggles
   // fastMoves_legacy = [], //missing
   // chargedMoves_legacy = [], //missing
   // fastMoves_exclusive = [], //missing
   // chargedMoves_exclusive = []; //missing

   let rating = pokemon.ratings?.attackerRating
         ? parseInt(pokemon.ratings?.attackerRating)
         : 0,
      raidMarker = "",
      nid, //missing
      icon = pokemon?.icon?.url,
      label = name,
      labelLinked = `<a href="/c/pokemon/${pokemon.slug}" hreflang="en">${label}</a>`,
      //todo add pokemon-family
      evolutions = [] as string[],
      unavailable = "", //missing
      rarity = LegendaryPokemon.includes(name)
         ? "POKEMON_RARITY_LEGENDARY"
         : MythicalPokemon.includes(name)
           ? "POKEMON_RARITY_MYTHIC"
           : undefined;

   return {
      dex,
      name,
      id,
      slug,
      pokeType1,
      pokeType2,
      baseAtk,
      baseDef,
      baseStm,
      fastMoves,
      chargedMoves,
      // fastMoves_legacy,
      // chargedMoves_legacy,
      // fastMoves_exclusive,
      // chargedMoves_exclusive,
      rating,
      raidMarker,
      nid,
      icon,
      label,
      labelLinked,
      evolutions,
      unavailable,
      rarity,
   };
}

export const LegendaryPokemon = [
   "regice",
   "entei",
   "registeel",
   "suicune",
   "heatran",
   "latias",
   "rayquaza",
   "azelf",
   "moltres",
   "mewtwo",
   "latios",
   "groudon",
   "regirock",
   "dialga",
   "giratina (altered forme)",
   "giratina (origin forme)",
   "mesprit",
   "zapdos",
   "lugia",
   "articuno",
   "ho-oh",
   "kyogre",
   "regigigas",
   "uxie",
   "palkia",
   "cresselia",
   "raikou",
   "tornadus (incarnate forme)",
   "tornadius (therian forme)",
   "landorus (incarnate forme)",
   "landorus (therian forme)",
   "thundurus (incarnate forme)",
   "thundurus (therian forme)",
   "black kyurem",
   "white kyurem",
   "kyurem",
   "reshiram",
   "zekrom",
   "shadow raikou",
];
export const MythicalPokemon = [
   "arceus",
   "darkrai",
   "phione",
   "shaymin",
   "deoxys (attack forme)",
   "deoxys (defense forme)",
   "deoxys (normal forme)",
   "deoxys (speed forme)",
   "manaphy",
   "celebi",
   "mew",
   "meltan",
   "jirachi",
   "melmetal",
];
