import { useState } from "react";

import {
   Combobox,
   ComboboxInput,
   ComboboxOption,
   ComboboxOptions,
   Disclosure,
   DisclosureButton,
   DisclosurePanel,
} from "@headlessui/react";
import type {
   LoaderFunctionArgs,
   MetaFunction,
   SerializeFrom,
} from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import {
   Form,
   json,
   Link,
   useLoaderData,
   useSearchParams,
   useSubmit,
} from "@remix-run/react";
import clsx from "clsx";

import type { Move, Pokemon } from "payload/generated-custom-types";
import { Button } from "~/components/Button";
import { Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Text, TextLink } from "~/components/Text";
import { AdUnit } from "~/routes/_site+/_components/RampUnit";
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
         // console.log("cache found!", simpleCache.serverData);
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

   // console.log(url);

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

      // console.log("cached", simpleCache);

      return result;
   }

   const key = url.search || "default";
   const results = simpleCache[key] ? simpleCache[key] : cacheResult(key);

   //apply table filters
   const filtered = filterResults(results, url.searchParams);

   // console.log(filtered);

   // console.log(pokemon);

   // console.log(simpleCache);

   return {
      pokemon,
      results: filtered,
      count: filtered?.length,
   };
}
export const meta: MetaFunction<typeof loader> = ({ data }) => [
   {
      title: "Comprehensive DPS/TDO Spreadsheet | Pokemon GO Wiki - GamePress",
      Description:
         "Complete list of all Pokemon and all movesets and their associated DPS and TDO",
   },
];

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
         <AdUnit
            enableAds={true}
            adType={{
               desktop: "leaderboard_atf",
               tablet: "leaderboard_atf",
               mobile: "med_rect_atf",
            }}
            className="my-8 mx-auto flex items-center justify-center"
            selectorId="dpsCalcDesktopLeaderATF"
         />
         <ResultsTable />
      </div>
   );
}

export function Introduction() {
   return (
      <div className="pt-5">
         <section className="pb-5 space-y-4">
            <Text>
               This is GamePress's complete list of all Pokemon and all movesets
               and their associated {""}
               <TextLink
                  target="_blank"
                  href="https://pogo.gamepress.gg/how-calculate-comprehensive-dps"
               >
                  DPS (Damage Per Second) and TDO (Total Damage Output)
               </TextLink>
            </Text>
            <Text>
               The list is sortable by clicking on the double-ended arrows near
               the name of the categories. Selecting the "Swap Dscnt" checkbox
               will account for the time it takes to swap Pokemon during a raid
               battle. Selecting "Best" will show only the best moveset for each
               Pokemon.
            </Text>
            <Text>
               To specify DPS and TDO for a specific matchup, select the enemy
               Pokemon and weather above the search bar. For a detailed sort,
               try using the search bar, which works much like the in-game
               search bar.{" "}
               <TextLink
                  target="_blank"
                  href="https://github.com/biowpn/GoBattleSim/blob/master/doc/PokeQuery.md"
               >
                  Here
               </TextLink>{" "}
               is the list of search features supported.
            </Text>
         </section>
         <Disclosure defaultOpen>
            {({ open }) => (
               <>
                  <DisclosureButton
                     className={clsx(
                        open ? "rounded-b-none " : "mb-2.5 shadow-sm",
                        "shadow-1 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border px-2 py-3",
                     )}
                  >
                     <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border bg-white shadow-sm shadow-zinc-200  dark:border-zinc-600/30 dark:bg-dark450 dark:shadow-zinc-800">
                        <Icon
                           name="chevron-right"
                           className={clsx(
                              open ? "rotate-90" : "",
                              "transform pl-0.5 transition duration-300 ease-in-out",
                           )}
                           size={16}
                        />
                     </div>
                     <div className="flex-grow text-left text-[15px] font-bold">
                        PokeQuery Examples...
                     </div>
                  </DisclosureButton>
                  <DisclosurePanel
                     unmount={false}
                     className={clsx(
                        open ? "mb-3 border-t" : "",
                        "border-color-sub shadow-1 bg-3 rounded-b-lg border border-t-0 text-sm shadow-sm",
                     )}
                  >
                     <div className="divide-y divide-color-sub">
                        <div className="flex justify-between px-6 py-3">
                           <span className="font-bold ">Search</span>
                           <span className="font-semibold ">Example</span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">Dex Number</span>
                           <span className="text-1 float-right">1-151</span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">Pokemon Type</span>
                           <span className="text-1 float-right">
                              normal, normal & flying, normal & none
                           </span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">Move Type</span>
                           <span className="text-1 float-right">
                              @ghost, @1ghost, @2ghost, *@ghost
                           </span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">Base Stats</span>
                           <span className="text-1 float-right">
                              baseatk180-200, cp3000-
                           </span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">Filter by move</span>
                           <span className="text-1 float-right">
                              @legacy / @exclusive / @stab
                           </span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">
                              Filter out legacy moves
                           </span>
                           <span className="text-1 float-right">@*current</span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="font-bold">
                              Filter out Shadow Pokemon
                           </span>
                           <span className="text-1 float-right">!shadow</span>
                        </div>
                        <div className="px-6 py-3">
                           <span className="">
                              View only Pokemon with fast and charged moves that
                              are the same type
                           </span>
                           <span className="text-1 float-right">@same</span>
                        </div>
                     </div>
                     <p className="py-3 px-6 border-t border-color-sub text-1">
                        These searches can be combined with the '&' symbol to
                        create a pinpointed reference for DPS and TDO.
                     </p>
                  </DisclosurePanel>
               </>
            )}
         </Disclosure>
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
      <Disclosure defaultOpen>
         {({ open }) => (
            <>
               <DisclosureButton
                  className={clsx(
                     open ? "rounded-b-none " : "mb-5 shadow-sm",
                     "shadow-1 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border px-2 py-3 mt-3",
                  )}
               >
                  <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border bg-white shadow-sm shadow-zinc-200  dark:border-zinc-600/30 dark:bg-dark450 dark:shadow-zinc-800">
                     <Icon
                        name="chevron-right"
                        className={clsx(
                           open ? "rotate-90" : "",
                           "transform pl-0.5 transition duration-300 ease-in-out",
                        )}
                        size={16}
                     />
                  </div>
                  <div className="flex-grow text-left text-[15px] font-bold">
                     Enemy Information
                  </div>
               </DisclosureButton>
               <DisclosurePanel
                  unmount={false}
                  className={clsx(
                     open ? "mb-5 border-t" : "",
                     "border-color-sub shadow-1 bg-3 rounded-b-lg border border-t-0 text-sm shadow-sm pb-1",
                  )}
               >
                  <Form
                     method="GET"
                     replace={true}
                     id="dps-form"
                     name="dps-form"
                     preventScrollReset={true}
                     onChange={(e) => {
                        console.log(e.currentTarge);
                        submit(e.currentTarget, {
                           method: "GET",
                           preventScrollReset: true,
                        });
                     }}
                  >
                     <div className="laptop:grid laptop:grid-cols-3 max-laptop:space-y-4 gap-4 p-3">
                        <div className="space-y-3">
                           <div className="mb-4">
                              <label
                                 className="pb-1 block text-sm"
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
                              <Select
                                 id="enemy-pokemon-fmove"
                                 name="enemy-pokemon-fmove"
                              >
                                 {fastMoves.map((move) => (
                                    <option key={move} value={move}>
                                       {capitalize(move.replace(/-/g, " "))}
                                    </option>
                                 ))}
                              </Select>
                           </div>
                           <div className="mb-4">
                              <label
                                 className="block text-sm font-medium mb-1"
                                 htmlFor="weather"
                              >
                                 Weather
                              </label>
                              <Select id="weather" name="weather">
                                 {weathers.map(({ name, label }) => (
                                    <option key={name} value={name}>
                                       {label}
                                    </option>
                                 ))}
                              </Select>
                           </div>
                           <Input
                              id="ui-cpcap"
                              type="number"
                              placeholder="CP Cap"
                              name="ui-cpcap"
                           />
                           <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                              <label
                                 className="flex-grow text-sm"
                                 htmlFor="ui-swapDiscount-checkbox"
                              >
                                 Swap Dscnt
                              </label>
                              <input
                                 type="checkbox"
                                 id="ui-swapDiscount-checkbox"
                                 name="ui-swapDiscount-checkbox"
                              />
                           </div>
                           <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                              <label
                                 className="flex-grow text-sm"
                                 htmlFor="ui-allyMega-checkbox"
                              >
                                 Mega Boost?
                              </label>
                              <input
                                 type="checkbox"
                                 name="ui-allyMega-checkbox"
                                 id="ui-allyMega-checkbox"
                              />
                           </div>
                           <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                              <label
                                 className="flex-grow text-sm"
                                 htmlFor="ui-allyMegaStab-checkbox"
                              >
                                 Mega Stab?
                              </label>
                              <input
                                 type="checkbox"
                                 id="ui-allyMegaStab-checkbox"
                                 name="ui-allyMegaStab-checkbox"
                              />
                           </div>
                        </div>
                        <div>
                           <label
                              htmlFor="pokemon-pokeType1"
                              className="block text-sm font-medium mb-1"
                           >
                              PokeType 1
                           </label>
                           <Select
                              className="mb-4"
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
                           </Select>
                           <label
                              htmlFor="pokemon-pokeType2"
                              className="block text-sm font-medium mb-1"
                           >
                              PokeType 2
                           </label>
                           <div className="mb-4">
                              <Select
                                 id="pokemon-pokeType2"
                                 name="pokemon-pokeType2"
                              >
                                 <option value="none">None</option>
                                 {pokeTypes.map((type) => (
                                    <option
                                       key={type}
                                       value={type}
                                       selected={
                                          enemyPokemon?.pokeType2 === type
                                       }
                                    >
                                       {capitalize(type)}
                                    </option>
                                 ))}
                              </Select>
                           </div>
                           <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="enemy-pokemon-cmove"
                           >
                              Charged Move
                           </label>
                           <Select
                              className="mb-4"
                              id="enemy-pokemon-cmove"
                              name="enemy-pokemon-cmove"
                           >
                              {chargedMoves.map((move) => (
                                 <option key={move} value={move}>
                                    {capitalize(move.replace(/-/g, " "))}
                                 </option>
                              ))}
                           </Select>
                           {/* <Button color="blue" disabled>
                              Customize
                           </Button> */}
                        </div>
                        <div>
                           <div className="font-semibold text-sm mb-2">
                              Controls
                           </div>
                           <div className="space-y-2 pb-4">
                              <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                                 <label
                                    className="flex-grow text-sm"
                                    htmlFor="ui-use-box-checkbox"
                                 >
                                    My Pokemon
                                 </label>
                                 <input
                                    type="checkbox"
                                    id="ui-use-box-checkbox"
                                    name="ui-use-box-checkbox"
                                 />
                              </div>
                              <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                                 <label
                                    className="flex-grow text-sm"
                                    htmlFor="ui-pvpMode-checkbox"
                                 >
                                    PvP Mode
                                 </label>
                                 <input
                                    type="checkbox"
                                    id="ui-pvpMode-checkbox"
                                    name="ui-pvpMode-checkbox"
                                 />
                              </div>
                              <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                                 <label
                                    className="flex-grow text-sm"
                                    htmlFor="ui-uniqueSpecies-checkbox"
                                 >
                                    Best{" "}
                                 </label>
                                 <input
                                    type="checkbox"
                                    id="ui-uniqueSpecies-checkbox"
                                    name="ui-uniqueSpecies-checkbox"
                                 />
                              </div>
                              <div className="flex items-center gap-3 px-3 py-2 bg-3-sub border border-zinc-200 dark:border-zinc-600/70 rounded-lg shadow-sm shadow-1">
                                 <label
                                    className="flex-grow text-sm"
                                    htmlFor="ui-hideUnavail-checkbox"
                                 >
                                    Hide Unavail
                                 </label>
                                 <input
                                    type="checkbox"
                                    id="ui-hideUnavail-checkbox"
                                    name="ui-hideUnavail-checkbox"
                                 />
                              </div>
                           </div>
                           <Field className="pb-5">
                              <Label>Attacker Level</Label>
                              <Input
                                 id="attacker-level"
                                 name="attacker-level"
                                 placeholder="40"
                                 type="number"
                                 min={1}
                                 max={51}
                                 step={0.5}
                              />
                           </Field>
                           <Button
                              color="green"
                              id="refresher"
                              type="submit"
                              name="refresher"
                           >
                              <Icon
                                 name="refresh-ccw"
                                 className="text-green-50"
                                 size={14}
                              />
                              Refresh
                           </Button>
                        </div>
                     </div>
                  </Form>
               </DisclosurePanel>
            </>
         )}
      </Disclosure>
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
         <div className="flex items-center justify-between gap-3 pb-3">
            {/* <div>
               Displaying <span className="font-bold">{start + 1}</span> to{" "}
               {end} of {count} results
            </div> */}
            <Search />
            <Pagination count={count} />
         </div>
         <Table dense grid framed>
            <TableHead>
               <TableRow>
                  <TableHeader center>Pokemon</TableHeader>
                  <TableHeader center>Fast Move</TableHeader>
                  <TableHeader center>Charged Move</TableHeader>
                  <TH>DPS</TH>
                  <TH>TDO</TH>
                  <TH>ER</TH>
                  <TH>CP</TH>
               </TableRow>
            </TableHead>
            <TableBody>
               {filtered.map((pokemon, index) => (
                  <TableRow key={index} className="group">
                     <TableCell>
                        <Link
                           to={pokemon.link}
                           className="text-xs flex flex-col items-center gap-1"
                        >
                           <Image
                              url={pokemon.icon}
                              width="72"
                              height="72"
                              className="size-8 flex-none"
                              aria-label={pokemon.label}
                              loading="lazy"
                           />
                           <div className="font-semibold">{pokemon?.label}</div>
                        </Link>
                     </TableCell>
                     <TableCell>
                        <Link
                           to={pokemon.fmove.link}
                           className="text-xs flex flex-col items-center gap-1"
                        >
                           <Image
                              url={pokemon?.fmove?.icon}
                              width="28"
                              height="28"
                              className="size-5 flex-none"
                              aria-label={pokemon?.fmove?.label}
                              loading="lazy"
                           />
                           <div>{pokemon?.fmove?.label}</div>
                        </Link>
                     </TableCell>
                     <TableCell>
                        <Link
                           to={pokemon.cmove.link}
                           className="text-xs flex flex-col items-center gap-1"
                        >
                           <Image
                              url={pokemon?.cmove?.icon}
                              width="28"
                              height="28"
                              className="size-5 flex-none"
                              aria-label={pokemon?.cmove?.label}
                              loading="lazy"
                           />
                           <div>{pokemon?.cmove?.label}</div>
                        </Link>
                     </TableCell>
                     <TableCell center aria-label={pokemon?.dps}>
                        {pokemon?.ui_dps}
                     </TableCell>
                     <TableCell center aria-label={pokemon?.tdo}>
                        {pokemon?.ui_tdo}
                     </TableCell>
                     <TableCell center>{pokemon?.ui_overall}</TableCell>
                     <TableCell center>{pokemon?.ui_cp}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
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

   // implement search
   const search = searchParams.get("search");

   if (search) {
      filtered = filtered.filter(PokeQuery(search));
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
      <TableHeader center>
         <button
            className="inline-flex mx-auto gap-1 capitalize justify-center items-center"
            type="button"
            onClick={onClick}
         >
            {children}
            <Icon
               name={
                  sort !== children.toString()
                     ? "chevrons-up-down"
                     : asc
                       ? "chevron-up"
                       : "chevron-down"
               }
               size={16}
               className="text-zinc-500"
            />
         </button>
      </TableHeader>
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
      <div className="flex items-center gap-2">
         {page > 1 && (
            <Button
               className="!py-3 tablet:!py-2"
               color="light/zinc"
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
               <Icon name="chevron-left" size={18} />
            </Button>
         )}
         <Input
            form="dps-form"
            type="number"
            key={"page " + page}
            defaultValue={page}
            className="!w-16"
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
         <Button
            className="!py-3 tablet:!py-2"
            color="light/zinc"
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
            <Icon name="chevron-right" title="Next" size={18} />
         </Button>
      </div>
   );
}

function Search() {
   const [searchParams, setSearchParams] = useSearchParams();

   return (
      <Input
         id="search"
         //  onKeyUp={search_trigger}
         className="w-full"
         name="search"
         form="dps-form"
         placeholder="Enter a filter query..."
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
         // todo make this auto submit
         onChange={setEnemyPokemon}
         // virtual={{ options: filteredPokemon }}
      >
         <ComboboxInput
            className="dark:bg-dark450 border dark:border-zinc-600 w-full rounded-lg p-2"
            displayValue={(item) => capitalize(item?.name) ?? ""}
            placeholder="Species"
            onChange={(e) => setQuery(e.target.value)}
         />

         <ComboboxOptions
            anchor="bottom"
            transition
            className={clsx(
               "w-[var(--input-width)] rounded-xl border border-white/5 bg-2-sub p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
               "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
            )}
            // todo fix css
            // className="bg-white dark:bg-dark350 outline-color border shadow-1 border-zinc-100 dark:border-zinc-700 divide-color-sub absolute left-0 z-20 max-h-80 w-full divide-y
            // overflow-auto shadow-xl outline-1 max-laptop:border-y laptop:mt-2 no-scrollbar laptop:rounded-2xl laptop:outline"
         >
            {filteredPokemon.length === 0
               ? query && (
                    <div className="text-1 p-3 text-sm">No results...</div>
                 )
               : filteredPokemon?.map((item) => (
                    <ComboboxOption
                       className={({ active }) =>
                          `relative cursor-default select-none ${
                             active ? "bg-zinc-100 dark:bg-dark400" : "text-1"
                          }`
                       }
                       key={item?.name}
                       value={item}
                    >
                       {item?.name}
                    </ComboboxOption>
                 ))}
         </ComboboxOptions>
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
