import { Data, GM } from "./dataFactory.js";

/**
 * @file Comprehensive DPS Calculator
 */

const DEFAULT_ATTACKER_LEVEL = 40;
const DEFAULT_ATTACKER_CPM = 0.7903;
const DEFAULT_ATTACKER_IVs = [15, 15, 15];
const DEFAULT_ENEMY_DPS1 = 900;
const DEFAULT_ENEMY_LEVEL = 40;
const DEFAULT_ENEMY_CPM = 0.7903;
const DEFAULT_ENEMY_IVs = [15, 15, 15];
const DEFAULT_ENEMY_CURRENT_DEFENSE = 160;
const DEFAULT_ENEMY_POKETYPE1 = "none";
const DEFAULT_ENEMY_POKETYPE2 = "none";
const DEFAULT_WEATHER = "EXTREME";
const DEFAULT_TOTAL_ENERGY_GAINED = 400;

// const LeagueCPCap = 0;

// var Context = {
//    weather: DEFAULT_WEATHER,
//    enemy: {},
//    genericEnemy: false,
//    genericEnemyFastMove: false,
//    genericEnemyChargedMove: false,
//    swapDiscount: false,
//    battleMode: "regular",
//    allyMega: false,
//    allyMegaStab: false,
// };

export const Context = {
   weather: DEFAULT_WEATHER,
   enemy: {
      fastMoves: [],
      chargedMoves: [],
      fmove: {},
      cmove: {},
      Atk: null,
      Def: 160,
      Stm: null,
      pokeType1: DEFAULT_ENEMY_POKETYPE1,
      pokeType2: DEFAULT_ENEMY_POKETYPE2,
      fmoves: [],
      cmoves: [],
   },
   genericEnemy: true,
   genericEnemyFastMove: true,
   genericEnemyChargedMove: true,
   swapDiscount: false,
   battleMode: "regular",
   allyMega: false,
   allyMegaStab: false,
   attackerLevel: DEFAULT_ATTACKER_LEVEL,
   attackerCPM: DEFAULT_ATTACKER_CPM,
   LeagueCPCap: 0,
};

//apply param toggles to update context
export function getCustom(params) {
   const context = { ...Context };

   if (params["ui-swapDiscount-checkbox"]) {
      context.swapDiscount = true;
   }

   // todo figure out user box
   if (params["ui-use-box-checkbox"]) {
      context.useBox = true;
   }

   // moved this as table concern
   // if (params["ui-uniqueSpecies-checkbox"]) {
   //    context.uniqueSpecies = true;
   // }

   if (params["ui-pvpMode-checkbox"]) {
      context.battleMode = "pvp";
   }

   // moved this as table concern
   // if (params["ui-hideUnavail-checkbox"]) {
   //    context.hideUnavail = true;
   // }

   if (params["ui-allyMega-checkbox"]) {
      context.allyMega = true;
   }

   if (params["ui-allyMegaStab-checkbox"]) {
      context.allyMegaStab = true;
   }

   //todo broke atm
   if (params["ui-cpcap"]) {
      context.cpCap = parseInt(params["ui-cpcap"]);
   }

   if (params["attacker-level"]) {
      context.attackerLevel = params["attacker-level"];
      context.attackerCPM = GM.get("level", params["attacker-level"]).cpm;
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

   // moved this as a table concern
   // if (params["searchInput"]) {
   //    context.searchInput = params["searchInput"];
   // }

   return context;
}

function damage(dmg_giver, dmg_taker, move, Context) {
   var multipliers = 1;
   if (
      move.pokeType == dmg_giver.pokeType1 ||
      move.pokeType == dmg_giver.pokeType2
   ) {
      if (Context.allyMega && Context.allyMegaStab) {
         multipliers *= GM.get("battle", "sameTypeAttackBonusMultiplierMega");
      } else {
         multipliers *= GM.get("battle", "sameTypeAttackBonusMultiplier");
      }
   }
   if (
      GM.get("battle", "TypeBoostedWeather")[move.pokeType] == Context.weather
   ) {
      multipliers *= GM.get("battle", "weatherAttackBonusMultiplier");
   }
   var Effectiveness = GM.get("battle", "TypeEffectiveness");
   multipliers *= Effectiveness[move.pokeType][dmg_taker.pokeType1] || 1;
   multipliers *= Effectiveness[move.pokeType][dmg_taker.pokeType2] || 1;
   var atk = dmg_giver.Atk;
   if (dmg_giver.name.startsWith("shadow ")) {
      atk *= Data.BattleSettings.shadowPokemonAttackBonusMultiplier;
   }
   if (Context.allyMega) {
      atk *= Data.BattleSettings.megaPokemonStatMultiplier;
   }
   return ((0.5 * atk) / dmg_taker.Def) * move.power * multipliers + 0.5;
}

// https://gamepress.gg/pokemongo/how-calculate-comprehensive-dps
function calculateDPS(pokemon, kwargs) {
   let x = kwargs.x,
      y = kwargs.y;
   if (x == undefined || y == undefined) {
      let intakeProfile = calculateDPSIntake(pokemon, kwargs);
      x = x == undefined ? intakeProfile.x : x;
      y = y == undefined ? intakeProfile.y : y;
   }

   let FDmg = damage(pokemon, kwargs.enemy, pokemon.fmove, kwargs);
   let CDmg = damage(pokemon, kwargs.enemy, pokemon.cmove, kwargs);
   let FE = pokemon.fmove.energyDelta;
   let CE = -pokemon.cmove.energyDelta;

   if (kwargs.battleMode != "pvp") {
      let FDur = pokemon.fmove.duration / 1000;
      let CDur = pokemon.cmove.duration / 1000;
      let CDWS = pokemon.cmove.dws / 1000;

      if (CE >= 100) {
         CE = CE + 0.5 * FE + 0.5 * y * CDWS;
      }

      let FDPS = FDmg / FDur;
      let FEPS = FE / FDur;
      let CDPS = CDmg / CDur;
      let CEPS = CE / CDur;

      pokemon.st = pokemon.Stm / y;
      pokemon.dps =
         (FDPS * CEPS + CDPS * FEPS) / (CEPS + FEPS) +
         ((CDPS - FDPS) / (CEPS + FEPS)) * (1 / 2 - x / pokemon.Stm) * y;
      pokemon.tdo = pokemon.dps * pokemon.st;

      if (pokemon.dps > CDPS) {
         pokemon.dps = CDPS;
         pokemon.tdo = pokemon.dps * pokemon.st;
      } else if (pokemon.dps < FDPS) {
         pokemon.dps = FDPS;
         pokemon.tdo = pokemon.dps * pokemon.st;
      }

      if (kwargs.swapDiscount) {
         pokemon.dps =
            pokemon.dps *
            (pokemon.st /
               (pokemon.st + GM.get("battle", "swapDurationMs") / 1000));
      }
      return pokemon.dps;
   } else {
      let FDur = pokemon.fmove.duration * 0.5;

      let FDPS = FDmg / FDur;
      let FEPS = FE / FDur;

      pokemon.st = pokemon.Stm / y;
      let modFEPS = Math.max(0, FEPS - x / pokemon.st);
      let totalEnergyGained = 3 * pokemon.st * modFEPS;
      let discountFactor = (totalEnergyGained - 2 * CE) / totalEnergyGained;
      if (discountFactor < 0 || discountFactor > 1) {
         discountFactor = 0;
      }
      CDmg = CDmg * discountFactor;
      pokemon.dps = FDPS + (modFEPS * CDmg) / CE;
      pokemon.tdo = pokemon.dps * pokemon.st;
      return pokemon.dps;
   }
}

function calculateDPSIntake(pokemon, kwargs) {
   if (kwargs.genericEnemy) {
      if (kwargs.battleMode == "pvp") {
         return {
            x: -pokemon.cmove.energyDelta * 0.5,
            y: (DEFAULT_ENEMY_DPS1 * 1.5) / pokemon.Def,
         };
      } else {
         return {
            x:
               -pokemon.cmove.energyDelta * 0.5 +
               pokemon.fmove.energyDelta * 0.5,
            y: DEFAULT_ENEMY_DPS1 / pokemon.Def,
         };
      }
   } else if (kwargs.genericEnemyFastMove) {
      let sum_x = 0,
         sum_y = 0,
         num = kwargs.enemy.fmoves.length;
      if (num == 0) {
         kwargs.genericEnemy = true;
         return calculateDPSIntake(pokemon, kwargs);
      }
      kwargs.genericEnemyFastMove = false;
      for (let fmove of kwargs.enemy.fmoves) {
         kwargs.enemy.fmove = fmove;
         let intake = calculateDPSIntake(pokemon, kwargs);
         sum_x += intake.x;
         sum_y += intake.y;
      }
      kwargs.genericEnemyFastMove = true;
      return {
         x: sum_x / num,
         y: sum_y / num,
      };
   } else if (kwargs.genericEnemyChargedMove) {
      let sum_x = 0,
         sum_y = 0,
         num = kwargs.enemy.cmoves.length;
      if (num == 0) {
         kwargs.genericEnemy = true;
         return calculateDPSIntake(pokemon, kwargs);
      }
      kwargs.genericEnemyChargedMove = false;
      for (let cmove of kwargs.enemy.cmoves) {
         kwargs.enemy.cmove = cmove;
         let intake = calculateDPSIntake(pokemon, kwargs);
         sum_x += intake.x;
         sum_y += intake.y;
      }
      kwargs.genericEnemyChargedMove = true;
      return {
         x: sum_x / num,
         y: sum_y / num,
      };
   } else {
      let FDmg = damage(kwargs.enemy, pokemon, kwargs.enemy.fmove, kwargs);
      let CDmg = damage(kwargs.enemy, pokemon, kwargs.enemy.cmove, kwargs);
      let FE = kwargs.enemy.fmove.energyDelta;
      let CE = -kwargs.enemy.cmove.energyDelta;
      if (kwargs.battleMode == "pvp") {
         let FDur = kwargs.enemy.fmove.duration * 0.5;
         return {
            x: 0,
            y: FDmg / (FDur - 2) + ((FE / (FDur - 2)) * CDmg) / CE,
         };
      } else {
         let FDur = kwargs.enemy.fmove.duration / 1000 + 2;
         let CDur = kwargs.enemy.cmove.duration / 1000 + 2;
         let n = Math.max(1, (3 * CE) / 100);
         return {
            x:
               -pokemon.cmove.energyDelta * 0.5 +
               pokemon.fmove.energyDelta * 0.5 +
               (0.5 * (n * FDmg + CDmg)) / (n + 1),
            y: (n * FDmg + CDmg) / (n * FDur + CDur),
         };
      }
   }
}

function calculateCP(pkm) {
   let cpm = parseFloat(pkm.cpm);
   let atk = pkm.Atk || (pkm.baseAtk + pkm.atkiv) * cpm;
   let def = pkm.Def || (pkm.baseDef + pkm.defiv) * cpm;
   let stm = pkm.Stm || (pkm.baseStm + pkm.stmiv) * cpm;
   return Math.max(10, Math.floor((atk * Math.sqrt(def * stm)) / 10));
}

// function DPSCalculatorInit() {
//    GM.fetch({
//       complete: function () {
//          for (let level of Data.LevelSettings) {
//             $("<option/>", {
//                value: level.name,
//             })
//                .html("Lv " + level.name + " Attacker")
//                .appendTo("#attacker-level");
//          }
//          $("#attacker-level").val("40");
//          $("#attacker-level").on("change", function () {
//             DEFAULT_ATTACKER_LEVEL = this.value;
//             DEFAULT_ATTACKER_CPM = GM.get("level", this.value).cpm;
//          });

//          requestSpreadsheet(true);
//          $("#loading-image").hide();
//          $(".pogo-dps-sheet-container").show();
//       },
//    });
//    $(document).ready(function () {
//       if (window.userID2 && window.userID2 != "0") {
//          GM.fetch({
//             name: "user",
//             userid: window.userID2,
//          });
//       }
//    });

//    $("#pokemon-pokeType1").on("change", requestSpreadsheet);
//    $("#pokemon-pokeType2").on("change", requestSpreadsheet);
//    $("#weather").on("change", requestSpreadsheet);

//    $("#ui-swapDiscount").controlgroup();
//    $("#ui-swapDiscount-checkbox").change(function () {
//       Context.swapDiscount = this.checked;
//       requestSpreadsheet(false);
//    });

//    $("#ui-allyMega").controlgroup();
//    $("#ui-allyMega-checkbox").change(function () {
//       Context.allyMega = this.checked;
//       if (Context.allyMega) {
//          $("#ui-allyMegaStab").show();
//       } else {
//          $("#ui-allyMegaStab").hide();
//       }
//       requestSpreadsheet(false);
//    });

//    $("#ui-allyMegaStab").controlgroup();
//    $("#ui-allyMegaStab-checkbox").change(function () {
//       Context.allyMegaStab = this.checked;
//       requestSpreadsheet(false);
//    });

//    $("#ui-use-box").controlgroup();
//    $("#ui-use-box-checkbox").change(function () {
//       requestSpreadsheet(true);
//    });

//    $("#ui-uniqueSpecies").controlgroup();
//    $("#ui-uniqueSpecies-checkbox").change(function () {
//       uniqueSpecies = this.checked;
//       if (uniqueSpecies) {
//          markFirstInstancePerSpecies();
//       }
//       $("#ranking_table").DataTable().draw();
//    });

//    $("#ui-pvpMode").controlgroup();
//    $("#ui-pvpMode-checkbox").change(function () {
//       if (this.checked) {
//          $($("#ranking_table").DataTable().column(5).header()).text(
//             "Activation",
//          );
//          Context.battleMode = "pvp";
//          GM.mode("pvp");
//       } else {
//          $($("#ranking_table").DataTable().column(5).header()).text("ER");
//          Context.battleMode = "regular";
//          GM.mode("raid");
//       }
//       requestSpreadsheet(true);
//    });

//    $("#ui-hideUnavail").controlgroup();
//    $("#ui-hideUnavail").change(function () {
//       requestSpreadsheet(true);
//    });

//    $("#refresher").click(function () {
//       requestSpreadsheet(true);
//    });

//    $("#CopyClipboardButton").click(function () {
//       copyTableToClipboard("ranking_table");
//    });
//    $("#CopyCSVButton").click(function () {
//       exportTableToCSV("ranking_table", "comprehensive_dps.csv");
//    });

//    dropdownMenuInit();
//    moveEditFormInit();
//    pokemonEditFormInit();
//    parameterEditFormInit();
//    modEditFormInit();

//    $.fn.dataTable.Api.register("rows().generate()", function () {
//       return this.iterator("row", function (context, index) {
//          context.oApi._fnCreateTr(context, index);
//       });
//    });

//    var weatherSelect = document.getElementById("weather");
//    GM.each("weather", function (weatherSetting) {
//       weatherSelect.appendChild(
//          createElement("option", weatherSetting.name, {
//             value: weatherSetting.name,
//          }),
//       );
//    });
//    weatherSelect.value = DEFAULT_WEATHER;

//    var enemySpeciesNodeContainer = document.getElementById(
//       "enemy-pokemon-name-container",
//    );
//    var enemyFastMoveNodeContainer = document.getElementById(
//       "enemy-pokemon-fmove-container",
//    );
//    var enemyChargedMoveNodeContainer = document.getElementById(
//       "enemy-pokemon-cmove-container",
//    );

//    var enemySpeciesNode = createPokemonNameInput();
//    enemySpeciesNode.id = "pokemon-name";
//    var enemyFastMoveNode = createPokemonMoveInput("fast");
//    enemyFastMoveNode.id = "pokemon-fmove";
//    var enemyChargedMoveNode = createPokemonMoveInput("charged");
//    enemyChargedMoveNode.id = "pokemon-cmove";

//    enemySpeciesNodeContainer.appendChild(enemySpeciesNode);
//    $(enemySpeciesNode).on("autocompleteselect", function (event, ui) {
//       $("#pokemon-pokeType1").val(ui.item.pokeType1);
//       $("#pokemon-pokeType2").val(ui.item.pokeType2);
//       $.extend(Context.enemy, ui.item);
//       this.blur();
//       requestSpreadsheet(false);
//    });

//    enemyFastMoveNodeContainer.appendChild(enemyFastMoveNode);
//    $(enemyFastMoveNode).on("autocompleteselect", function (event, ui) {
//       if (GM.get("pokemon", enemySpeciesNode.value.toLowerCase()) != null) {
//          this.blur();
//          requestSpreadsheet(false);
//       }
//    });

//    enemyChargedMoveNodeContainer.appendChild(enemyChargedMoveNode);
//    $(enemyChargedMoveNode).on("autocompleteselect", function (event, ui) {
//       if (GM.get("pokemon", enemySpeciesNode.value.toLowerCase()) != null) {
//          this.blur();
//          requestSpreadsheet(false);
//       }
//    });

//    var enemyPokeType1Select = document.getElementById("pokemon-pokeType1");
//    var enemyPokeType2Select = document.getElementById("pokemon-pokeType2");
//    enemyPokeType1Select.appendChild(
//       createElement("option", toTitleCase(DEFAULT_ENEMY_POKETYPE1), {
//          value: DEFAULT_ENEMY_POKETYPE1,
//       }),
//    );
//    enemyPokeType2Select.appendChild(
//       createElement("option", toTitleCase(DEFAULT_ENEMY_POKETYPE2), {
//          value: DEFAULT_ENEMY_POKETYPE2,
//       }),
//    );

//    var Effectiveness = GM.get("battle", "TypeEffectiveness");
//    for (var pokeType in Effectiveness) {
//       enemyPokeType1Select.appendChild(
//          createElement("option", toTitleCase(pokeType), { value: pokeType }),
//       );
//       enemyPokeType2Select.appendChild(
//          createElement("option", toTitleCase(pokeType), { value: pokeType }),
//       );
//    }
//    enemyPokeType1Select.value = DEFAULT_ENEMY_POKETYPE1;
//    enemyPokeType2Select.value = DEFAULT_ENEMY_POKETYPE2;

//    var Table = $("#ranking_table").DataTable({
//       lengthChange: false,
//       autoWidth: false,
//       deferRender: true,
//       columns: [
//          { title: "Pokemon", data: "ui_name", width: "24%" },
//          { title: "Fast Move", data: "ui_fmove", width: "18%" },
//          { title: "Charged Move", data: "ui_cmove", width: "18%" },
//          {
//             title: "DPS",
//             data: "ui_dps",
//             type: "num",
//             width: "10%",
//             orderSequence: ["desc", "asc"],
//          },
//          {
//             title: "TDO",
//             data: "ui_tdo",
//             type: "num",
//             width: "10%",
//             orderSequence: ["desc", "asc"],
//          },
//          {
//             title: "ER",
//             data: "ui_overall",
//             type: "num",
//             width: "10%",
//             orderSequence: ["desc", "asc"],
//          },
//          {
//             title: "CP",
//             data: "ui_cp",
//             type: "num",
//             width: "10%",
//             orderSequence: ["desc", "asc"],
//          },
//       ],
//       scrollX: true,
//    });

//    Table.order([3, "desc"]);
//    $("#ranking_table_filter").hide();
// }

export function getEnemy(custom) {
   let Context = {};

   // apply enemy context
   let enemyPokemon = GM.get("pokemon", custom?.enemyPokemon);
   if (enemyPokemon) {
      Context.genericEnemy = false;
      Context.enemy = { ...enemyPokemon };
   } else {
      Context.enemy = {};
   }

   // Context.genericEnemyFastMove = false;
   let enemyFast = GM.get(
      "fast",
      custom?.enemyPokemonFmove?.trim().toLowerCase(),
   );
   if (enemyFast) {
      Context.enemy.fmove = enemyFast;
      Context.genericEnemyFastMove = false;
   }

   let enemyCharged = GM.get(
      "charged",
      custom.enemyPokemonCmove?.trim().toLowerCase(),
   );
   if (enemyCharged) {
      Context.enemy.cmove = enemyCharged;
      Context.genericEnemyChargedMove = false;
   }

   let enemy_cpm = DEFAULT_ENEMY_CPM;
   Context.enemy.Atk =
      ((enemyPokemon?.baseAtk ?? 0) + DEFAULT_ENEMY_IVs[0]) * enemy_cpm;
   Context.enemy.Def =
      ((enemyPokemon?.baseDef ?? 0) + DEFAULT_ENEMY_IVs[1]) * enemy_cpm;
   Context.enemy.Stm =
      ((enemyPokemon?.baseStm ?? 0) + DEFAULT_ENEMY_IVs[2]) * enemy_cpm;

   if (custom.enemyPokeType1) Context.enemy.pokeType1 = custom.enemyPokeType1;
   if (custom.enemyPokeType2) Context.enemy.pokeType2 = custom.enemyPokeType2;

   Context.enemy.fmoves =
      enemyPokemon?.fastMoves.map((move) => GM.get("fast", move)) ?? [];
   Context.enemy.cmoves =
      enemyPokemon?.chargedMoves.map((move) => GM.get("charged", move)) ?? [];

   if (Context.genericEnemy === undefined) {
      Context.enemy.Def = DEFAULT_ENEMY_CURRENT_DEFENSE;
   }

   if (custom.cpcap) Context.LeagueCPCap = custom.cpcap;

   // console.log("Enemy Context", Context);

   return Context;
}

// export function calculateRow(pkm) {
//    let pkmInstance = { ...pkm };

//    // user Pokemon
//    if (pkm.uid !== undefined) {
//       let species = GM.get("pokemon", pkm.name);
//       if (!species) {
//          //  pkm.level = pkm.level;
//          pkmInstance.cpm = GM.get("level", pkm.level).cpm;
//          pkmInstance.baseAtk = species.baseAtk;
//          pkmInstance.baseDef = species.baseDef;
//          pkmInstance.baseStm = species.baseStm;
//          pkmInstance.icon = species.icon;
//       }
//    }

//    let fastMoves_all = pkm.fmove
//       ? [pkm.fmove]
//       : pkm.fastMoves
//            .concat(pkm.fastMoves_legacy)
//            .concat(pkm.fastMoves_exclusive);

//    let chargedMoves_all = pkm.cmove
//       ? [pkm.cmove]
//       : pkm.chargedMoves
//            .concat(pkm.chargedMoves_legacy)
//            .concat(pkm.chargedMoves_exclusive);

//    for (let fmove of fastMoves_all) {
//       let fmoveInstance = GM.get("fast", fmove);
//       if (!fmoveInstance) {
//          continue;
//       }
//       for (let cmove of chargedMoves_all) {
//          var cmoveInstance = GM.get("charged", cmove);
//          if (!cmoveInstance) {
//             continue;
//          }

//          pkmInstance.fmove = fmoveInstance;
//          pkmInstance.cmove = cmoveInstance;
//          pkmInstance.level = pkm.level || DEFAULT_ATTACKER_LEVEL;
//          pkmInstance.cpm = pkm.cpm || DEFAULT_ATTACKER_CPM;
//          pkmInstance.atkiv =
//             pkm.atkiv >= 0 ? pkm.atkiv : DEFAULT_ATTACKER_IVs[0];
//          pkmInstance.defiv =
//             pkm.defiv >= 0 ? pkm.defiv : DEFAULT_ATTACKER_IVs[1];
//          pkmInstance.stmiv =
//             pkm.stmiv >= 0 ? pkm.stmiv : DEFAULT_ATTACKER_IVs[2];
//          pkmInstance.Atk =
//             (pkmInstance.baseAtk + pkmInstance.atkiv) * pkmInstance.cpm;
//          pkmInstance.Def =
//             (pkmInstance.baseDef + pkmInstance.defiv) * pkmInstance.cpm;
//          pkmInstance.Stm =
//             (pkmInstance.baseStm + pkmInstance.stmiv) * pkmInstance.cpm;
//          pkmInstance.hp = Math.max(10, Math.floor(pkmInstance.Stm));

//          if (LeagueCPCap > 0) {
//             adjustStatsUnderCPCap(pkmInstance, LeagueCPCap);
//          }
//          pkmInstance.cp = calculateCP(pkmInstance);

//          if (pkmInstance.name.startsWith("shadow ")) {
//             pkmInstance.Def *=
//                Data.BattleSettings.shadowPokemonDefenseBonusMultiplier;
//          }

//          calculateDPS(pkmInstance, Context);

//          pkmInstance.ui_name = createIconLabelSpan(
//             pkm.icon,
//             pkm.labelLinked || pkm.label,
//             "species-input-with-icon",
//          );
//          pkmInstance.ui_fmove = createIconLabelSpan(
//             fmoveInstance.icon,
//             fmoveInstance.labelLinked || fmoveInstance.label,
//             "move-input-with-icon",
//          );
//          pkmInstance.ui_cmove = createIconLabelSpan(
//             cmoveInstance.icon,
//             cmoveInstance.labelLinked || cmoveInstance.label,
//             "move-input-with-icon",
//          );
//          pkmInstance.ui_dps = Math.round(pkmInstance.dps, 3);
//          pkmInstance.ui_tdo = Math.round(pkmInstance.tdo, 1);
//          if (Context.battleMode == "pvp") {
//             pkmInstance.ui_overall =
//                Math.ceil(
//                   -pkmInstance.cmove.energyDelta /
//                      (pkmInstance.fmove.energyDelta || 1),
//                ) * pkmInstance.fmove.duration;
//          } else {
//             pkmInstance.ui_overall = Math.round(
//                (pkmInstance.dps ** 3 * pkmInstance.tdo) ** 0.25,
//                2,
//             );
//          }
//          pkmInstance.ui_cp = pkmInstance.cp;
//       }
//    }

//    return pkmInstance;
// }

function createIconLabelSpan(icon, label, className) {
   return (
      <span className={className}>
         <img src={icon} alt={label} />
         {label}
      </span>
   );
}

// export function generateSpreadsheet(pokemonCollection) {
//    return pokemonCollection.map((pkm) => calculateRow(pkm));
// }

export function generateSpreadsheet(pokemonCollection, Context) {
   const Table = [];

   let t1 = Date.now(),
      t2 = t1;
   console.log("Start");

   // applyContext();

   for (let pkm of pokemonCollection) {
      // user Pokemon
      if (pkm.uid !== undefined) {
         let species = GM.get("pokemon", pkm.name);
         if (!species) {
            continue;
         }
         pkm.cpm = GM.get("level", pkm.level).cpm;
         pkm.baseAtk = species.baseAtk;
         pkm.baseDef = species.baseDef;
         pkm.baseStm = species.baseStm;
         pkm.icon = species.icon;
      }

      let fastMoves_all = pkm.fmove
         ? [pkm.fmove]
         : pkm.fastMoves
              .concat(pkm.fastMoves_legacy)
              .concat(pkm.fastMoves_exclusive);
      let chargedMoves_all = pkm.cmove
         ? [pkm.cmove]
         : pkm.chargedMoves
              .concat(pkm.chargedMoves_legacy)
              .concat(pkm.chargedMoves_exclusive);
      for (let fmove of fastMoves_all) {
         var fmoveInstance = GM.get("fast", fmove);
         if (!fmoveInstance) {
            continue;
         }
         for (let cmove of chargedMoves_all) {
            let cmoveInstance = GM.get("charged", cmove);
            if (!cmoveInstance) {
               continue;
            }

            let pkmInstance = { ...pkm };

            pkmInstance.fmove = fmoveInstance;
            pkmInstance.cmove = cmoveInstance;
            pkmInstance.level = pkm.level || Context.attackerLevel;
            pkmInstance.cpm = pkm.cpm || Context.attackerCPM;
            pkmInstance.atkiv =
               pkm.atkiv >= 0 ? pkm.atkiv : DEFAULT_ATTACKER_IVs[0];
            pkmInstance.defiv =
               pkm.defiv >= 0 ? pkm.defiv : DEFAULT_ATTACKER_IVs[1];
            pkmInstance.stmiv =
               pkm.stmiv >= 0 ? pkm.stmiv : DEFAULT_ATTACKER_IVs[2];
            pkmInstance.Atk =
               (pkmInstance.baseAtk + pkmInstance.atkiv) * pkmInstance.cpm;
            pkmInstance.Def =
               (pkmInstance.baseDef + pkmInstance.defiv) * pkmInstance.cpm;
            pkmInstance.Stm =
               (pkmInstance.baseStm + pkmInstance.stmiv) * pkmInstance.cpm;
            pkmInstance.hp = Math.max(10, Math.floor(pkmInstance.Stm));

            if (Context.LeagueCPCap > 0) {
               adjustStatsUnderCPCap(pkmInstance, Context.LeagueCPCap);
            }
            pkmInstance.cp = calculateCP(pkmInstance);

            if (pkmInstance.name.startsWith("shadow ")) {
               pkmInstance.Def *=
                  Data.BattleSettings.shadowPokemonDefenseBonusMultiplier;
            }

            calculateDPS(pkmInstance, Context);

            pkmInstance.ui_name = createIconLabelSpan(
               pkm.icon,
               pkm.labelLinked || pkm.label,
               "species-input-with-icon",
            );
            pkmInstance.ui_fmove = createIconLabelSpan(
               fmoveInstance.icon,
               fmoveInstance.labelLinked || fmoveInstance.label,
               "move-input-with-icon",
            );
            pkmInstance.ui_cmove = createIconLabelSpan(
               cmoveInstance.icon,
               cmoveInstance.labelLinked || cmoveInstance.label,
               "move-input-with-icon",
            );
            pkmInstance.ui_dps = Number(pkmInstance.dps.toFixed(3));
            pkmInstance.ui_tdo = Number(pkmInstance.tdo.toFixed(1));
            if (Context.battleMode == "pvp") {
               pkmInstance.ui_overall = Number(
                  (
                     (-pkmInstance.cmove.energyDelta /
                        (pkmInstance.fmove.energyDelta || 1)) *
                     pkmInstance.fmove.duration
                  ).toFixed(2),
               );
            } else {
               pkmInstance.ui_overall = Number(
                  ((pkmInstance.dps ** 3 * pkmInstance.tdo) ** 0.25).toFixed(2),
               );
            }
            pkmInstance.ui_cp = pkmInstance.cp;

            Table.push(pkmInstance);
         }
      }
   }

   if (EasterEggActiviated) {
      applyEasterEgg(Table);
   }

   t2 = Date.now();
   console.log("Primary Calculation took", t2 - t1, "ms");
   t1 = t2;

   // console.log(Table);

   return Table;
}

// function updateSpreadsheet() {
//    var Table = $("#ranking_table").DataTable();
//    applyContext();
//    var dataLength = Table.data().length;
//    for (var i = 0; i < dataLength; i++) {
//       var pkmInstance = Table.row(i).data();
//       calculateDPS(pkmInstance, Context);
//       pkmInstance.ui_dps = round(pkmInstance.dps, 3);
//       pkmInstance.ui_tdo = round(pkmInstance.tdo, 1);
//       if (Context.battleMode == "pvp") {
//          pkmInstance.ui_overall =
//             Math.ceil(
//                -pkmInstance.cmove.energyDelta /
//                   (pkmInstance.fmove.energyDelta || 1),
//             ) * pkmInstance.fmove.duration;
//       } else {
//          pkmInstance.ui_overall = round(
//             (pkmInstance.dps ** 3 * pkmInstance.tdo) ** 0.25,
//             2,
//          );
//       }
//       Table.row(i).data(pkmInstance);
//    }
//    console.log(Date() + ": All DPS re-calculated");
//    Predicate = $("#searchInput").val()
//       ? PokeQuery($("#searchInput").val())
//       : (arg) => true;
//    $("#ranking_table").DataTable().draw();
// }

// function requestSpreadsheet(startover) {
//    calculationMethod = function () {};

//    uniqueSpecies = false;
//    document.getElementById("ui-uniqueSpecies-checkbox").checked = false;
//    $("#ui-uniqueSpecies-checkbox").button("refresh");

//    if (startover) {
//       var pokebox_checkbox = document.getElementById("ui-use-box-checkbox");
//       if (pokebox_checkbox.checked) {
//          var user = GM.get("user", window.userID2);
//          if (user == null) {
//             UI.sendFeedbackDialog("To use your Pokemon, please log in");
//             pokebox_checkbox.checked = false;
//             $(pokebox_checkbox).button("refresh");
//             return;
//          } else {
//             calculationMethod = function () {
//                generateSpreadsheet(user.box);
//             };
//          }
//       } else {
//          calculationMethod = function () {
//             var pokemon = [];
//             var unavailable_checkbox = document.getElementById(
//                "ui-hideUnavail-checkbox",
//             );
//             if (unavailable_checkbox.checked) {
//                GM.each("pokemon", function (pkm) {
//                   if (pkm.unavailable == "On") {
//                   } else {
//                      pokemon.push(pkm);
//                   }
//                });
//             } else {
//                GM.each("pokemon", function (pkm) {
//                   pokemon.push(pkm);
//                });
//             }
//             console.log(pokemon);
//             generateSpreadsheet(pokemon);
//          };
//       }
//    } else {
//       calculationMethod = updateSpreadsheet;
//    }

//    UI.wait(calculationMethod, { message: "Calculating..." });
// }

// var LastKeyUpTime = 0;
// Predicate = function (obj) {
//    return true;
// };

// function search_trigger() {
//    LastKeyUpTime = Date.now();
//    setTimeout(function () {
//       if (Date.now() - LastKeyUpTime >= 600) {
//          Predicate = $("#searchInput").val()
//             ? PokeQuery($("#searchInput").val())
//             : (arg) => true;
//          $("#ranking_table").DataTable().draw();
//       }
//    }, 600);
// }

// var uniqueSpecies = false;

// function markFirstInstancePerSpecies() {
//    var data = $("#ranking_table")
//       .DataTable()
//       .rows({ search: "applied" })
//       .data();
//    var speciesHasOccured = {};
//    for (var i = 0; i < data.length; i++) {
//       if (!speciesHasOccured[data[i].name]) {
//          data[i].best = true;
//          speciesHasOccured[data[i].name] = true;
//       } else {
//          data[i].best = false;
//       }
//    }
// }

// $.fn.dataTable.ext.search.push(
//    function (settings, searchData, index, rowData, counter) {
//       var selected = true;
//       try {
//          selected = Predicate(rowData) && (!uniqueSpecies || rowData.best);
//       } catch (err) {
//          selected = true;
//       }
//       return selected;
//    },
// );

// var LeagueCPCap = 0;

function adjustStatsUnderCPCap(pkm, cp) {
   let old_cp = calculateCP(pkm);
   if (old_cp > cp) {
      let adjust_ratio = Math.sqrt(cp / old_cp);
      pkm.cpm *= adjust_ratio;
      pkm.Atk *= adjust_ratio;
      pkm.Def *= adjust_ratio;
      pkm.Stm *= adjust_ratio;
   }
}

// function applyCPCap(cap) {
//    LeagueCPCap = cap;
//    requestSpreadsheet(false);
// }

/**
 * Features yet to be released
 */

// Generate a spectrum of DPS
function generateSpectrum(pkm, settings) {
   settings = settings || {};
   var X_min = settings.X_min || 0,
      X_max = settings.X_max || 100,
      X_num = settings.X_num || 100,
      X_step = (X_max - X_min) / X_num;
   var Y_min = settings.Y_min || 0,
      Y_max = settings.Y_max || 1500 / pkm.Def,
      Y_num = settings.Y_num || 100,
      Y_step = (Y_max - Y_min) / Y_num;
   var DPS_spectrum = [];
   for (var x = X_min; x < X_max; x += X_step) {
      var row = [];
      for (var y = Y_min; y < Y_max; y += Y_step) {
         row.push(
            calculateDPS(pkm, {
               x: x,
               y: y,
               enemy: Context.enemy,
               weather: Context.weather,
               swapDiscount: Context.swapDiscount,
            }),
         );
      }
      DPS_spectrum.push(row);
   }
   return DPS_spectrum;
}

// function calculateDPSGrades(maxDPS) {
//    var DT = $("#ranking_table").DataTable();
//    var data = DT.data();
//    for (var i = 0; i < data.length; i++) {
//       var score = data[i].ui_dps / maxDPS;
//       if (score >= 0.97619) {
//          grade = "A";
//       } else if (score >= 0.928571) {
//          grade = "A-";
//       } else if (score >= 0.880952) {
//          grade = "B+";
//       } else if (score >= 0.833333) {
//          grade = "B";
//       } else if (score >= 0.785714) {
//          grade = "B-";
//       } else if (score >= 0.738095) {
//          grade = "C+";
//       } else if (score >= 0.690476) {
//          grade = "C";
//       } else if (score >= 0.642857) {
//          grade = "C-";
//       } else {
//          grade = "X";
//       }
//       data[i].ui_cp = grade;
//    }
//    DT.rows().invalidate();
// }

const d = new Date();
const EasterEggActiviated = d.getMonth() == 3 && d.getDate() == 1;
function applyEasterEgg(dt) {
   dt.row.add({
      ui_name: createIconLabelSpan(
         "/pokemongo/sites/pokemongo/files/2020-03/Ani213MS.png",
         "Shuckle",
         "species-input-with-icon",
      ),
      ui_fmove: "",
      ui_cmove: "",
      ui_dps: Infinity,
      ui_tdo: Infinity,
      ui_overall: Infinity,
      ui_cp: Infinity,
   });

   // dt.row.add({
   // 	ui_name: createIconLabelSpan("/pokemongo/sites/pokemongo/files/2020-03/Ani399MS.png", "Shiny Bidoof", 'species-input-with-icon'),
   // 	ui_fmove: "",
   // 	ui_cmove: "",
   // 	ui_dps: Infinity,
   // 	ui_tdo: Infinity,
   // 	ui_overall: Infinity,
   // 	ui_cp: Infinity
   // });

   // dt.row.add({
   // 	ui_name: createIconLabelSpan("/pokemongo/sites/pokemongo/files/2020-03/Ani132MS.png", "Ditto", 'species-input-with-icon'),
   // 	ui_fmove: "",
   // 	ui_cmove: "",
   // 	ui_dps: Infinity,
   // 	ui_tdo: Infinity,
   // 	ui_overall: Infinity,
   // 	ui_cp: Infinity
   // });

   dt.row.add({
      name: "Pikachu",
      label: "Pikachu",
      nickname: "Pikachu",
      ui_name: createIconLabelSpan(
         "/pokemongo/sites/pokemongo/files/2020-03/Ani015OD.png",
         "Pikachu",
         "species-input-with-icon",
      ),
      ui_fmove: "",
      ui_cmove: "",
      ui_dps: 10,
      ui_tdo: 100,
      ui_overall: 100,
      ui_cp: 1600,
   });
}

export const Component = () => <div>Test</div>;

export default Component;
