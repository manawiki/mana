import type { Pokemon } from "payload/generated-custom-types";

export type DPSPokemon = ReturnType<typeof parsePokemon>;

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
   // fastMoves_legacy = [],
   // chargedMoves_legacy = [],
   // fastMoves_exclusive = [],
   // chargedMoves_exclusive = [];

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
      rarity = LegendaryPokemon.some((mythical) =>
         name.toLowerCase().includes(mythical),
      )
         ? "POKEMON_RARITY_LEGENDARY"
         : MythicalPokemon.some((mythical) =>
                name.toLowerCase().includes(mythical),
             )
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
   "articuno",
   "azelf",
   "cresselia",
   "dialga",
   "entei",
   "giratina",
   "groudon",
   "heatran",
   "ho-oh",
   "kyogre",
   "kyurem",
   "landorus",
   "latias",
   "latios",
   "lugia",
   "mesprit",
   "mewtwo",
   "moltres",
   "palkia",
   "raikou",
   "rayquaza",
   "regice",
   "regigigas",
   "regirock",
   "registeel",
   "reshiram",
   "suicune",
   "thundurus",
   "tornadus",
   "uxie",
   "zapdos",
   "zekrom",
];

export const MythicalPokemon = [
   "arceus",
   "celebi",
   "darkrai",
   "deoxys",
   "jirachi",
   "manaphy",
   "melmetal",
   "meltan",
   "mew",
   "phione",
   "shaymin (land forme)",
   "shaymin (sky forme)",
   "victini",
   "volcanion",
   "zarude",
   "zeraora",
];
