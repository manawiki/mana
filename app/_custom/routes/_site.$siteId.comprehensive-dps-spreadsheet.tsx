export function ComprehensiveDpsSpreadsheet() {
   return (
      <>
         <Introduction />
         <MoveEditForm />
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

// export function MoveEditForm() {
//   return (
//     <div className="w-full mb-0">
//       <h4 className="bg-white p-8 mt-10 border border-gray-300 rounded-md">Edit Move</h4>
//       <table className="w-full">
//         <thead>
//           <tr>
//             <th className="text-center">Name</th>
//             <th className="text-center">Type</th>
//             <th className="text-center">Category</th>
//             <th className="text-center">Power</th>
//             <th className="text-center">Accuracy</th>
//             <th className="text-center">PP</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="w-full pl-40 bg-repeat text-left inline-block"
//                   style={{ backgroundImage: "url('/icons/pokemon.png')" }}
//                 />
//               </div>
//             </td>
//             <td>
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="w-full pl-40 bg-repeat text-left inline-block"
//                   style={{ backgroundImage: "url('/icons/types.png')" }}
//                 />
//               </div>
//             </td>
//             <td>
//               <select className="w-full">
//                 <option value="physical">Physical</option>
//                 <option value="special">Special</option>
//                 <option value="status">Status</option>
//               </select>
//             </td>
//             <td>
//               <input type="number" className="w-full" />
//             </td>
//             <td>
//               <input type="number" className="w-full" />
//             </td>
//             <td>
//               <input type="number" className="w-full" />
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div className="mt-5">
//         <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//           Save
//         </button>
//       </div>
//     </div>
//   );
//   }
export default ComprehensiveDpsSpreadsheet;
