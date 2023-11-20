import { generateSpreadsheet } from "./calc.js";
import { GM, Data } from "./dataFactory.js";
export { ErrorBoundary } from "~/components/ErrorBoundary";

export function ComprehensiveDpsSpreadsheet() {
   const pokemon = [];
   GM.fetch();
   GM.each("pokemon", function (pkm) {
      pokemon.push(pkm);
   });

   console.log(pokemon);

   const results = generateSpreadsheet(pokemon);

   console.log(results);

   return (
      <>
         <Introduction />
         {/* <MoveEditForm /> */}
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

function MoveEditForm() {
   return (
      <div className="flex">
         <div id="moveEditForm" title="Add/Edit Move">
            <table id="moveEditForm-table">
               <tr>
                  <th>Scope</th>
                  <td>
                     <select name="move-scope">
                        <option value="regular">Regular (PvE)</option>
                        <option value="combat">Combat (PvP)</option>
                     </select>
                  </td>
               </tr>
               <tr>
                  <th>Category</th>
                  <td>
                     <select name="move-moveType">
                        <option value="fast">Fast</option>
                        <option value="charged">Charged</option>
                     </select>
                  </td>
               </tr>
               <tr>
                  <th>Name</th>
                  <td>
                     <input
                        type="text"
                        name="move-name"
                        className="input-with-icon move-input-with-icon"
                     />
                  </td>
               </tr>
               <tr>
                  <th>Typing</th>
                  <td>
                     <select name="move-pokeType"></select>
                  </td>
               </tr>
               <tr>
                  <th>Power</th>
                  <td>
                     <input type="number" name="move-power" />
                  </td>
               </tr>
               <tr>
                  <th>EnergyDelta</th>
                  <td>
                     <input type="number" name="move-energyDelta" />
                  </td>
               </tr>
               <tr>
                  <th>Duration (in miliseconds)</th>
                  <td>
                     <input type="number" name="move-duration" />
                  </td>
               </tr>
               <tr>
                  <th>Damage Window (in miliseconds)</th>
                  <td>
                     <input type="number" name="move-dws" />
                  </td>
               </tr>
               <tr>
                  <th>Effect</th>
                  <td>
                     <input name="move-effect" />
                  </td>
               </tr>
            </table>
            <br />

            <div className="container">
               <div className="row">
                  <div className="col-sm-6">
                     <button
                        id="moveEditForm-submit"
                        className="center_stuff btn btn-primary"
                     >
                        <i className="fa fa-check" aria-hidden="true"></i> Save
                     </button>
                  </div>
                  <div className="col-sm-3">
                     <button
                        id="moveEditForm-delete"
                        className="center_stuff btn btn-warning"
                     >
                        <i className="fa fa-trash" aria-hidden="true"></i>{" "}
                        Delete
                     </button>
                  </div>
                  <div className="col-sm-3">
                     <button
                        id="moveEditForm-reset"
                        className="center_stuff btn btn-danger"
                     >
                        <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
                        Reset
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div id="pokemonEditForm" title="Add/Edit Pokemon">
            <table id="pokemonEditForm-table">
               <tr>
                  <th>Pokemon Name</th>
                  <td>
                     <input
                        type="text"
                        name="pokemon-name"
                        className="input-with-icon species-input-with-icon"
                     />
                  </td>
               </tr>
               <tr>
                  <th>Pokemon Typing 1</th>
                  <td>
                     <select name="pokemon-pokeType1"></select>
                  </td>
               </tr>
               <tr>
                  <th>Pokemon Typing 2</th>
                  <td>
                     <select name="pokemon-pokeType2"></select>
                  </td>
               </tr>
               <tr>
                  <th>Base Attack</th>
                  <td>
                     <input type="number" name="pokemon-baseAtk" />
                  </td>
               </tr>
               <tr>
                  <th>Base Defense</th>
                  <td>
                     <input type="number" name="pokemon-baseDef" />
                  </td>
               </tr>
               <tr>
                  <th>Base Stamina</th>
                  <td>
                     <input type="number" name="pokemon-baseStm" />
                  </td>
               </tr>
               <tr>
                  <th>Fast Move Pool</th>
                  <td>
                     <input type="text" name="pokemon-fmoves" />
                  </td>
               </tr>
               <tr>
                  <th>Charged Move Pool</th>
                  <td>
                     <input type="text" name="pokemon-cmoves" />
                  </td>
               </tr>
            </table>
            <br />

            <div className="container">
               <div className="row">
                  <div className="col-sm-6">
                     <button
                        id="pokemonEditForm-submit"
                        className="center_stuff btn btn-primary"
                     >
                        <i className="fa fa-check" aria-hidden="true"></i> Save
                     </button>
                  </div>
                  <div className="col-sm-3">
                     <button
                        id="pokemonEditForm-delete"
                        className="center_stuff btn btn-warning"
                     >
                        <i className="fa fa-trash" aria-hidden="true"></i>{" "}
                        Delete
                     </button>
                  </div>
                  <div className="col-sm-3">
                     <button
                        id="pokemonEditForm-reset"
                        className="center_stuff btn btn-danger"
                     >
                        <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
                        Reset
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div id="parameterEditForm" title="Edit Battle Settings">
            <div
               style={{
                  display: "inline-block",
                  overflowY: "scroll",
                  maxHeight: "40vh",
                  width: "100%",
               }}
            >
               <table id="parameterEditForm-Table">
                  <thead>
                     <tr>
                        <th>Paramater</th>
                        <th>Value</th>
                     </tr>
                  </thead>
                  <tbody></tbody>
               </table>
            </div>

            <br />

            <div className="container">
               <div className="row">
                  <div className="col-sm-6">
                     <button
                        id="parameterEditForm-submit"
                        className="center_stuff btn btn-primary"
                     >
                        <i className="fa fa-check" aria-hidden="true"></i> Save
                     </button>
                  </div>
                  <div className="col-sm-6">
                     <button
                        id="parameterEditForm-reset"
                        className="center_stuff btn btn-danger"
                     >
                        <i className="fa fa-refresh" aria-hidden="true"></i>{" "}
                        Reset
                     </button>
                  </div>
               </div>
            </div>

            <div id="parameterEditForm-feedback"></div>
         </div>

         <div id="modEditForm" title="Edit Mods">
            <table id="modEditForm-Table">
               <thead>
                  <colgroup>
                     <col width="50%" />
                     <col width="50%" />
                  </colgroup>
                  <tr>
                     <th>Mod Name</th>
                     <th>Applied</th>
                  </tr>
               </thead>
               <tbody id="modEditForm-table-body"></tbody>
            </table>

            <br />

            <div className="container">
               <div className="row">
                  <div className="col">
                     <button
                        id="modForm-submit"
                        className="center_stuff btn btn-primary"
                     >
                        <i className="fa fa-check" aria-hidden="true"></i> Save
                     </button>
                  </div>
               </div>
            </div>

            <div id="modEditForm-feedback"></div>
         </div>
      </div>
   );
}

function ResultsTable() {
   return (
      <div className="flex pogo-dps-sheet-container">
         <div className="container form-group">
            <label className="row-form-label">Enemy Information</label>
            <div className="row">
               <div id="enemy-pokemon-name-container" className="col-sm-6">
                  <label className="col-form-label">Species</label>
               </div>
               <div id="pokemon-pokeType1-container" className="col-sm-3">
                  <label className="col-form-label">PokeType 1</label>
                  <select
                     name="pokemon-pokeType1"
                     id="pokemon-pokeType1"
                     className="form-control"
                  ></select>
               </div>
               <div id="pokemon-pokeType2-container" className="col-sm-3">
                  <label className="col-form-label">PokeType 2</label>
                  <select
                     name="pokemon-pokeType2"
                     id="pokemon-pokeType2"
                     className="form-control"
                  ></select>
               </div>
            </div>
            <div className="row">
               <div id="enemy-pokemon-fmove-container" className="col-sm-6">
                  <label className="col-form-label">Fast Move</label>
               </div>
               <div id="enemy-pokemon-cmove-container" className="col-sm-6">
                  <label className="col-form-label">Charged Move</label>
               </div>
            </div>
            <div className="row">
               <div className="col-sm-6">
                  <label className="col-form-label">Weather</label>
                  <select id="weather" className="form-control"></select>
               </div>
               <div className="col-sm-6">
                  <label className="col-form-label">Controls</label>
                  <div className="sub-menu-container">
                     <button className="sub-menu-opener btn btn-primary">
                        <i className="fa fa-cog" aria-hidden="true"></i>
                        Customize
                     </button>
                     <div className="sub-menu">
                        <button
                           className="player_button"
                           id="moveEditFormOpener"
                        >
                           Move
                        </button>
                        <button
                           className="player_button"
                           id="pokemonEditFormOpener"
                        >
                           Species
                        </button>
                        <button
                           className="player_button"
                           id="parameterEditFormOpener"
                        >
                           Battle Settings
                        </button>
                        <button
                           className="player_button"
                           id="modEditFormOpener"
                        >
                           Mods
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="container form-group">
            <div className="row">
               <div className="col-sm-6 col-lg-3">
                  <div id="ui-swapDiscount" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Swap Dscnt
                        <input type="checkbox" id="ui-swapDiscount-checkbox" />
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
                           disabled
                        />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-lg-3">
                  <div id="ui-uniqueSpecies" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Best
                        <input type="checkbox" id="ui-uniqueSpecies-checkbox" />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-lg-3">
                  <select
                     id="attacker-level"
                     className="form-control"
                     value="40"
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
                     />
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <div id="ui-pvpMode" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        PvP Mode
                        <input type="checkbox" id="ui-pvpMode-checkbox" />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <div id="ui-hideUnavail" style={{ width: "100%" }}>
                     <label style={{ width: "100%", fontSize: "16px" }}>
                        Hide Unavail
                        <input type="checkbox" id="ui-hideUnavail-checkbox" />
                     </label>
                  </div>
               </div>
               <div className="col-sm-6 col-md-3">
                  <button className="btn btn-success" id="refresher">
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
                        <input type="checkbox" id="ui-allyMega-checkbox" />
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
                        <input type="checkbox" id="ui-allyMegaStab-checkbox" />
                     </label>
                  </div>
               </div>
            </div>
         </div>
         <div className="container">
            <div className="row">
               <div className="col">
                  <label className="col-form-label">Search</label>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <input
                     id="searchInput"
                     //  onKeyUp={search_trigger}
                     className="form-control"
                  />
               </div>
            </div>
         </div>
         <table id="ranking_table" style={{ width: "100%" }}>
            <thead></thead>
            <tfoot></tfoot>
            <tbody></tbody>
         </table>
         <br />
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
      </div>
   );
}

export default ComprehensiveDpsSpreadsheet;
