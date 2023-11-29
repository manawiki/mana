import { useState } from "react";

import { Combobox } from "@headlessui/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { cacheThis } from "~/utils/cache.server";

import { generateSpreadsheet, Context, applyContext } from "./calc.js";
import { GM, Data, requiredJSONStatus } from "./dataFactory.js";

export { ErrorBoundary } from "~/components/ErrorBoundary";

//apply param toggles to update context
function getCustom(params) {
   const context = {};

   if (params["ui-swapDiscount-checkbox"]) {
      context.swapDiscount = true;
   }

   // todo figure out user box
   if (params["ui-use-box-checkbox"]) {
      context.useBox = true;
   }

   // todo add this to filters
   if (params["ui-uniqueSpecies-checkbox"]) {
      context.uniqueSpecies = true;
   }

   // todo rework pvp GM.mode()
   if (params["ui-pvpMode-checkbox"]) {
      context.battleMode = "pvp";
   }

   // todo reimplement this
   if (params["ui-hideUnavail-checkbox"]) {
      context.hideUnavail = true;
   }

   if (params["ui-allyMega-checkbox"]) {
      context.allyMega = true;
   }

   if (params["ui-allyMegaStab-checkbox"]) {
      context.allyMegaStab = true;
   }

   if (params["ui-cpcap"]) {
      context.cpCap = params["ui-cpcap"];
   }

   if (params["attacker-level"]) {
      context.attackerLevel = params["attacker-level"];
   }

   if (params["weather"]) {
      context.weather = params["weather"];
   }

   if (params["enemy-pokemon-name"]) {
      context.enemyPokemon = params["enemy-pokemon-name"];
   }

   if (params["enemy-pokemon-fmove"]) {
      context.enemyPokemonFmove = params["enemy-pokemon-fmove"];
   }

   if (params["enemy-pokemon-cmove"]) {
      context.enemyPokemonCmove = params["enemy-pokemon-cmove"];
   }

   if (params["pokemon-pokeType1"]) {
      context.enemyPokeType1 = params["pokemon-pokeType1"];
   }

   if (params["pokemon-pokeType2"]) {
      context.enemyPokeType2 = params["pokemon-pokeType2"];
   }

   // if (params["searchInput"]) {
   //    context.searchInput = params["searchInput"];
   // }

   return context;
}

// We can move calculation to the server to cache the results
export async function loader({ request }: LoaderFunctionArgs) {
   //get formData from req

   // get url to parse query params
   const url = new URL(request.url);

   // console.log(url.search);

   // get query params from url
   const params = Object.fromEntries(url.searchParams);

   const custom = getCustom(params);

   console.log(requiredJSONStatus);

   // todo redo how Data.Pokemon is generated
   if (!requiredJSONStatus.Pokemon) GM.fetch();

   //to-do add user pokemon
   const pokemon = Data.Pokemon;

   // todo apply context from query params
   const results = await cacheThis(
      async () =>
         generateSpreadsheet(Data.Pokemon, {
            ...Context,
            ...applyContext(custom),
         }),

      "pokemon-dps" + JSON.stringify(custom),
      60 * 60 * 24 * 1000, //cache for 24 hours
      1,
   );

   //to-do read params to toggle sorting
   const sort = params["sort"] ?? "dps";
   const asc = params["asc"] ? 1 : -1;
   const page = params["page"] ? parseInt(params["page"]) : 1;
   const search = params["search"] ?? "";

   console.log(sort, asc, page, search);

   const filtered = await cacheThis(
      async () =>
         results
            .sort((a, b) => (a[sort] > b[sort] ? asc : -1 * asc))
            //limit results to the top 100
            .slice(100 * page - 100, 100 * page),
      "pokemon-dps-filtered-" + sort + asc + page + search,
      60 * 60 * 24 * 1000,
   );

   return json({ pokemon, results: filtered, count: results.length });
}

export function ComprehensiveDpsSpreadsheet() {
   return (
      <>
         <Introduction />
         {/* <MoveEditForm /> */}
         <NewToggle />
         <Toggles />
         <ResultsTable />
      </>
   );
}

export function Introduction() {
   return (
      <div>
         <p>
            This is GamePress's complete list of all Pokemon and all movesets
            and their associated DPS(Damage Per Second) and TDO(Total Damage
            Output).
         </p>
         <p>
            The list is sortable by clicking on the double-ended arrows near the
            name of the categories. Selecting the "Swap Dscnt" checkbox will
            account for the time it takes to swap Pokemon during a raid battle.
            Selecting "My Pokemon" will populate the list with all Pokemon
            uploaded to your GamePress account. Selecting "Best" will show only
            the best moveset for each Pokemon.
         </p>
         <p>
            To specify DPS and TDO for a specific matchup, select the enemy
            Pokemon and weather above the search bar. For a detailed sort, try
            using the search bar, which works much like the in-game search bar.
            Here is the list of search features supported. Some examples:
         </p>
         <table className="table-auto border-collapse border border-gray-400">
            <thead>
               <tr>
                  <th className="px-4 py-2">
                     <center>Search</center>
                  </th>
                  <th className="px-4 py-2">
                     <center>Example</center>
                  </th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td className="border px-4 py-2">Dex Number</td>
                  <td className="border px-4 py-2">1-151</td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">Pokemon Type</td>
                  <td className="border px-4 py-2">
                     normal, normal & flying, normal & none
                  </td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">Move Type</td>
                  <td className="border px-4 py-2">
                     @ghost, @1ghost, @2ghost, @*ghost{" "}
                  </td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">Base Stats</td>
                  <td className="border px-4 py-2">baseatk180-200, cp3000-</td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">Filter by move</td>
                  <td className="border px-4 py-2">
                     @legacy / @exclusive / @stab
                  </td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">Filter out legacy moves</td>
                  <td className="border px-4 py-2">@*current</td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">
                     Filter out Shadow Pokemon
                  </td>
                  <td className="border px-4 py-2">!shadow</td>
               </tr>
               <tr>
                  <td className="border px-4 py-2">
                     View only Pokemon with fast and charged moves that are the
                     same type
                  </td>
                  <td className="border px-4 py-2">@same</td>
               </tr>
            </tbody>
         </table>
      </div>
   );
}

const weathers = [
   { name: "EXTREME", label: "Extreme" },
   { name: "CLEAR", label: "Clear" },
   { name: "FOG", label: "Fog" },
   { name: "CLOUDY", label: "Cloudy" },
   { name: "PARTLY_CLOUDY", label: "Partly Cloudy" },
   { name: "RAINY", label: "Rainy" },
   { name: "SNOW", label: "Snow" },
   { name: "WINDY", label: "Windy" },
];

const pokeTypes = [
   "bug",
   "dark",
   "dragon",
   "electric",
   "fairy",
   "fighting",
   "fire",
   "flying",
   "ghost",
   "grass",
   "ground",
   "ice",
   "normal",
   "poison",
   "psychic",
   "rock",
   "steel",
   "water",
];

const capitalize = (word: string) => {
   return word
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : "";
};

function NewToggle() {
   return (
      <Form method="GET" replace={true} className="w-full">
         <input
            type="checkbox"
            id="ui-swapDiscount-checkbox"
            name="ui-swapDiscount-checkbox"
         />{" "}
         Swap Dscnt
         <input type="submit" value="Submit" />
      </Form>
   );
}

function Toggles() {
   // const { pokemon } = useLoaderData<typeof loader>();

   // console.log(pokemon);

   // We'll set Fast Move and Charged Move options if enemy-pokemon-name is set and matches
   // a pokemon in our list
   // todo probably use Combobox for this https://ui.shadcn.com/docs/components/combobox
   const [enemyPokemon, setEnemyPokemon] = useState({});

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
         className="w-full"
         id="dps-form"
         name="dps-form"
      >
         <label className="row-form-label">Enemy Information</label>
         <div className="w-full grid grid-cols-4">
            <div className="row">
               <div id="enemy-pokemon-name-container" className="col-sm-6">
                  <label className="col-form-label">Species</label>
                  <PokemonComboBox
                     enemyPokemon={enemyPokemon}
                     setEnemyPokemon={setEnemyPokemon}
                  />
                  <input
                     hidden
                     name="enemy-pokemon-name"
                     value={enemyPokemon.name}
                  />
               </div>
               <div id="pokemon-pokeType1-container" className="col-sm-3">
                  <label className="col-form-label">PokeType 1</label>
                  <select
                     id="pokemon-pokeType1"
                     name="pokemon-pokeType1"
                     className="form-control"
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
               <div id="pokemon-pokeType2-container" className="col-sm-3">
                  <label className="col-form-label">PokeType 2</label>
                  <select
                     id="pokemon-pokeType2"
                     name="pokemon-pokeType2"
                     className="form-control"
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
            </div>
            <div className="row">
               <div id="enemy-pokemon-fmove-container" className="col-sm-6">
                  <label className="col-form-label">Fast Move</label>
                  <select
                     id="enemy-pokemon-fmove"
                     name="enemy-pokemon-fmove"
                     className="form-control"
                     placeholder="Fast Move"
                  >
                     <option value="">Select Fast Move</option>
                     {fastMoves.map((move) => (
                        <option key={move} value={move}>
                           {capitalize(move)}
                        </option>
                     ))}
                  </select>
               </div>
               <div id="enemy-pokemon-cmove-container" className="col-sm-6">
                  <label className="col-form-label">Charged Move</label>
                  <select
                     id="enemy-pokemon-cmove"
                     name="enemy-pokemon-cmove"
                     className="form-control"
                     placeholder="Charge Move"
                  >
                     <option value="">Select Charged Move</option>
                     {chargedMoves.map((move) => (
                        <option key={move} value={move}>
                           {capitalize(move)}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
            <div className="row">
               <div className="col-sm-6">
                  <label className="col-form-label">Weather</label>
                  <select id="weather" name="weather" className="form-control">
                     {weathers.map(({ name, label }) => (
                        <option key={name} value={name}>
                           {label}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="col-sm-6">
                  <label className="col-form-label">Controls</label>
                  <div className="sub-menu-container">
                     <button
                        name="customize"
                        className="sub-menu-opener btn btn-primary"
                     >
                        <i className="fa fa-cog" aria-hidden="true"></i>
                        Customize
                     </button>
                     <div className="sub-menu">
                        <button
                           className="player_button"
                           id="moveEditFormOpener"
                           name="moveEditFormOpener"
                        >
                           Move
                        </button>
                        <button
                           className="player_button"
                           id="pokemonEditFormOpener"
                           name="pokemonEditFormOpener"
                        >
                           Species
                        </button>
                        <button
                           className="player_button"
                           id="parameterEditFormOpener"
                           name="parameterEditFormOpener"
                        >
                           Battle Settings
                        </button>
                        <button
                           className="player_button"
                           id="modEditFormOpener"
                           name="modEditFormOpener"
                        >
                           Mods
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full grid grid-cols-4">
            <div className="row">
               <div className="col-sm-6 col-lg-3">
                  <div id="ui-swapDiscount" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Swap Dscnt
                        <input
                           type="checkbox"
                           id="ui-swapDiscount-checkbox"
                           name="ui-swapDiscount-checkbox"
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-lg-3">
                  <div id="ui-use-box" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        My Pokemon
                        <input
                           type="checkbox"
                           id="ui-use-box-checkbox"
                           name="ui-use-box-checkbox"
                           disabled
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-lg-3">
                  <div id="ui-uniqueSpecies" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Best
                        <input
                           type="checkbox"
                           id="ui-uniqueSpecies-checkbox"
                           name="ui-uniqueSpecies-checkbox"
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-lg-3">
                  <select
                     id="attacker-level"
                     className="form-control"
                     defaultValue="40"
                     name="attacker-level"
                  ></select>
               </div>
            </div>
            <div className="row">
               <div className="col-sm-6 col-md-3">
                  <div style={{ width: "100%" }}>
                     <input
                        id="ui-cpcap"
                        type="number"
                        placeholder="CP Cap"
                        className="form-control"
                        name="ui-cpcap"
                     />
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <div id="ui-pvpMode" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        PvP Mode
                        <input
                           type="checkbox"
                           id="ui-pvpMode-checkbox"
                           name="ui-pvpMode-checkbox"
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <div id="ui-hideUnavail" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Hide Unavail
                        <input
                           type="checkbox"
                           id="ui-hideUnavail-checkbox"
                           name="ui-hideUnavail-checkbox"
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <button
                     className="btn btn-success"
                     id="refresher"
                     type="submit"
                     name="refresher"
                  >
                     <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
                     Refresh
                  </button>
               </div>
            </div>
            <div className="row">
               <div className="col-sm-6 col-md-3">
                  <div id="ui-allyMega" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Mega Boost?
                        <input
                           type="checkbox"
                           id="ui-allyMega-checkbox"
                           name="ui-allyMega-checkbox"
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <div
                     id="ui-allyMegaStab"
                     style={{ width: "100%", display: "none" }}
                  >
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Mega Stab?
                        <input
                           type="checkbox"
                           id="ui-allyMegaStab-checkbox"
                           name="ui-allyMegaStab-checkbox"
                        />
                     </label>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full">
            <div className="row">
               <div className="col">
                  <label className="col-form-label">Search</label>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <input
                     id="search"
                     //  onKeyUp={search_trigger}
                     className="w-full"
                     name="search"
                  />
               </div>
            </div>
         </div>
      </Form>
   );
}

//todo figure out what we want to use for table
function ResultsTable() {
   const { count, results } = useLoaderData<typeof loader>();

   return (
      <>
         <Pagination />
         <table>
            <thead>
               <tr>
                  <th>Pokemon</th>
                  <th>Fast Move</th>
                  <th>Charged Move</th>
                  <TH>DPS</TH>
                  <TH>TDO</TH>
                  <TH>ER</TH>
                  <TH>CP</TH>
               </tr>
            </thead>
            <tbody>
               {results.map((pokemon, index) => (
                  <tr key={index}>
                     <td>{pokemon?.label}</td>
                     <td>{pokemon?.fmove?.label}</td>
                     <td>{pokemon?.cmove?.label}</td>
                     <td aria-label={pokemon?.dps}>{pokemon?.ui_dps}</td>
                     <td aria-label={pokemon?.tdo}>{pokemon?.ui_tdo}</td>
                     <td>{pokemon?.ui_overall}</td>
                     <td>{pokemon?.ui_cp}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         {count} results
         <div className="container">
            <div className="row">
               <div className="col-sm-6">
                  <button id="CopyClipboardButton" className="btn btn-info">
                     Copy to Clipboard
                  </button>
               </div>
               <div className="col-sm-6">
                  <button id="CopyCSVButton" className="btn btn-info">
                     Export To CSV
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}

//Make the th clickable to sort
function TH({ children }: { children: string }) {
   const [searchParams, setSearchParams] = useSearchParams();

   const sort = searchParams.get("sort") ?? "dps";
   const asc = searchParams.get("asc");

   const onClick = () => {
      setSearchParams((searchParams) => {
         searchParams.set("sort", children.toString().toLowerCase());

         //reset asc if we're sorting by a different column
         sort !== children.toString().toLowerCase()
            ? searchParams.delete("asc")
            : asc
            ? searchParams.delete("asc")
            : searchParams.set("asc", "true");

         return searchParams;
      });
   };

   return (
      <th className="px-4 py-2">
         <button
            className="flex items-center gap-1 capitalize"
            type="button"
            onClick={onClick}
         >
            {children}
            <Icon
               name={
                  sort !== children.toString().toLowerCase()
                     ? "chevrons-up-down"
                     : asc
                     ? "chevron-up"
                     : "chevron-down"
               }
               size={18}
               className="text-zinc-500"
            />
         </button>
      </th>
   );
}

// Insert a simple pagination component here
function Pagination() {
   const { count } = useLoaderData<typeof loader>();
   const [searchParams, setSearchParams] = useSearchParams();

   const page = parseInt(searchParams.get("page") ?? "1");

   const numPages = Math.ceil(count / 100);

   if (numPages <= 1) return null;

   return (
      <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
         <div className="flex items-center gap-3 text-xs">
            <button
               className="flex items-center gap-1 font-semibold uppercase hover:underline"
               onClick={() =>
                  setSearchParams((searchParams) => {
                     searchParams.set("page", (page - 1).toString());
                     return searchParams;
                  })
               }
               disabled={page === 1}
            >
               <Icon name="chevron-left" size={18} className="text-zinc-500">
                  Prev
               </Icon>
            </button>

            <input
               form="dps-form"
               type="number"
               value={page}
               className="w-16"
               name="page"
               min={1}
               max={numPages}
            />
            {/* <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" /> */}

            <button
               className="flex items-center gap-1 font-semibold uppercase hover:underline"
               onClick={() =>
                  setSearchParams((searchParams) => {
                     searchParams.set("page", (page + 1).toString());
                     return searchParams;
                  })
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
         </div>
      </div>
   );
}

export function PokemonComboBox({ enemyPokemon, setEnemyPokemon }) {
   const { pokemon } = useLoaderData<typeof loader>();

   const [query, setQuery] = useState("");

   // console.log(enemyPokemon);

   const filteredPokemon =
      query === ""
         ? pokemon
         : pokemon.filter((current) => {
              return current.name.includes(query.toLowerCase());
           });

   return (
      <Combobox
         // name="enemy-pokemon-name"
         value={enemyPokemon}
         onChange={setEnemyPokemon}
      >
         <div className="relative h-full w-full focus:outline-none">
            <Combobox.Input
               // className="h-full w-full border-0 laptop:rounded-full p-0 bg-transparent laptop:pl-8 outline-none !ring-transparent"
               displayValue={(item) => capitalize(item?.name) ?? ""}
               placeholder="Species"
               onChange={(e) => setQuery(e.target.value)}
            />
         </div>

         <Combobox.Options
         // className="bg-white dark:bg-dark350 outline-color border shadow-1 border-zinc-100 dark:border-zinc-700 divide-color-sub absolute left-0 z-20 max-h-80 w-full divide-y
         //    overflow-auto shadow-xl outline-1 max-laptop:border-y laptop:mt-2 no-scrollbar laptop:rounded-2xl laptop:outline"
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
                       {capitalize(item?.name) ?? ""}
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

export default ComprehensiveDpsSpreadsheet;
