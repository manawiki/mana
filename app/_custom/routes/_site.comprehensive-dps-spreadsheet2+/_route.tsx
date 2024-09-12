import { useState } from "react";

import { Combobox } from "@headlessui/react";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import {
   Form,
   json,
   Link,
   useLoaderData,
   useSearchParams,
   useSubmit,
} from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

import type { Move, Pokemon } from "payload/generated-custom-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { fetchWithCache } from "~/utils/cache.server";

import { generateSpreadsheet, getCustom, getEnemy } from "./calc";
import { GM, Data, weathers, pokeTypes, PokeQuery } from "./dataFactory";
import { parseMoves } from "./parseMoves";
import { parsePokemons } from "./parsePokemons";

export { ErrorBoundary } from "~/components/ErrorBoundary";

const simpleCache = {} as Record<string, any>;

export async function loader({ request }: LoaderFunctionArgs) {
   const moves = await fetchWithCache<{ docs: Move[] }>(
      "http://localhost:4000/api/moves?limit=0&depth=0",
      undefined,
      24 * 60 * 60 * 1000,
   );
   const pokemons = await fetchWithCache<{ docs: Pokemon[] }>(
      "http://localhost:4000/api/pokemon?limit=0&depth=1",
      undefined,
      24 * 60 * 60 * 1000,
   );

   // we should cache these at some point
   const pokeMoves = parseMoves(moves);
   const pokemon = parsePokemons(pokemons);

   const FastMoves = pokeMoves.filter((move) => move.moveType === "fast");
   const ChargedMoves = pokeMoves.filter((move) => move.moveType === "charged");

   return json({ pokemon, FastMoves, ChargedMoves });
}

clientLoader.hydrate = true;

export async function clientLoader({
   request,
   serverLoader,
}: ClientLoaderFunctionArgs) {
   async function cacheServerLoader<T>() {
      if (simpleCache.serverData) {
         console.log("cache found!", simpleCache.serverData);
         return simpleCache.serverData as SerializeFrom<T>;
      }

      console.log("cache not found, fetching data");

      const data = await serverLoader<T>();

      simpleCache.serverData = data;
      return data;
   }

   const { pokemon, FastMoves, ChargedMoves } =
      await cacheServerLoader<typeof loader>();

   // get query params from url
   const url = new URL(request.url);

   console.log(url);

   const context = getCustom(url.searchParams);

   const enemyContext = getEnemy(context);

   // console.log({ context, enemyContext });

   // console.log(Data);

   // Load Data
   Data.Pokemon = pokemon;
   Data.FastMoves = FastMoves;
   Data.ChargedMoves = ChargedMoves;

   //create a simple in-memory cache
   function cacheResult(key: string) {
      //toggle move data for pvp mode
      context.battleMode === "pvp" ? GM.mode("pvp") : GM.mode("raid");

      const result = generateSpreadsheet(pokemon, {
         ...context,
         ...enemyContext,
      });

      simpleCache[key] = result;

      console.log("cached", simpleCache);

      return result;
   }

   const key = url.search || "default";
   const results = simpleCache[key] ? simpleCache[key] : cacheResult(key);

   //apply table filters
   const filtered = filterResults(results, url.searchParams);

   // console.log(filtered);

   // console.log(pokemon);

   console.log(simpleCache);

   return {
      pokemon,
      results: filtered,
      count: filtered?.length,
   };
}

clientLoader.hyrate = true;

export function HydrateFallback() {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20 ">
         <Introduction />
         <NewToggles />
         <Icon name="loader-2" size={24} className="mx-auto animate-spin" />
      </div>
   );
}

export function ComprehensiveDpsSpreadsheet() {
   const { pokemon } = useLoaderData<typeof clientLoader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20 ">
         <Introduction />
         <NewToggles pokemon={pokemon} />

         <ResultsTable />
      </div>
   );
}

export function Introduction() {
   return (
      <div className=" p-6 shadow rounded-lg">
         <p className="">
            This is GamePress's complete list of all Pokemon and all movesets
            and their associated
            <Link
               to="/pokemongo/how-calculate-comprehensive-dps"
               className="text-blue-600 underline"
            >
               DPS (Damage Per Second) and TDO (Total Damage Output)
            </Link>
         </p>
         <p className=" mt-4">
            The list is sortable by clicking on the double-ended arrows near the
            name of the categories. Selecting the "Swap Dscnt" checkbox will
            account for the time it takes to swap Pokemon during a raid battle.
            Selecting "My Pokemon" will populate the list with all Pokemon
            uploaded to your GamePress account. Selecting "Best" will show only
            the best moveset for each Pokemon.
         </p>
         <p className=" mt-4">
            To specify DPS and TDO for a specific matchup, select the enemy
            Pokemon and weather above the search bar. For a detailed sort, try
            using the search bar, which works much like the in-game search bar.
            <a
               className="text-blue-600 underline"
               href="https://github.com/biowpn/GoBattleSim/blob/master/doc/PokeQuery.md"
            >
               Here
            </a>
            is the list of search features supported. Some examples:
         </p>
         <div className="mt-6">
            <div className="border-t border-b border-gray-200">
               <div className="flex justify-between px-6 py-3 border-b-2">
                  <span className="font-semibold ">Search</span>
                  <span className="font-semibold ">Example</span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Dex Number</span>
                  <span className=" float-right">1-151</span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Pokemon Type</span>
                  <span className=" float-right">
                     normal, normal & flying, normal & none
                  </span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Move Type</span>
                  <span className=" float-right">
                     @ghost, @1ghost, @2ghost, *@ghost
                  </span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Base Stats</span>
                  <span className=" float-right">baseatk180-200, cp3000-</span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Filter by move</span>
                  <span className=" float-right">
                     @legacy / @exclusive / @stab
                  </span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Filter out legacy moves</span>
                  <span className=" float-right">@*current</span>
               </div>
               <div className="px-6 py-3 border-b border-gray-200">
                  <span className="">Filter out Shadow Pokemon</span>
                  <span className=" float-right">!shadow</span>
               </div>
               <div className="px-6 py-3">
                  <span className="">
                     View only Pokemon with fast and charged moves that are the
                     same type
                  </span>
                  <span className=" float-right">@same</span>
               </div>
            </div>
            <p className=" mt-4">
               These searches can be combined with the '&' symbol to create a
               pinpointed reference for DPS and TDO.
            </p>
         </div>
      </div>
   );
}

function NewToggles({ pokemon = [] }: { pokemon?: Array<any> }) {
   const [enemyPokemon, setEnemyPokemon] = useState({});
   const submit = useSubmit();

   const fastMoves =
      [
         enemyPokemon?.fastMoves,
         enemyPokemon?.fastMove_exclusive,
         enemyPokemon?.fastMoves_legacy,
      ]
         .flat(1)
         .filter((move) => move) ?? [];

   const chargedMoves =
      [
         enemyPokemon?.chargedMoves,
         enemyPokemon?.chargedMove_exclusive,
         enemyPokemon?.chargedMoves_legacy,
      ]
         .flat(1)
         .filter((move) => move) ?? [];

   return (
      <Form
         method="GET"
         replace={true}
         id="dps-form"
         name="dps-form"
         preventScrollReset={true}
         onChange={(e) => {
            submit(e.currentTarget, {
               method: "GET",
               preventScrollReset: true,
            });
         }}
         className=" p-6 rounded-lg shadow-lg"
      >
         <div className="grid grid-cols-3 gap-6">
            <div>
               <div className="text-lg font-semibold mb-4">
                  Enemy Information
               </div>
               <div className="mb-4">
                  <label
                     className="block text-sm font-medium mb-1"
                     htmlFor="enemy-pokemon-name"
                  >
                     Species
                  </label>
                  <PokemonComboBox
                     enemyPokemon={enemyPokemon}
                     setEnemyPokemon={setEnemyPokemon}
                     pokemon={pokemon}
                  />
                  {enemyPokemon?.name && (
                     <input
                        hidden
                        name="enemy-pokemon-name"
                        id="enemy-pokemon-name"
                        value={enemyPokemon?.name}
                     />
                  )}
               </div>
               <div className="mb-4">
                  <label
                     className="block text-sm font-medium mb-1"
                     htmlFor="enemy-pokemon-fmove"
                  >
                     Fast Move
                  </label>
                  <select
                     id="enemy-pokemon-fmove"
                     name="enemy-pokemon-fmove"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                     placeholder="Fast Move"
                  >
                     {fastMoves.map((move) => (
                        <option key={move} value={move}>
                           {capitalize(move.replace(/-/g, " "))}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="mb-4">
                  <label
                     className="block text-sm font-medium mb-1"
                     htmlFor="weather"
                  >
                     Weather
                  </label>
                  <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                     id="weather"
                     name="weather"
                     placeholder="choose weather"
                  >
                     {weathers.map(({ name, label }) => (
                        <option key={name} value={name}>
                           {label}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     className="w-4 h-4"
                     id="ui-swapDiscount-checkbox"
                     name="ui-swapDiscount-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-swapDiscount-checkbox">Swap Dscnt</label>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     id="ui-cpcap"
                     type="number"
                     placeholder="CP Cap"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                     name="ui-cpcap"
                  />
               </div>
               <div className="flex items-center gap-2">
                  <input
                     className="w-4 h-4"
                     id="ui-allyMega-checkbox"
                     name="ui-allyMega-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-allyMega-checkbox">Mega Boost?</label>
               </div>
               <div className="flex items-center gap-2">
                  <input
                     className="w-4 h-4"
                     id="ui-allyMegaStab-checkbox"
                     name="ui-allyMegaStab-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-allyMegaStab-checkbox">Mega Stab?</label>
               </div>
            </div>
            <div>
               <label
                  htmlFor="pokemon-pokeType1"
                  className="block text-sm font-medium mb-1"
               >
                  PokeType 1
               </label>
               <div className="mb-4">
                  <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                     id="pokemon-pokeType1"
                     name="pokemon-pokeType1"
                  >
                     <option value="none">None</option>
                     {pokeTypes.map((type) => (
                        <option
                           key={type}
                           value={type}
                           selected={enemyPokemon?.pokeType1 === type}
                        >
                           {capitalize(type)}
                        </option>
                     ))}
                  </select>
               </div>
               <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="enemy-pokemon-cmove"
               >
                  Charged Move
               </label>
               <div className="mb-4">
                  <select
                     id="enemy-pokemon-cmove"
                     name="enemy-pokemon-cmove"
                     placeholder="Charge Move"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                     {chargedMoves.map((move) => (
                        <option key={move} value={move}>
                           {capitalize(move.replace(/-/g, " "))}
                        </option>
                     ))}
                  </select>
               </div>
               <button
                  disabled
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-blue-500 text-white"
               >
                  Customize
               </button>
            </div>
            <div>
               <label
                  htmlFor="pokemon-pokeType2"
                  className="block text-sm font-medium mb-1"
               >
                  PokeType 2
               </label>
               <div className="mb-4">
                  <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                     id="pokemon-pokeType2"
                     name="pokemon-pokeType2"
                  >
                     <option value="none">None</option>
                     {pokeTypes.map((type) => (
                        <option
                           key={type}
                           value={type}
                           selected={enemyPokemon?.pokeType2 === type}
                        >
                           {capitalize(type)}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="text-lg font-semibold mb-4">Controls</div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     className="w-4 h-4"
                     id="ui-use-box-checkbox"
                     name="ui-use-box-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-use-box-checkbox">My Pokemon</label>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     className="w-4 h-4"
                     id="ui-pvpMode-checkbox"
                     name="ui-pvpMode-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-pvpMode-checkbox">PvP Mode</label>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     className="w-4 h-4"
                     id="ui-uniqueSpecies-checkbox"
                     name="ui-uniqueSpecies-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-uniqueSpecies-checkbox">Best</label>
               </div>
               <div className="flex items-center gap-2 mb-4">
                  <input
                     className="w-4 h-4"
                     id="ui-hideUnavail-checkbox"
                     name="ui-hideUnavail-checkbox"
                     type="checkbox"
                  />
                  <label htmlFor="ui-hideUnavail-checkbox">Hide Unavail</label>
               </div>
               <div className="mb4">
                  <label
                     className="block text-sm font-medium mb-1"
                     htmlFor="attacker-level"
                  >
                     Attacker Level
                  </label>
                  <input
                     id="attacker-level"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                     name="attacker-level"
                     placeholder="40"
                     type="number"
                     min={1}
                     max={51}
                     step={0.5}
                  />
               </div>
               <button
                  id="refresher"
                  type="submit"
                  name="refresher"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-green-500 text-white"
               >
                  Refresh
               </button>
            </div>
         </div>
      </Form>
   );
}

function ResultsTable() {
   const { results, count } = useLoaderData<typeof clientLoader>();

   const [searchParams] = useSearchParams();

   // pagination
   const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") ?? "1")
      : 1;

   const start = 100 * page - 100;
   const end = 100 * page;

   const filtered = results
      //limit results to the top 100
      .slice(start, end);

   return (
      <>
         <Search />
         <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
            Displaying {start + 1} to {end} of {count} results
            <Pagination count={count} />
         </div>
         <table className="w-full ">
            <thead>
               <tr>
                  <th className="py-4 text-left">Pokemon</th>
                  <th className="py-4 text-left">Fast Move</th>
                  <th className="py-4 text-left">Charged Move</th>
                  <TH>DPS</TH>
                  <TH>TDO</TH>
                  <TH>ER</TH>
                  <TH>CP</TH>
               </tr>
            </thead>
            <tbody>
               {filtered.map((pokemon, index) => (
                  <tr key={index} className="group">
                     <td className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700 ">
                        <Link
                           to={pokemon.link}
                           className="flex items-center gap-3 group py-0.5"
                        >
                           <Image
                              url={pokemon.icon}
                              width="36"
                              height="36"
                              aria-label={pokemon.label}
                              loading="lazy"
                           />
                           {pokemon?.label}
                        </Link>
                     </td>
                     <td className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700 ">
                        <Link
                           to={pokemon.fmove.link}
                           className="flex items-center gap-3 group py-0.5"
                        >
                           <Image
                              url={pokemon?.fmove?.icon}
                              width="14"
                              height="14"
                              aria-label={pokemon?.fmove?.label}
                              loading="lazy"
                           />
                           {pokemon?.fmove?.label}
                        </Link>
                     </td>
                     <td className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700 ">
                        <Link
                           to={pokemon.cmove.link}
                           className="flex items-center gap-3 group py-0.5"
                        >
                           <Image
                              url={pokemon?.cmove?.icon}
                              width="14"
                              height="14"
                              aria-label={pokemon?.cmove?.label}
                              loading="lazy"
                           />
                           {pokemon?.cmove?.label}
                        </Link>
                     </td>
                     <td
                        className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700  text-right"
                        aria-label={pokemon?.dps}
                     >
                        {pokemon?.ui_dps}
                     </td>
                     <td
                        className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700  text-right"
                        aria-label={pokemon?.tdo}
                     >
                        {pokemon?.ui_tdo}
                     </td>
                     <td className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700  text-right">
                        {pokemon?.ui_overall}
                     </td>
                     <td className="group-odd:!bg-white group-odd:dark:!bg-gray-900 group-even:!bg-gray-50 group-even:dark:!bg-gray-800 group-border-b group-dark:!border-gray-700  text-right">
                        {pokemon?.ui_cp}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
            Displaying {start + 1} to {end} of {count} results
            <Pagination count={count} />
         </div>
         {/* {count} results
         <div className="container">
            <div className="row">
               <div className="col-sm-6">
                  <button id="CopyClipboardButton" className="btn btn-info">
                     Copy to Clipboard (todo)
                  </button>
               </div>
               <div className="col-sm-6">
                  <button id="CopyCSVButton" className="btn btn-info">
                     Export To CSV (todo)
                  </button>
               </div>
            </div>
         </div> */}
      </>
   );
}

function filterResults(results, searchParams) {
   let filtered = results;

   const columns: { [key: string]: string } = {
      DPS: "dps",
      TDO: "tdo",
      ER: "ui_overall",
      CP: "ui_cp",
   };

   // to-do read params to toggle sorting
   const sort = columns[searchParams.get("sort")!] ?? "dps";
   const asc = searchParams.get("asc") ? 1 : -1;

   filtered = filtered.sort((a, b) => (a[sort] > b[sort] ? asc : -1 * asc));

   // filter out unavailable Pokemon if toggled
   if (searchParams.get("ui-hideUnavail-checkbox")) {
      filtered = filtered.filter((pokemon) => pokemon?.unavailable !== "On");
   }

   // filter for unique species if toggled
   if (searchParams.get("ui-uniqueSpecies-checkbox")) {
      //reduce the filtered array so only one of each pokemon.name remains

      let unique = [];

      for (let i = 0; i < filtered.length; i++) {
         if (!unique.map((poke) => poke?.name).includes(filtered[i].name)) {
            unique.push(filtered[i]);
         }
      }

      filtered = unique;
   }

   // implement search
   const search = searchParams.get("search");

   if (search) {
      filtered = filtered.filter(PokeQuery(search));
   }

   return filtered;
}

//Make the th clickable to sort
function TH({ children }: { children: string }) {
   const [searchParams, setSearchParams] = useSearchParams();

   const sort = searchParams.get("sort") ?? "DPS";
   const asc = searchParams.get("asc");

   const onClick = () => {
      setSearchParams(
         (searchParams) => {
            searchParams.set("sort", children);

            //reset asc if we're sorting by a different column
            sort !== children
               ? searchParams.delete("asc")
               : asc
                 ? searchParams.delete("asc")
                 : searchParams.set("asc", "true");

            return searchParams;
         },
         { preventScrollReset: true },
      );
   };

   return (
      <th className="py-4 ">
         <button
            className="flex gap-1 capitalize justify-end w-full"
            type="button"
            onClick={onClick}
         >
            <Icon
               name={
                  sort !== children.toString()
                     ? "chevrons-up-down"
                     : asc
                       ? "chevron-up"
                       : "chevron-down"
               }
               size={18}
               className="text-zinc-500"
            />
            {children}
         </button>
      </th>
   );
}

// Insert a simple pagination component here
function Pagination({ count = 100 }) {
   // const { count } = useClientData();
   const [searchParams, setSearchParams] = useSearchParams();

   const page = parseInt(searchParams.get("page") ?? "1");

   const numPages = Math.ceil(count / 100);

   if (numPages <= 1) return null;

   return (
      <>
         <button
            //todo convert this to links
            className="flex items-center gap-1 font-semibold uppercase hover:underline"
            onClick={() =>
               setSearchParams(
                  (searchParams) => {
                     searchParams.set("page", (page - 1).toString());
                     return searchParams;
                  },
                  { preventScrollReset: true },
               )
            }
            disabled={page === 1}
         >
            <Icon name="chevron-left" size={18} className="text-zinc-500">
               Prev
            </Icon>
         </button>

         <input
            // form="dps-form"
            type="number"
            key={"page " + page}
            defaultValue={page}
            className="w-16"
            name="page"
            min={1}
            max={numPages}
            onChange={(e) => {
               setSearchParams(
                  (searchParams) => {
                     searchParams.set("page", e.target.value);
                     return searchParams;
                  },
                  { preventScrollReset: true },
               );
            }}
         />
         {/* <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" /> */}

         <button
            className="flex items-center gap-1 font-semibold uppercase hover:underline"
            onClick={() =>
               setSearchParams(
                  (searchParams) => {
                     searchParams.set("page", (page + 1).toString());
                     return searchParams;
                  },
                  { preventScrollReset: true },
               )
            }
            disabled={page >= numPages}
         >
            Next
            <Icon
               name="chevron-right"
               title="Next"
               size={18}
               className="text-zinc-500"
            />
         </button>
      </>
   );
}

function Search() {
   const [searchParams, setSearchParams] = useSearchParams();

   return (
      <div className="w-full">
         <label htmlFor="search">Search</label>

         <input
            id="search"
            //  onKeyUp={search_trigger}
            className="w-full"
            name="search"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => {
               setSearchParams(
                  (searchParams) => {
                     searchParams.set("search", e.target.value);
                     searchParams.delete("page");
                     return searchParams;
                  },
                  { preventScrollReset: true },
               );
            }}
         />
      </div>
   );
}

export function PokemonComboBox({ enemyPokemon, setEnemyPokemon, pokemon }) {
   const [query, setQuery] = useState("");

   const filteredPokemon =
      query === ""
         ? pokemon
         : pokemon.filter((current) => {
              return current.id.includes(query.toLowerCase());
           });

   return (
      <Combobox
         // name="enemy-pokemon-name"
         value={enemyPokemon}
         onChange={setEnemyPokemon}
      >
         <Combobox.Input
            // className="h-full w-full border-0 laptop:rounded-full p-0 bg-transparent laptop:pl-8 outline-none !ring-transparent"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            displayValue={(item) => capitalize(item?.name) ?? ""}
            placeholder="Species"
            onChange={(e) => setQuery(e.target.value)}
         />

         <Combobox.Options
         // todo fix css
         // className="bg-white dark:bg-dark350 outline-color border shadow-1 border-zinc-100 dark:border-zinc-700 divide-color-sub absolute left-0 z-20 max-h-80 w-full divide-y
         // overflow-auto shadow-xl outline-1 max-laptop:border-y laptop:mt-2 no-scrollbar laptop:rounded-2xl laptop:outline"
         >
            {filteredPokemon.length === 0
               ? query && (
                    <div className="text-1 p-3 text-sm">No results...</div>
                 )
               : filteredPokemon?.map((item) => (
                    <Combobox.Option
                       className={({ active }) =>
                          `relative cursor-default select-none ${
                             active ? "bg-zinc-100 dark:bg-dark400" : "text-1"
                          }`
                       }
                       key={item?.name}
                       value={item}
                    >
                       {item?.name}
                    </Combobox.Option>
                 ))}
         </Combobox.Options>
      </Combobox>
   );
}

//reimplement this and add to context
// function MoveEditForm() {
//    return (
//       <Form className="flex w-full">
//          <div id="moveEditForm" title="Add/Edit Move">
//             <table id="moveEditForm-table">
//                <tr>
//                   <th>Scope</th>
//                   <td>
//                      <select name="move-scope">
//                         <option value="regular">Regular (PvE)</option>
//                         <option value="combat">Combat (PvP)</option>
//                      </select>
//                   </td>
//                </tr>
//                <tr>
//                   <th>Category</th>
//                   <td>
//                      <select name="move-moveType">
//                         <option value="fast">Fast</option>
//                         <option value="charged">Charged</option>
//                      </select>
//                   </td>
//                </tr>
//                <tr>
//                   <th>Name</th>
//                   <td>
//                      <input
//                         type="text"
//                         name="move-name"
//                         className="input-with-icon move-input-with-icon"
//                      />
//                   </td>
//                </tr>
//                <tr>
//                   <th>Typing</th>
//                   <td>
//                      <select name="move-pokeType"></select>
//                   </td>
//                </tr>
//                <tr>
//                   <th>Power</th>
//                   <td>
//                      <input type="number" name="move-power" />
//                   </td>
//                </tr>
//                <tr>
//                   <th>EnergyDelta</th>
//                   <td>
//                      <input type="number" name="move-energyDelta" />
//                   </td>
//                </tr>
//                <tr>
//                   <th>Duration (in miliseconds)</th>
//                   <td>
//                      <input type="number" name="move-duration" />
//                   </td>
//                </tr>
//                <tr>
//                   <th>Damage Window (in miliseconds)</th>
//                   <td>
//                      <input type="number" name="move-dws" />
//                   </td>
//                </tr>
//                <tr>
//                   <th>Effect</th>
//                   <td>
//                      <input name="move-effect" />
//                   </td>
//                </tr>
//             </table>
//             <br />

//             <div className="container">
//                <div className="row">
//                   <div className="col-sm-6">
//                      <button
//                         id="moveEditForm-submit"
//                         className="center_stuff btn btn-primary"
//                      >
//                         <i className="fa fa-check" aria-hidden="true"></i> Save
//                      </button>
//                   </div>
//                   <div className="col-sm-3">
//                      <button
//                         id="moveEditForm-delete"
//                         className="center_stuff btn btn-warning"
//                      >
//                         <i className="fa fa-trash" aria-hidden="true"></i>{" "}
//                         Delete
//                      </button>
//                   </div>
//                   <div className="col-sm-3">
//                      <button
//                         id="moveEditForm-reset"
//                         className="center_stuff btn btn-danger"
//                      >
//                         <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
//                         Reset
//                      </button>
//                   </div>
//                </div>
//             </div>
//          </div>

//          <div id="pokemonEditForm" title="Add/Edit Pokemon">
//             <table id="pokemonEditForm-table">
//                <tbody>
//                   <tr>
//                      <th>Pokemon Name</th>
//                      <td>
//                         <input
//                            type="text"
//                            name="pokemon-name"
//                            className="input-with-icon species-input-with-icon"
//                         />
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Pokemon Typing 1</th>
//                      <td>
//                         <select name="pokemon-pokeType1"></select>
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Pokemon Typing 2</th>
//                      <td>
//                         <select name="pokemon-pokeType2"></select>
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Base Attack</th>
//                      <td>
//                         <input type="number" name="pokemon-baseAtk" />
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Base Defense</th>
//                      <td>
//                         <input type="number" name="pokemon-baseDef" />
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Base Stamina</th>
//                      <td>
//                         <input type="number" name="pokemon-baseStm" />
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Fast Move Pool</th>
//                      <td>
//                         <input type="text" name="pokemon-fmoves" />
//                      </td>
//                   </tr>
//                   <tr>
//                      <th>Charged Move Pool</th>
//                      <td>
//                         <input type="text" name="pokemon-cmoves" />
//                      </td>
//                   </tr>
//                </tbody>
//             </table>
//             <br />
//             <div className="container">
//                <div className="row">
//                   <div className="col-sm-6">
//                      <button
//                         id="pokemonEditForm-submit"
//                         className="center_stuff btn btn-primary"
//                      >
//                         <i className="fa fa-check" aria-hidden="true"></i> Save
//                      </button>
//                   </div>
//                   <div className="col-sm-3">
//                      <button
//                         id="pokemonEditForm-delete"
//                         className="center_stuff btn btn-warning"
//                      >
//                         <i className="fa fa-trash" aria-hidden="true"></i>{" "}
//                         Delete
//                      </button>
//                   </div>
//                   <div className="col-sm-3">
//                      <button
//                         id="pokemonEditForm-reset"
//                         className="center_stuff btn btn-danger"
//                      >
//                         <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
//                         Reset
//                      </button>
//                   </div>
//                </div>
//             </div>
//          </div>

//          <div id="parameterEditForm" title="Edit Battle Settings">
//             <div
//                style={{
//                   display: "inline-block",
//                   overflowY: "scroll",
//                   maxHeight: "40vh",
//                   width: "100%",
//                }}
//             >
//                <table id="parameterEditForm-Table">
//                   <thead>
//                      <tr>
//                         <th>Paramater</th>
//                         <th>Value</th>
//                      </tr>
//                   </thead>
//                   <tbody></tbody>
//                </table>
//             </div>

//             <br />

//             <div className="container">
//                <div className="row">
//                   <div className="col-sm-6">
//                      <button
//                         id="parameterEditForm-submit"
//                         className="center_stuff btn btn-primary"
//                      >
//                         <i className="fa fa-check" aria-hidden="true"></i> Save
//                      </button>
//                   </div>
//                   <div className="col-sm-6">
//                      <button
//                         id="parameterEditForm-reset"
//                         className="center_stuff btn btn-danger"
//                      >
//                         <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
//                         Reset
//                      </button>
//                   </div>
//                </div>
//             </div>

//             <div id="parameterEditForm-feedback"></div>
//          </div>

//          <div id="modEditForm" title="Edit Mods">
//             <table id="modEditForm-Table">
//                <thead>
//                   <colgroup>
//                      <col width="50%" />
//                      <col width="50%" />
//                   </colgroup>
//                   <tr>
//                      <th>Mod Name</th>
//                      <th>Applied</th>
//                   </tr>
//                </thead>
//                <tbody id="modEditForm-table-body"></tbody>
//             </table>

//             <br />

//             <div className="container">
//                <div className="row">
//                   <div className="col">
//                      <button
//                         id="modForm-submit"
//                         className="center_stuff btn btn-primary"
//                      >
//                         <i className="fa fa-check" aria-hidden="true"></i> Save
//                      </button>
//                   </div>
//                </div>
//             </div>

//             <div id="modEditForm-feedback"></div>
//          </div>
//       </Form>
//    );
// }

const capitalize = (phrase: string) => {
   return phrase
      ? phrase
           .split(" ")
           .map(
              (word) =>
                 word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
           )
           .join(" ")
      : "";
};

export default ComprehensiveDpsSpreadsheet;
