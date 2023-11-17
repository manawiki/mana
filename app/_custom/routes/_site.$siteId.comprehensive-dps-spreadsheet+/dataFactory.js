import cpmData from "./cpm.json";
import moveData from "./move-data-full-PoGO.json";
import PokemonForms from "./pogo_data_projection_10.json";
import pokemonData from "./pokemon-data-full-en-PoGO.json";
import raidBossList from "./raid-boss-list-PoGO.json";

/**
 * Data Factory. This module manages the game data such as Pokemon stats, Move stats, and type effectiveness matrix. It is basically an extended Game Master.
 * @exports GM
 */

export var GM = {};

/**
 * Fetch all required JSONs for the application.
 * @param kwargs {Object} Keyword arguments. Can specify 'name', 'complete', 'userid'
 */
GM.fetch = function (kwargs) {
   kwargs = kwargs || {};
   if (kwargs.name != undefined) {
      let dbname = kwargs.name.toLowerCase();
      if (dbname == "pokemon") {
         return fetchPokemon(kwargs.complete);
      } else if (dbname == "move" || dbname == "moves") {
         return fetchMoves(kwargs.complete);
      } else if (dbname == "user") {
         return fetchUser(kwargs.complete, kwargs.userid);
      }
   }

   fetchLocalData();

   function oncompleteWrapper() {
      for (var json_name in requiredJSONStatus) {
         if (requiredJSONStatus[json_name] != 2) return;
      }
      attachRaidbossInfo();
      for (let pkm of Data.PokemonForms) {
         var pkm2 = getEntry(pkm.name, Data.Pokemon);
         if (pkm2) {
            pkm2.icon = pkm.icon;
         } else {
            pkm = JSON.parse(JSON.stringify(pkm));
            pkm.fastMoves = [];
            pkm.chargedMoves = [];
            insertEntry(pkm, Data.Pokemon);
         }
      }
      for (let user of Data.Users) {
         user.box = parseUserPokebox(user.box);
      }

      for (let pokemon of LocalData.Pokemon) {
         insertEntry(pokemon, Data.Pokemon);
      }
      for (let move of LocalData.FastMoves) {
         insertEntry(move, Data.FastMoves);
      }
      for (let move of LocalData.ChargedMoves) {
         insertEntry(move, Data.ChargedMoves);
      }
      for (var param in LocalData.BattleSettings) {
         Data.BattleSettings[param] = LocalData.BattleSettings[param];
      }

      manuallyModifyData(Data);

      if (kwargs.complete) {
         kwargs.complete();
      }
   }

   fetchLevelSettings(oncompleteWrapper);
   fetchPokemonForms(oncompleteWrapper);
   fetchMoves(oncompleteWrapper);
   fetchRaidBosses(oncompleteWrapper);
   fetchPokemon(oncompleteWrapper);
   attachRaidbossInfo();
   attachPokemonForm();

   if (window.userID2 && window.userID2 != "0") {
      fetchUser(null, window.userID2);
   }
};

/**
 * Invalidate databases and makes them overwritable. This method does not erase existing database (call GM.erase() for erasing).
 */
GM.invalidate = function () {
   for (var json_name in requiredJSONStatus) {
      requiredJSONStatus[json_name] = 0;
   }
};

/**
 * Erase all records of the specified database and make it empty.
 *
 * @param {string} nameDb The name of the database to erase.
 */
GM.erase = function (nameDb) {
   var db = getDatabaseByName(nameDb);
   if (Array.isArray(db)) {
      db.splice(0, db.length);
   } else if (db) {
      for (var k in db) {
         delete db[k];
      }
   }
};

/**
 * Get one entry from the specified database.
 *
 * @param {string} nameDb Name of the database.
 * @param {string} nameObj Name of the entry.
 * @return {Object} The entry matching the name given. Null if no match.
 */
GM.get = function (nameDb, nameObj) {
   var db = getDatabaseByName(nameDb);
   if (Array.isArray(db)) {
      return getEntry(nameObj, db, !db.sorted);
   } else if (db) {
      return db[nameObj];
   }
};

/**
 * Update an entry of the specified database.
 * If no object is given, the existing matching entry will be removed.
 *
 * @param {string} nameDb Name of the database.
 * @param {string} nameObj Name of the entry.
 * @param {Object} obj The updated object.
 * @return {Object} The updated or removed object.
 */
GM.set = function (nameDb, nameObj, obj) {
   var db = getDatabaseByName(nameDb);
   if (Array.isArray(db)) {
      if (obj) {
         obj.name = nameObj;
         insertEntry(obj, db);
         return obj;
      } else {
         return removeEntry(nameObj, db);
      }
   } else if (db) {
      if (obj) {
         db[nameObj] = obj;
         return obj;
      } else {
         obj = db[nameObj];
         delete db[nameObj];
         return obj;
      }
   }
};

/**
 * Get all the entries that match the PokeQuery from the specified database.
 *
 * @param {string} nameDb Name of the database.
 * @param {string} query The string representation of a PokeQuery.
 * @param {Object|Pokemon} pokemonInstance The Pokemon instance required for querying attributes of a Pokemon such as Move.
 * @return {Object[]} Matching entities.
 */
GM.select = function (nameDb, query, pokemonInstance) {
   var db = getDatabaseByName(nameDb);
   if (Array.isArray(db)) {
      return db.filter(PokeQuery(query, pokemonInstance));
   } else if (db) {
      return Object.values(db).filter(PokeQuery(query, pokemonInstance));
   }
};

/**
 * Iterate through each entry of the specified database.
 *
 * @param {string} nameDb The name of the database.
 * @param {GMeachCallback} cackbankfn The callback function that accepts one parameter.
 */
GM.each = function (nameDb, cackbankfn) {
   var db = getDatabaseByName(nameDb);
   if (Array.isArray(db)) {
      for (var i = 0; i < db.length; i++) {
         var ret = cackbankfn(db[i], i);
         if (ret !== undefined) {
            dt[i] = ret;
         }
      }
   } else if (db) {
      for (var k in db) {
         var ret = cackbankfn(db[k], k);
         if (ret !== undefined) {
            dt[k] = ret;
         }
      }
   }
};
/**
 * @callback GMeachCallback
 * @param {Object} object The current entry being iterrated.
 * @param {Integer} index The index/key of the current entry.
 * @return {null|Object} If return anything, the entry in the database will be updated to the return value.
 */

/**
 * Save user-defined data to local storage.
 * Also push the latest GM to GBS Engine.
 */
GM.save = function () {
   if (localStorage) {
      localStorage.LocalData = JSON.stringify(LocalData);
   }
};

/**
 * Convert GBS game master to fit the new GoBattleSim engine.
 * @param {Object} src The source GBS game master, default to Data.
 * @return {Object} GoBattleSim engine compatible game master.
 */
GM.convert = function (src) {
   src = src || Data;
   var dst = {};

   // CPMultipliers
   if (src.LevelSettings) {
      dst.CPMultipliers = src.LevelSettings.map((x) => x.cpm);
   }

   // Pokemon
   if (src.Pokemon) {
      dst.Pokemon = src.Pokemon;
   }

   // PvEMoves & PvPMoves
   dst.PvEMoves = [];
   dst.PvPMoves = [];
   if (src.FastMoves) {
      for (var i = 0; i < src.FastMoves.length; ++i) {
         var move = src.FastMoves[i];
         var pve_move = {
            movetype: "fast",
            name: move.name,
            pokeType: move.pokeType,
            power: move.regular.power,
            energy: move.regular.energyDelta,
            duration: move.regular.duration,
            dws: move.regular.dws,
            icon: move.icon,
            label: move.label,
         };
         var pvp_move = {
            movetype: "fast",
            name: move.name,
            pokeType: move.pokeType,
            power: move.combat.power,
            energy: move.combat.energyDelta,
            duration: Math.round(move.combat.duration / 500),
            icon: move.icon,
            label: move.label,
         };
         dst.PvEMoves.push(pve_move);
         dst.PvPMoves.push(pvp_move);
      }
   }
   if (src.ChargedMoves) {
      for (var i = 0; i < src.ChargedMoves.length; ++i) {
         var move = src.ChargedMoves[i];
         var pve_move = {
            movetype: "charged",
            name: move.name,
            pokeType: move.pokeType,
            power: move.regular.power,
            energy: move.regular.energyDelta,
            duration: move.regular.duration,
            dws: move.regular.dws,
            icon: move.icon,
            label: move.label,
         };
         var pvp_move = {
            movetype: "charged",
            name: move.name,
            pokeType: move.pokeType,
            power: move.combat.power,
            energy: move.combat.energyDelta,
            effect: move.effect,
            icon: move.icon,
            label: move.label,
         };
         dst.PvEMoves.push(pve_move);
         dst.PvPMoves.push(pvp_move);
      }
   }

   if (src.BattleSettings) {
      // TypeEffectiveness
      dst.TypeEffectiveness = src.BattleSettings.TypeEffectiveness;

      // WeatherSettings
      dst.WeatherSettings = {};
      for (var t in src.BattleSettings.TypeBoostedWeather) {
         let w = src.BattleSettings.TypeBoostedWeather[t];
         if (dst.WeatherSettings[w] == undefined) {
            dst.WeatherSettings[w] = [];
         }
         dst.WeatherSettings[w].push(t);
      }

      // FriendAttackBonusMultipliers
      dst.FriendAttackBonusMultipliers =
         src.BattleSettings.FriendSettings || src.FriendSettings;

      // PvEBattleSettings
      dst.PvEBattleSettings = {
         sameTypeAttackBonusMultiplier:
            src.BattleSettings.sameTypeAttackBonusMultiplier,
         maximumEnergy: src.BattleSettings.maxEnergy,
         energyDeltaPerHealthLost: src.BattleSettings.energyDeltaPerHealthLost,
         dodgeDurationMs: src.BattleSettings.dodgeDurationMs,
         dodgeWindowMs: src.BattleSettings.dodgeDurationMs,
         swapDurationMs: src.BattleSettings.swapDurationMs,
         itemMenuAnimationTimeMs: src.BattleSettings.itemMenuAnimationTimeMs,
         maxReviveTimePerPokemonMs:
            src.BattleSettings.maxReviveTimePerPokemonMs,
         rejoinDurationMs: src.BattleSettings.rejoinDurationMs,
         dodgeDamageReductionPercent:
            src.BattleSettings.dodgeDamageReductionPercent,
         weatherAttackBonusMultiplier:
            src.BattleSettings.weatherAttackBonusMultiplier,
         fastMoveLagMs: src.BattleSettings.fastMoveLagMs,
         chargedMoveLagMs: src.BattleSettings.chargedMoveLagMs,
      };

      // PvPBattleSettings
      dst.PvPBattleSettings = {
         sameTypeAttackBonusMultiplier:
            src.BattleSettings.sameTypeAttackBonusMultiplier,
         fastAttackBonusMultiplier:
            src.BattleSettings.fastAttackBonusMultiplier,
         chargeAttackBonusMultiplier:
            src.BattleSettings.chargeAttackBonusMultiplier,
         maxEnergy: src.BattleSettings.maxEnergy,
         quickSwapCooldownDurationMs:
            src.BattleSettings.quickSwapCooldownDurationMs,
         quickSwapCooldownDurationSeconds: Math.round(
            src.BattleSettings.quickSwapCooldownDurationMs / 1000,
         ),
         minimumStatStage: src.BattleSettings.minimumStatStage,
         maximumStatStage: src.BattleSettings.maximumStatStage,
         attackBuffMultiplier: src.BattleSettings.attackBuffMultiplier,
         defenseBuffMultiplier: src.BattleSettings.defenseBuffMultiplier,
      };
   }

   // RaidTierSettings
   if (src.RaidTierSettings) {
      dst.RaidTierSettings = src.RaidTierSettings;
   }

   return dst;
};

/**
 * Change the global battle mode.
 * Set the default move parameters to the ones for the target battle mode.
 *
 * @param {string} mode one of {"raid", "gym", "pvp"}
 */
GM.mode = function (mode) {
   if (mode == "pvp") {
      GM.each("fast", function (move) {
         for (var a in move.combat) {
            move[a] = move.combat[a];
         }
      });
      GM.each("charged", function (move) {
         for (var a in move.combat) {
            move[a] = move.combat[a];
         }
      });
   } else {
      GM.each("fast", function (move) {
         for (var a in move.regular) {
            move[a] = move.regular[a];
         }
      });
      GM.each("charged", function (move) {
         for (var a in move.regular) {
            move[a] = move.regular[a];
         }
      });
   }
};

/**
 * Non-interface members
 */
var curTime = Date.now();

var requiredJSONStatus = {
   // 0: Not loaded, 1: Started loading, 2: Successfully loaded
   Pokemon: 0,
   PokemonForms: 0,
   RaidBosses: 0,
   Moves: 0,
   LevelSettings: 0,
};

export var Data = {
   BattleSettings: {
      dodgeDurationMs: 500,
      dodgeWindowMs: 700,
      swapDurationMs: 1000,
      quickSwapCooldownDurationMs: 60000,
      arenaEntryLagMs: 3000,
      arenaEarlyTerminationMs: 3000,
      fastMoveLagMs: 25,
      chargedMoveLagMs: 100,
      rejoinDurationMs: 10000,
      itemMenuAnimationTimeMs: 2000,
      maxReviveTimePerPokemonMs: 1000,
      timelimitGymMs: 100000,
      timelimitRaidMs: 180000,
      timelimitLegendaryRaidMs: 300000,
      timelimitPvPMs: 240000,
      shadowPokemonAttackBonusMultiplier: 1.2,
      shadowPokemonDefenseBonusMultiplier: 0.8333333,
      purifiedPokemonAttackMultiplierVsShadow: 1.0,
      //mega pokemon multipliers
      sameTypeAttackBonusMultiplierMega: 1.3,
      megaPokemonStatMultiplier: 1.1,
      sameTypeAttackBonusMultiplier: 1.2,
      weatherAttackBonusMultiplier: 1.2,
      fastAttackBonusMultiplier: 1.3,
      chargeAttackBonusMultiplier: 1.3,
      attackBuffMultiplier: [
         0.5, 0.5714286, 0.6666667, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0,
      ],
      defenseBuffMultiplier: [
         0.5, 0.5714286, 0.6666667, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0,
      ],
      minimumStatStage: -4,
      maximumStatStage: 4,

      maxEnergy: 100,
      energyDeltaPerHealthLost: 0.5,
      dodgeDamageReductionPercent: 0.75,

      TypeEffectiveness: {
         bug: {
            bug: 1,
            dark: 1.6,
            dragon: 1,
            electric: 1,
            fairy: 0.625,
            fighting: 0.625,
            fire: 0.625,
            flying: 0.625,
            ghost: 0.625,
            grass: 1.6,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 0.625,
            psychic: 1.6,
            rock: 1,
            steel: 0.625,
            water: 1,
         },
         dark: {
            bug: 1,
            dark: 0.625,
            dragon: 1,
            electric: 1,
            fairy: 0.625,
            fighting: 0.625,
            fire: 1,
            flying: 1,
            ghost: 1.6,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1.6,
            rock: 1,
            steel: 1,
            water: 1,
         },
         dragon: {
            bug: 1,
            dark: 1,
            dragon: 1.6,
            electric: 1,
            fairy: 0.390625,
            fighting: 1,
            fire: 1,
            flying: 1,
            ghost: 1,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1,
            steel: 0.625,
            water: 1,
         },
         electric: {
            bug: 1,
            dark: 1,
            dragon: 0.625,
            electric: 0.625,
            fairy: 1,
            fighting: 1,
            fire: 1,
            flying: 1.6,
            ghost: 1,
            grass: 0.625,
            ground: 0.390625,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1,
            steel: 1,
            water: 1.6,
         },
         fairy: {
            bug: 1,
            dark: 1.6,
            dragon: 1.6,
            electric: 1,
            fairy: 1,
            fighting: 1.6,
            fire: 0.625,
            flying: 1,
            ghost: 1,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 0.625,
            psychic: 1,
            rock: 1,
            steel: 0.625,
            water: 1,
         },
         fighting: {
            bug: 0.625,
            dark: 1.6,
            dragon: 1,
            electric: 1,
            fairy: 0.625,
            fighting: 1,
            fire: 1,
            flying: 0.625,
            ghost: 0.390625,
            grass: 1,
            ground: 1,
            ice: 1.6,
            normal: 1.6,
            poison: 0.625,
            psychic: 0.625,
            rock: 1.6,
            steel: 1.6,
            water: 1,
         },
         fire: {
            bug: 1.6,
            dark: 1,
            dragon: 0.625,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 0.625,
            flying: 1,
            ghost: 1,
            grass: 1.6,
            ground: 1,
            ice: 1.6,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 0.625,
            steel: 1.6,
            water: 0.625,
         },
         flying: {
            bug: 1.6,
            dark: 1,
            dragon: 1,
            electric: 0.625,
            fairy: 1,
            fighting: 1.6,
            fire: 1,
            flying: 1,
            ghost: 1,
            grass: 1.6,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 0.625,
            steel: 0.625,
            water: 1,
         },
         ghost: {
            bug: 1,
            dark: 0.625,
            dragon: 1,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 1,
            flying: 1,
            ghost: 1.6,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 0.390625,
            poison: 1,
            psychic: 1.6,
            rock: 1,
            steel: 1,
            water: 1,
         },
         grass: {
            bug: 0.625,
            dark: 1,
            dragon: 0.625,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 0.625,
            flying: 0.625,
            ghost: 1,
            grass: 0.625,
            ground: 1.6,
            ice: 1,
            normal: 1,
            poison: 0.625,
            psychic: 1,
            rock: 1.6,
            steel: 0.625,
            water: 1.6,
         },
         ground: {
            bug: 0.625,
            dark: 1,
            dragon: 1,
            electric: 1.6,
            fairy: 1,
            fighting: 1,
            fire: 1.6,
            flying: 0.390625,
            ghost: 1,
            grass: 0.625,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1.6,
            psychic: 1,
            rock: 1.6,
            steel: 1.6,
            water: 1,
         },
         ice: {
            bug: 1,
            dark: 1,
            dragon: 1.6,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 0.625,
            flying: 1.6,
            ghost: 1,
            grass: 1.6,
            ground: 1.6,
            ice: 0.625,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1,
            steel: 0.625,
            water: 0.625,
         },
         normal: {
            bug: 1,
            dark: 1,
            dragon: 1,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 1,
            flying: 1,
            ghost: 0.390625,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 0.625,
            steel: 0.625,
            water: 1,
         },
         poison: {
            bug: 1,
            dark: 1,
            dragon: 1,
            electric: 1,
            fairy: 1.6,
            fighting: 1,
            fire: 1,
            flying: 1,
            ghost: 0.625,
            grass: 1.6,
            ground: 0.625,
            ice: 1,
            normal: 1,
            poison: 0.625,
            psychic: 1,
            rock: 0.625,
            steel: 0.390625,
            water: 1,
         },
         psychic: {
            bug: 1,
            dark: 0.390625,
            dragon: 1,
            electric: 1,
            fairy: 1,
            fighting: 1.6,
            fire: 1,
            flying: 1,
            ghost: 1,
            grass: 1,
            ground: 1,
            ice: 1,
            normal: 1,
            poison: 1.6,
            psychic: 0.625,
            rock: 1,
            steel: 0.625,
            water: 1,
         },
         rock: {
            bug: 1.6,
            dark: 1,
            dragon: 1,
            electric: 1,
            fairy: 1,
            fighting: 0.625,
            fire: 1.6,
            flying: 1.6,
            ghost: 1,
            grass: 1,
            ground: 0.625,
            ice: 1.6,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1,
            steel: 0.625,
            water: 1,
         },
         steel: {
            bug: 1,
            dark: 1,
            dragon: 1,
            electric: 0.625,
            fairy: 1.6,
            fighting: 1,
            fire: 0.625,
            flying: 1,
            ghost: 1,
            grass: 1,
            ground: 1,
            ice: 1.6,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1.6,
            steel: 0.625,
            water: 0.625,
         },
         water: {
            bug: 1,
            dark: 1,
            dragon: 0.625,
            electric: 1,
            fairy: 1,
            fighting: 1,
            fire: 1.6,
            flying: 1,
            ghost: 1,
            grass: 0.625,
            ground: 1.6,
            ice: 1,
            normal: 1,
            poison: 1,
            psychic: 1,
            rock: 1.6,
            steel: 1,
            water: 0.625,
         },
      },

      TypeBoostedWeather: {
         grass: "CLEAR",
         ground: "CLEAR",
         fire: "CLEAR",
         dark: "FOG",
         ghost: "FOG",
         fairy: "CLOUDY",
         fighting: "CLOUDY",
         poison: "CLOUDY",
         normal: "PARTLY_CLOUDY",
         rock: "PARTLY_CLOUDY",
         water: "RAINY",
         electric: "RAINY",
         bug: "RAINY",
         ice: "SNOW",
         steel: "SNOW",
         dragon: "WINDY",
         flying: "WINDY",
         psychic: "WINDY",
      },

      FriendSettings: [
         {
            name: "none",
            label: "Lv.0 Non-Friend",
            multiplier: 1.0,
         },
         {
            name: "good",
            label: "Lv.1 Good Friend",
            multiplier: 1.03,
         },
         {
            name: "great",
            label: "Lv.2 Great Friend",
            multiplier: 1.05,
         },
         {
            name: "ultra",
            label: "Lv.3 Ultra Friend",
            multiplier: 1.07,
         },
         {
            name: "best",
            label: "Lv.4 Best Friend",
            multiplier: 1.1,
         },
      ],
   },

   Weathers: [
      { name: "EXTREME", label: "Extreme" },
      { name: "CLEAR", label: "Clear" },
      { name: "FOG", label: "Fog" },
      { name: "CLOUDY", label: "Cloudy" },
      { name: "PARTLY_CLOUDY", label: "Partly Cloudy" },
      { name: "RAINY", label: "Rainy" },
      { name: "SNOW", label: "Snow" },
      { name: "WINDY", label: "Windy" },
   ],

   RaidTierSettings: [
      { name: "1", label: "Tier 1", cpm: 0.6, maxHP: 600, timelimit: 180000 },
      { name: "2", label: "Tier 2", cpm: 0.67, maxHP: 1800, timelimit: 180000 },
      {
         name: "3",
         label: "Tier 3",
         cpm: 0.7300000190734863,
         maxHP: 3600,
         timelimit: 180000,
      },
      {
         name: "4",
         label: "Tier 4",
         cpm: 0.7900000214576721,
         maxHP: 9000,
         timelimit: 180000,
      },
      {
         name: "5",
         label: "Tier 5",
         cpm: 0.7900000214576721,
         maxHP: 15000,
         timelimit: 300000,
      },
      {
         name: "6",
         label: "Tier 6",
         cpm: 0.7900000214576721,
         maxHP: 18750,
         timelimit: 300000,
      },
   ],

   RaidBosses: [],

   Pokemon: [],

   PokemonForms: [],

   FastMoves: [],

   ChargedMoves: [],

   LevelSettings: [],

   IndividualValues: [
      { name: "0", value: 0 },
      { name: "1", value: 1 },
      { name: "2", value: 2 },
      { name: "3", value: 3 },
      { name: "4", value: 4 },
      { name: "5", value: 5 },
      { name: "6", value: 6 },
      { name: "7", value: 7 },
      { name: "8", value: 8 },
      { name: "9", value: 9 },
      { name: "10", value: 10 },
      { name: "11", value: 11 },
      { name: "12", value: 12 },
      { name: "13", value: 13 },
      { name: "14", value: 14 },
      { name: "15", value: 15 },
   ],

   Users: [],
};

var LocalData = {
   Pokemon: [],
   FastMoves: [],
   ChargedMoves: [],
   BattleParties: [],
   BattleSettings: {},
};

var Mods = [
   {
      name: "Mega Evolutions Basic Movepool",
      effect: function () {
         for (let pokemon of Data.Pokemon) {
            if (
               pokemon.name.includes("mega") &&
               (pokemon.fastMoves.length == 0 ||
                  pokemon.chargedMoves.length == 0)
            ) {
               for (let pkm2 of Data.Pokemon) {
                  if (pokemon.dex == pkm2.dex) {
                     pokemon.fastMoves = pkm2.fastMoves;
                     pokemon.chargedMoves = pkm2.chargedMoves;
                  }
               }
            }
         }
      },
   },
   {
      name: "Future Pokemon Movepool Expansion",
      effect: function () {
         for (let pokemon of Data.Pokemon) {
            if (
               pokemon.fastMoves.length == 0 ||
               pokemon.chargedMoves.length == 0
            ) {
               let forme = getEntry(pokemon.name, Data.PokemonForms) || {};
               $.extend(pokemon, forme);
            }
         }
      },
   },
   {
      name: "Exclude Low-rating and Low-Attack Species",
      effect: function () {
         Data.Pokemon = Data.Pokemon.filter(
            (x) => x.rating >= 2 || x.baseAtk >= 160,
         );
         Data.Pokemon.sorted = true;
      },
   },
];

/**
 * Get a reference to the database.
 * While this provides a lot of convenience for data manipulation, it is not recommended to directly operates on the database object.
 *
 * @param {string} nameDb Name of the database.
 * @return {Object} The reference to the database.
 */
function getDatabaseByName(nameDb) {
   var masterDatabase = Data;
   if (nameDb.endsWith("_local")) {
      nameDb = nameDb.split("_")[0];
      masterDatabase = LocalData;
   }
   if (masterDatabase[nameDb]) {
      // Exact match
      return masterDatabase[nameDb];
   } else if (nameDb == "pokemon_all") {
      return getPokemonPool();
   } else if (nameDb.toLowerCase().startsWith("friend")) {
      return masterDatabase.BattleSettings.FriendSettings;
   } else {
      // Case-insensitive search
      for (var dbname in masterDatabase) {
         if (dbname.toLowerCase().startsWith(nameDb.toLowerCase())) {
            return masterDatabase[dbname];
         }
      }
   }
   return null;
}

/**
 * Hardcore some data.
 *
 * @param {Object} data The master data reference.
 */
function manuallyModifyData(data) {}

/**
 * Look up an item in an array.
 *
 * @param {string} name The key to look up for.
 * @param {Object[]} arr The array to search from.
 * @param {boolean} linearSearch If true, the function will perform linear search. Otherwise (default), binary search.
 * @return {Object} The item whose key matches the given key. Null if there's no such item.
 */
function getEntry(name, arr, linearSearch) {
   if (linearSearch) {
      for (var i = 0; i < arr.length; i++) {
         if (arr[i].name == name) return arr[i];
      }
      return null;
   } else {
      var index = binarySearch(name, arr);
      return arr[index] && arr[index].name == name ? arr[index] : null;
   }
}

/**
 * Add a new item to a sorted array and maintain sorted order.
 * If there is already an item with the same key, the old item will be replaced.
 *
 * @param {Object} entry The item to add.
 * @param {Object[]} arr The array to search from.
 */
function insertEntry(entry, arr) {
   var index = binarySearch(entry.name, arr);
   if (arr[index] && arr[index].name == entry.name) arr[index] = entry;
   else arr.splice(index, 0, entry);
}

/**
 * Remove the item by key from a sorted array.
 *
 * @param {string} name The search key.
 * @param {Object[]} arr The array to search from.
 * @return {Object} An object whose key matches the given key or null if there's no such object.
 */
function removeEntry(name, arr) {
   var index = binarySearch(name, arr);
   if (arr[index] && arr[index].name == name) {
      return arr.splice(index, 1)[0];
   } else {
      return null;
   }
}

/**
 * OG Binary search.
 *
 * @param {string} name The search key.
 * @param {Object[]} arr The array to search from.
 * @return {number} The index of the first element whose key is no less than the given key.
 */
function binarySearch(name, arr) {
   var start = 0,
      end = arr.length,
      mid;
   while (start < end) {
      mid = ~~((start + end) / 2);
      if (arr[mid].name < name) start = mid + 1;
      else end = mid;
   }
   return start;
}

function toTitleCase(str) {
   str = str || "";
   return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
   });
}

/**
 * Parse two Pokemon types from a string.
 *
 * @param {string} S The string to parse.
 * @return {{pokeType1: string, pokeType2: string}}
 */
function parsePokemonTypeFromString(S) {
   var L = S.split(",");
   return {
      pokeType1: L[0].trim().toLowerCase(),
      pokeType2: (L[1] || "none").trim().toLowerCase(),
   };
}

/**
 * Parse non-empty names separated by "," from a string.
 *
 * @param {string} S The string to parse.
 * @return {string[]} A list of non-empty names in lower case.
 */
function parseMovesFromString(S) {
   S = S || "";
   var moves = [];
   for (let name of S.split(",")) {
      name = name.trim();
      if (name.length > 0) moves.push(name.toLowerCase());
   }
   return moves;
}

/**
 * Generate the URL to the icon for a Pokemon via dex number.
 *
 * @param {number} dex The dex of the Pokemon. If omitted, the PokeBall icon will be returned.
 * @return {string} The URL to the icon.
 */
function getPokemonIcon(dex) {
   dex = (dex || "").toString();
   while (dex.length < 3) dex = "0" + dex;
   return "/pokemongo/assets/img/sprites/" + dex + "MS.png";
}

/**
 * Generate the URL to the icon for a Pokemon type.
 *
 * @param {string} type The type. If omitted, the quesion mark icon will be returned.
 * @return {string} The URL to the icon.
 */
function getTypeIcon(type) {
   return (
      "/pokemongo/sites/pokemongo/files/icon_" +
      (type || "none").toLowerCase() +
      ".png"
   );
}

/**
 * Get all evolutions of a Pokemon.
 *
 * @param {string} name the name of the Pokemon.
 * @return {string[]} a list of names of Pokemon.
 */
function getAllEvolutions(name) {
   var evolutions = [name],
      pkm = getEntry(name, Data.Pokemon);
   if (pkm) {
      for (evo of pkm.evolutions) {
         evolutions = evolutions.concat(getAllEvolutions(evo));
      }
   }
   return evolutions;
}

/**
 * Get the pre-evolution a Pokemon.
 *
 * @param {string} name the name of the Pokemon.
 * @return {string} the name of the Pokemon's ancestor.
 */
function getPreEvolution(name) {
   let flag = false;
   for (let pkm of Data.Pokemon) {
      if (pkm.evolutions && pkm.evolutions.includes(name) && pkm.name != name) {
         flag = true;
         name = pkm.name;
      }
   }
   if (flag) {
      return getPreEvolution(name);
   } else {
      return name;
   }
}

/**
 * Get the union of generic Pokemon pool and user Pokemon.
 *
 * @return {Object[]} A list of Pokemon.
 */
function getPokemonPool() {
   var options = [];
   for (let user of Data.Users) {
      for (let pokemon of user.box) {
         options.push(pokemon);
      }
   }
   return options.concat(Data.Pokemon);
}

/**
 * Validate the user Pokemon data array for other modules to correctly use.
 *
 * @param {Object[]} pokemonDataBase An array of user Pokemon data.
 * @return {Object[]} An array of valid user Pokemon data.
 */
function parseUserPokebox(data) {
   var box = [];
   var missingRequiredFields = [];
   for (var i = 0; i < data.length; i++) {
      var curr_pokemon = data[i];
      if (
         !(curr_pokemon.fast_move || curr_pokemon.fmove) ||
         !(curr_pokemon.charge_move || curr_pokemon.cmove)
      ) {
         missingRequiredFields.push(curr_pokemon);
         continue;
      }
      var pkm = {
         name: (data[i].species || data[i].name).toLowerCase(),
         cp: parseInt(data[i].cp),
         level: parseFloat(data[i].level) || 1,
         stmiv: parseInt(data[i].sta || data[i].stmiv) || 0,
         atkiv: parseInt(data[i].atk || data[i].atkiv) || 0,
         defiv: parseInt(data[i].def || data[i].defiv) || 0,
         fmove: (data[i].fast_move || data[i].fmove).toLowerCase(),
         cmove: (data[i].charge_move || data[i].cmove).toLowerCase(),
         cmove2: (
            data[i].charge_move ||
            data[i].cmove2 ||
            data[i].cmove
         ).toLowerCase(),
         nickname: data[i].nickname,
         uid: data[i].uid,
      };
      let species = getEntry(pkm.name, Data.Pokemon) || {};
      $.extend(pkm, species);
      pkm.nid = data[i].nid;
      pkm.label = pkm.nickname;
      pkm.labelLinked = data[i].labelLinked;
      box.push(pkm);
   }
   if (missingRequiredFields.length > 0) {
      var missingMsg =
         "The following pokemon are missing a fast and/or charge move and will be excluded: ";
      for (var i = 0; i < missingRequiredFields.length; i++) {
         missingMsg += "<br/>" + missingRequiredFields[i].labelLinked;
      }
      UI.sendFeedbackDialog(missingMsg, "Missing Data", null, true);
   }
   return box;
}

// /**
//  * Fetch the URLs of the raid boss, Pokemon and move JSONs.
//  *
//  * @param oncomplete The callback after the fetching is complete.
//  */
// function fetchURLs(oncomplete) {
//    $.ajax({
//       url: "/json-list?_format=json&game_tid=1&" + curTime,
//       dataType: "json",
//       success: function (data) {
//          for (var i = 0; i < data.length; i++) {
//             var curr = data[i];
//             if (curr.title == "raid-boss-list-PoGO") {
//                raidBossListURL = curr.url;
//             }
//             if (curr.title == "pokemon-data-full-en-PoGO") {
//                pokemonDataFullURL = curr.url;
//             }
//             if (curr.title == "move-data-full-PoGO") {
//                moveDataFullURL = curr.url;
//             }
//          }
//       },
//       complete: oncomplete || function () {},
//    });
// }

/**
 * Fetch Level Settings from GP server.
 *
 * @param oncomplete The callback after the fetching is complete.
 */
function fetchLevelSettings(oncomplete = function () {}) {
   Data.LevelSettings = cpmData.map((cpm) => ({
      name: cpm.name,
      value: parseFloat(cpm.name),
      cpm: parseFloat(cpm.field_cp_multiplier),
      stardust: parseInt(cpm.field_stardust_cost),
      candy: parseInt(cpm.field_candy_cost),
   }));

   requiredJSONStatus.LevelSettings = 2;

   return oncomplete();
}

/**
 * Fetch raid boss list from GP server.
 *
 * @param oncomplete The callback after the fetching is complete.
 */
function fetchRaidBosses(oncomplete = function () {}) {
   Data.RaidBosses = raidBossList.map((bossInfo) => ({
      name: bossInfo.title_plain.toLowerCase(),
      tier: parseInt((/>\s*(\d)\s*</.exec(bossInfo.tier) || [0, 0])[1]),
      future: bossInfo.future.toLowerCase() == "on",
      legacy: bossInfo.legacy.toLowerCase() == "on",
      special: bossInfo.special.toLowerCase() == "on",
   }));
   requiredJSONStatus.RaidBosses = 2;
   if (Data.Pokemon.length > 0) {
      attachRaidbossInfo();
   }
   return oncomplete();
}

/**
 * Fetch Pokemon data from GP server.
 *
 * @param oncomplete The callback after the fetching is complete.
 */
function fetchPokemon(oncomplete = function () {}) {
   Data.Pokemon = pokemonData
      .map((pkm) => ({
         dex: parseInt(pkm.number),
         name: pkm.title_1.toLowerCase().replace("&#039;", "'"),
         pokeType1: parsePokemonTypeFromString(pkm.field_pokemon_type)
            .pokeType1,
         pokeType2: parsePokemonTypeFromString(pkm.field_pokemon_type)
            .pokeType2,
         baseAtk: parseInt(pkm.atk),
         baseDef: parseInt(pkm.def),
         baseStm: parseInt(pkm.sta),
         fastMoves: parseMovesFromString(pkm.field_primary_moves).concat(
            parseMovesFromString(pkm.purified_fast_moves),
         ), //for now, just stick the new fields in the base array
         chargedMoves: parseMovesFromString(pkm.field_secondary_moves).concat(
            parseMovesFromString(pkm.purified_charge_moves),
         ), //for now, just stick the new fields in the base array
         fastMoves_legacy: parseMovesFromString(
            pkm.field_legacy_quick_moves,
         ).concat(parseMovesFromString(pkm.elite_fast_moves)),
         chargedMoves_legacy: parseMovesFromString(
            pkm.field_legacy_charge_moves,
         ).concat(parseMovesFromString(pkm.elite_charge_moves)),
         fastMoves_exclusive: parseMovesFromString(pkm.quick_exclusive_moves),
         chargedMoves_exclusive: parseMovesFromString(
            pkm.charge_exclusive_moves,
         ),
         rating: parseFloat(pkm.rating) || 0,
         raidMarker: "",
         nid: pkm.nid,
         icon: getPokemonIcon(pkm.number),
         label: pkm.title_1.replace("&#039;", "'"),
         labelLinked: pkm.title,
         evolutions: parseMovesFromString(pkm.field_evolutions),
         unavailable: pkm.unavailable,
         rarity: LegendaryPokemon.includes(
            pkm.title_1.toLowerCase().replace("&#039;", "'"),
         )
            ? "POKEMON_RARITY_LEGENDARY"
            : MythicalPokemon.includes(
                 pkm.title_1.toLowerCase().replace("&#039;", "'"),
              )
            ? "POKEMON_RARITY_MYTHIC"
            : undefined,
      }))
      .sort((a, b) => (a.name < b.name ? -1 : 1));

   Data.Pokemon.sorted = true;
   requiredJSONStatus.Pokemon = 2;

   return oncomplete();
}

/**
 * Attach raid boss info to each Pokemon. Requires Data.Pokemon and Data.RaidBosses to be loaded.
 */
function attachRaidbossInfo() {
   for (let boss of Data.RaidBosses) {
      let pkm = GM.get("pokemon", boss.name.toLowerCase().trim());
      if (pkm) {
         pkm.raidMarker = "";
         pkm.raidMarker += boss.tier;
         pkm.raidMarker +=
            boss.future || boss.legacy || boss.special ? "" : " current";
         pkm.raidMarker += boss.future ? " future" : "";
         pkm.raidMarker += boss.legacy ? " legacy" : "";
         pkm.raidMarker += boss.special ? " special" : "";
      }
   }
}

/**
 * Attach alternative form info to each Pokemon. Requires Data.Pokemon and Data.PokemonForms to be loaded.
 */
function attachPokemonForm() {
   for (let pkm of Data.PokemonForms) {
      let pkm2 = getEntry(pkm.name, Data.Pokemon);
      if (pkm2) {
         pkm2.icon = pkm.icon;
      } else {
         insertEntry({ ...pkm, fastMoves: [], chargedMoves: [] }, Data.Pokemon);
      }
   }
}

/**
 * Fetch supplement Pokemon form data (such as icons) from GP server.
 *
 * @param oncomplete The callback after the fetching is complete.
 */
function fetchPokemonForms(oncomplete = function () {}) {
   Data.PokemonForms = PokemonForms.map((pkm) => ({
      ...pkm,
      fastMoves: pkm.fastMoves || [],
      fastMoves_legacy: pkm.fastMoves_legacy || [],
      fastMoves_exclusive: pkm.fastMoves_exclusive || [],
      chargedMoves: pkm.chargedMoves || [],
      chargedMoves_legacy: pkm.chargedMoves_legacy || [],
      chargedMoves_exclusive: pkm.chargedMoves_exclusive || [],
      raidMarker: "",
   })).sort((a, b) => (a.name < b.name ? -1 : 1));
   Data.PokemonForms.sorted = true;

   return oncomplete();
}

/**
 * Fetch move data from GP server.
 *
 * @param oncomplete The callback after the fetching is complete.
 */
function fetchMoves(oncomplete = function () {}) {
   // Parse move effect
   function parseMoveEffect(move) {
      if (move.subject) {
         let stage_delta = parseInt(move.stage_delta);
         let subj_self = move.subject.includes("Self");
         let subj_targ = move.subject.includes("Opponent");
         let stat_atk = move.stat.includes("Atk");
         let stat_def = move.stat.includes("Def");
         return {
            activation_chance: parseFloat(move.probability),
            self_attack_stage_delta: subj_self && stat_atk ? stage_delta : 0,
            self_defense_stage_delta: subj_self && stat_def ? stage_delta : 0,
            target_attack_stage_delta: subj_targ && stat_atk ? stage_delta : 0,
            target_defense_stage_delta: subj_targ && stat_def ? stage_delta : 0,
         };
      }
      return "";
   }

   let moves = moveData.map((move) => ({
      name: move.title.toLowerCase(),
      pokeType: move.move_type.toLowerCase(),
      label: toTitleCase(move.title),
      labelLinked: move.title_linked,
      icon: getTypeIcon(move.move_type),
      power: parseInt(move.power),
      dws: parseFloat(move.damage_window.split(" ")[0]) * 1000 || 0,
      duration: parseFloat(move.cooldown) * 1000,
      energyDelta:
         move.move_category == "Fast Move"
            ? Math.abs(parseInt(move.energy_gain))
            : -Math.abs(parseInt(move.energy_cost)),
      effect: parseMoveEffect(move),
      regular: {
         power: parseInt(move.power),
         dws: parseFloat(move.damage_window.split(" ")[0]) * 1000 || 0,
         duration: parseFloat(move.cooldown) * 1000,
         energyDelta:
            move.move_category == "Fast Move"
               ? Math.abs(parseInt(move.energy_gain))
               : -Math.abs(parseInt(move.energy_cost)),
      },
      combat:
         move.move_category === "Fast Move"
            ? {
                 power: parseInt(move.pvp_fast_power),
                 dws: 0,
                 duration: parseInt(move.pvp_fast_duration) + 1,
                 energyDelta: parseInt(move.pvp_fast_energy),
              }
            : {
                 power: parseInt(move.pvp_charge_damage),
                 dws: 0,
                 duration: 0,
                 energyDelta: parseInt(move.pvp_charge_energy),
              },
      moveType: move.move_category === "Fast Move" ? "fast" : "charged",
   }));

   // moves could be fast or charged
   Data.FastMoves = moves
      .filter((move) => move.moveType == "fast")
      .sort((a, b) => (a.name < b.name ? -1 : 1));

   Data.ChargedMoves = moves
      .filter((move) => move.moveType == "charged")
      .sort((a, b) => (a.name < b.name ? -1 : 1));

   //   for (var a in move.regular) {
   //      move[a] = move.regular[a];
   //   }

   Data.FastMoves.sorted = true;
   Data.ChargedMoves.sorted = true;
   requiredJSONStatus.Moves = 2;
   return oncomplete();
}

/**
 * Fetch GP user Pokemon box.
 *
 * @param {function} oncomplete The callback after the fetching is complete.
 * @param {string} userid The user id of the user to fetch.
 */
function fetchUser(oncomplete, userid) {
   userid = userid || "";
   var box_fetched = false,
      parties_fetched = false;
   var user = {
      name: userid,
      uid: userid,
      box: [],
      parties: [],
   };

   function linkPokemon() {
      for (let party of user.parties) {
         party.pokemon = [];
         for (let nid of party.pokemon_nids) {
            for (let pkm of user.box) {
               if ((pkm.nid = nid.trim())) {
                  party.pokemon.push(pkm);
                  break;
               }
            }
         }
      }
   }

   // Fetch box
   $.ajax({
      url:
         "/pokemongo/user-pokemon-json-list?_format=json&new&uid_raw=" + userid,
      dataType: "json",
      success: function (data) {
         for (let pokemon of data) {
            pokemon.labelLinked = pokemon.title;
            pokemon.uid = userid;
         }
         user.box = parseUserPokebox(data);
         box_fetched = true;
         if (parties_fetched) {
            linkPokemon();
            insertEntry(user, Data.Users);
            if (oncomplete) oncomplete();
         }
         $("#ui-use-box-checkbox").checkboxradio({
            disabled: false,
         });
      },
   });
   // Fetch parties
   $.ajax({
      url: "/pokemongo/user-pokemon-team?_format=json&uid=" + userid,
      dataType: "json",
      success: function (data) {
         user.parties = [];
         for (var i = 0; i < data.length; i++) {
            var party = {
               name: data[i].title,
               label: data[i].title,
               isLocal: false,
               pokemon_nids: data[i].team_nids.split(","),
            };
            user.parties.push(party);
         }
         user.parties.sort((a, b) => (a.name < b.name ? -1 : 1));
         parties_fetched = true;
         if (box_fetched) {
            linkPokemon();
            insertEntry(user, Data.Users);
            if (oncomplete) oncomplete();
         }
      },
   });
}

/**
 * Fetch user local data, including customed Pokemon/Moves
 */
function fetchLocalData() {
   if (localStorage) {
      if (localStorage.LocalData) {
         // new
         LocalData = JSON.parse(localStorage.LocalData);
      }

      // Removing the deprecated "index" attribute
      if (LocalData.PokemonClipboard) {
         delete LocalData.PokemonClipboard.index;
         delete LocalData.PokemonClipboard.fmove_index;
         delete LocalData.PokemonClipboard.cmove_index;
      }
      for (let pokemon of LocalData.Pokemon) {
         delete pokemon.box_index;
         delete pokemon.index;
      }
      for (let move of LocalData.FastMoves) {
         move.moveType = "fast";
         delete move.index;
      }
      for (let move of LocalData.ChargedMoves) {
         move.moveType = "charged";
         delete move.index;
      }
      for (let party of LocalData.BattleParties) {
         if (party.pokemon_list) {
            party.pokemon = party.pokemon_list;
            delete party.pokemon_list;
         } else {
            party.pokemon = party.pokemon || [];
         }
         party.isLocal = true;
         party.label = party.label || party.name;
         for (let pokemon of party.pokemon) {
            delete pokemon.index;
            delete pokemon.box_index;
            delete pokemon.fmove_index;
            delete pokemon.cmove_index;
         }
      }

      LocalData.BattleSettings = LocalData.BattleSettings || {};
   }
}

/**
 * PokeQuery related
 */

var LOGICAL_OPERATORS = {
   ",": 0,
   ":": 0,
   ";": 0, // OR
   "&": 1,
   "|": 1, // AND
   "!": 2, // NOT
};
var SELECTORS = ["*", "?"];
var acceptedNumericalAttributes = [
   "cp",
   "hp",
   "dex",
   "atkiv",
   "defiv",
   "stmiv",
   "level",
   "baseAtk",
   "baseDef",
   "baseStm",
   "rating",
   "power",
   "duration",
   "dws",
   "energyDelta",
   "value",
   "dps",
   "tdo",
];

var LegendaryPokemon = [
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
var MythicalPokemon = [
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
var BabyPokemon = [
   "pichu",
   "cleffa",
   "igglybuff",
   "togepi",
   "tyrogue",
   "smoochum",
   "elekid",
   "magby",
   "azurill",
   "wynaut",
   "budew",
   "chingling",
   "bonsly",
   "mime jr.",
   "happiny",
   "munchlax",
   "mantyke",
];
var PokemonRegions = {
   kanto: [1, 151],
   johto: [152, 251],
   hoenn: [252, 386],
   sinnoh: [387, 493],
   unova: [494, 649],
   kalos: [650, 721],
   alola: [722, 809],
   galar: [810, 890],
};

/**
 * Create a PokeQuery that filters Pokemon, Moves and other attributes of the Pokemon.
 *
 * @param {string} queryStr The string representation of the query.
 * @param {Object|Pokemon} pokemonInstance An instance of the subject Pokemon. Used for querying Pokemon attributes.
 * @return {function} A function that accepts one parameter (the entity to evaluate) and returns true or false.
 */
// function PokeQuery(queryStr, pokemonInstance) {
//    var defaultPredicate = (arg) => false;
//    var vstack = [],
//       opstack = [];

//    function evalSimple(op, stack) {
//       if (op == "," || op == ":" || op == ";") {
//          var rhs = stack.pop() || defaultPredicate,
//             lhs = stack.pop() || defaultPredicate;
//          stack.push((arg) => lhs(arg) || rhs(arg));
//       } else if (op == "&" || op == "|") {
//          var rhs = stack.pop() || defaultPredicate,
//             lhs = stack.pop() || defaultPredicate;
//          stack.push((arg) => lhs(arg) && rhs(arg));
//       } else if (op == "!") {
//          var rhs = stack.pop() || defaultPredicate;
//          stack.push((arg) => !rhs(arg));
//       } else {
//          stack.push(defaultPredicate);
//       }
//    }

//    function tokenize(str, specialChars, escapeChar) {
//       var tokens = [],
//          cur = "",
//          escaped = false;
//       for (var i = 0; i < str.length; i++) {
//          var c = str[i];
//          if (escaped) {
//             cur += c;
//             escaped = false;
//          } else if (c == escapeChar) {
//             escaped = true;
//          } else if (specialChars.includes(c)) {
//             if (cur.trim()) {
//                tokens.push(cur.trim());
//                cur = "";
//             }
//             tokens.push(c);
//          } else {
//             cur += c;
//          }
//       }
//       if (cur.trim()) {
//          tokens.push(cur.trim());
//       }
//       return tokens;
//    }

//    for (let tk of tokenize(
//       queryStr,
//       Object.keys(LOGICAL_OPERATORS).concat(["(", ")"]),
//       "`",
//    )) {
//       if (LOGICAL_OPERATORS.hasOwnProperty(tk)) {
//          var top_op = opstack[opstack.length - 1];
//          while (
//             top_op &&
//             top_op != "(" &&
//             LOGICAL_OPERATORS[top_op] > LOGICAL_OPERATORS[tk]
//          ) {
//             evalSimple(opstack.pop(), vstack);
//             top_op = opstack[opstack.length - 1];
//          }
//          opstack.push(tk);
//       } else if (tk == "(") {
//          opstack.push("(");
//       } else if (tk == ")") {
//          while (opstack.length) {
//             var op = opstack.pop();
//             if (op == "(") break;
//             evalSimple(op, vstack);
//          }
//       } else {
//          vstack.push(BasicPokeQuery(tk, pokemonInstance));
//       }
//    }
//    while (opstack.length) {
//       evalSimple(opstack.pop(), vstack);
//    }

//    return vstack.pop() || defaultPredicate;
// }

function tryParseNumberOrRange(exp) {
   let bounds = Array(2);
   if (exp.includes("-")) {
      bounds[0] = exp.split("-")[0];
      bounds[1] = exp.split("-")[1];
   } else if (!isNaN(parseFloat(exp))) {
      bounds[0] = exp;
      bounds[1] = exp;
   } else {
      return null;
   }
   bounds[0] = bounds[0] ? parseFloat(bounds[0]) : null;
   bounds[1] = bounds[1] ? parseFloat(bounds[1]) : null;
   if (isNaN(bounds[0]) || isNaN(bounds[1])) {
      return null;
   } else {
      return bounds;
   }
}

/**
 * Create a basic PokeQuery that filters Pokemon, Moves and other attributes of the Pokemon.
 * A basic PokeQuery is a PokeQuery without logical operator or parathesis.
 *
 * @param {string} queryStr The string representation of the query.
 * @param {Object|Pokemon} pokemonInstance An instance of the subject Pokemon, used for querying Pokemon attributes.
 * @return {function} A function that accepts one parameter (the entity to evaluate) and returns true or false.
 */
// function BasicPokeQuery(queryStr, pokemonInstance) {
//    let str = queryStr.trim();

//    let numericalAttr = "";
//    let numericalBounds = tryParseNumberOrRange(str);
//    if (numericalBounds) {
//       numericalAttr = pokemonInstance ? "value" : "dex";
//    } else {
//       let non_alpha_idx = str.search(/[^A-Za-z]/);
//       let name = str.substr(0, non_alpha_idx).toLowerCase();
//       for (let attr of acceptedNumericalAttributes) {
//          if (name && attr.toLowerCase().startsWith(name)) {
//             numericalBounds = tryParseNumberOrRange(str.substr(non_alpha_idx));
//             if (numericalBounds) {
//                numericalAttr = attr;
//                str = str.substr(non_alpha_idx);
//                break;
//             }
//          }
//       }
//    }

//    if (numericalAttr && numericalBounds) {
//       // Match numerical attributes
//       const L = numericalBounds[0],
//          U = numericalBounds[1];
//       if (L === null) {
//          return (x) => Math.abs(x[numericalAttr]) <= U;
//       } else if (U === null) {
//          return (x) => Math.abs(x[numericalAttr]) >= L;
//       } else {
//          return (x) =>
//             L <= Math.abs(x[numericalAttr]) && Math.abs(x[numericalAttr]) <= U;
//       }
//    } else if (
//       Data.BattleSettings.TypeEffectiveness.hasOwnProperty(str.toLowerCase()) ||
//       str.toLowerCase() == "none"
//    ) {
//       // Match types
//       str = str.toLowerCase();
//       return function (obj) {
//          return [obj.pokeType, obj.pokeType1, obj.pokeType2].includes(str);
//       };
//    } else if (str.toLowerCase() == "@same") {
//       return function (obj) {
//          return obj.cmove.pokeType == obj.fmove.pokeType;
//       };
//    } else if (str[0] == "@") {
//       // Match Pokemon's moves
//       str = str.slice(1).toLowerCase();
//       if (str[0] == "1" || str.substring(0, 3) == "<f>") {
//          str = str[0] == "1" ? str.slice(1) : str.slice(3);
//          return function (obj) {
//             var fmove =
//                typeof obj.fmove == typeof ""
//                   ? getEntry(obj.fmove, Data.FastMoves)
//                   : obj.fmove;
//             pred_move = BasicPokeQuery(str, obj);
//             return fmove && pred_move(fmove);
//          };
//       } else if (str[0] == "2" || str.substring(0, 3) == "<c>") {
//          str = str[0] == "2" ? str.slice(1) : str.slice(3);
//          return function (obj) {
//             var cmove =
//                typeof obj.cmove == typeof ""
//                   ? getEntry(obj.cmove, Data.ChargedMoves)
//                   : obj.cmove;
//             pred_move = BasicPokeQuery(str, obj);
//             return cmove && pred_move(cmove);
//          };
//       } else if (str[0] == "3") {
//          str = str.slice(1);
//          return function (obj) {
//             var cmove =
//                typeof obj.cmove2 == typeof ""
//                   ? getEntry(obj.cmove2, Data.ChargedMoves)
//                   : obj.cmove2;
//             pred_move = BasicPokeQuery(str, obj);
//             return cmove && pred_move(cmove);
//          };
//       } else if (str[0] == "*" || str.substring(0, 3) == "<*>") {
//          str = str[0] == "*" ? str.slice(1) : str.slice(3);
//          return function (obj) {
//             var fmove =
//                typeof obj.fmove == typeof ""
//                   ? getEntry(obj.fmove, Data.FastMoves)
//                   : obj.fmove;
//             var cmove =
//                typeof obj.cmove == typeof ""
//                   ? getEntry(obj.cmove, Data.ChargedMoves)
//                   : obj.cmove;
//             pred_move = BasicPokeQuery(str, obj);
//             return fmove && pred_move(fmove) && cmove && pred_move(cmove);
//          };
//       } else {
//          return function (obj) {
//             var fmove =
//                typeof obj.fmove == typeof ""
//                   ? getEntry(obj.fmove, Data.FastMoves)
//                   : obj.fmove;
//             var cmove =
//                typeof obj.cmove == typeof ""
//                   ? getEntry(obj.cmove, Data.ChargedMoves)
//                   : obj.cmove;
//             pred_move = BasicPokeQuery(str, obj);
//             return (fmove && pred_move(fmove)) || (cmove && pred_move(cmove));
//          };
//       }
//    } else if (str[0] == "$") {
//       // Box
//       str = str.slice(1).trim();
//       return function (obj) {
//          return obj.uid && obj.nickname.includes(str);
//       };
//    } else if (str[0] == "%") {
//       // Raid Boss
//       str = str.slice(1);
//       return function (obj) {
//          return obj.raidMarker && obj.raidMarker.includes(str);
//       };
//    } else if (str[0] == "+") {
//       // Evolutionary Family
//       let ancestor = getPreEvolution(str.slice(1).trim().toLowerCase());
//       const evolutions = getAllEvolutions(ancestor);
//       return function (obj) {
//          return evolutions.includes(obj.name);
//       };
//    } else if (str.toLowerCase() == "evolve") {
//       // The Pokemon has evolution
//       return function (obj) {
//          return obj.evolutions && obj.evolutions.length > 0;
//       };
//    } else if (str.toLowerCase() == "legendary") {
//       // Match legendary Pokemon
//       return function (obj) {
//          return obj.rarity == "POKEMON_RARITY_LEGENDARY";
//       };
//    } else if (str.toLowerCase() == "mythical") {
//       // Match mythical Pokemon
//       return function (obj) {
//          return obj.rarity == "POKEMON_RARITY_MYTHIC";
//       };
//    } else if (str.toLowerCase() == "eggsonly") {
//       // Match baby Pokemon
//       return function (obj) {
//          return BabyPokemon.includes(obj.name);
//       };
//    } else if (PokemonRegions.hasOwnProperty(str.toLowerCase())) {
//       // Search By Region
//       var dex_range = PokemonRegions[str.toLowerCase()];
//       return function (obj) {
//          return dex_range[0] <= obj.dex && obj.dex <= dex_range[1];
//       };
//    } else if (str.toLowerCase() == "current") {
//       // Current Move
//       return function (obj) {
//          var movepool = (pokemonInstance || {})[obj.moveType + "Moves"];
//          return movepool && movepool.includes(obj.name);
//       };
//    } else if (str.toLowerCase() == "legacy") {
//       // Legacy Move
//       return function (obj) {
//          var movepool = (pokemonInstance || {})[obj.moveType + "Moves_legacy"];
//          return movepool && movepool.includes(obj.name);
//       };
//    } else if (str.toLowerCase() == "exclusive") {
//       // Exclusive Move
//       return function (obj) {
//          var movepool = (pokemonInstance || {})[
//             obj.moveType + "Moves_exclusive"
//          ];
//          return movepool && movepool.includes(obj.name);
//       };
//    } else if (str.toLowerCase() == "special") {
//       // Legacy or Exclusive Move
//       return function (obj) {
//          var movepool1 = (pokemonInstance || {})[obj.moveType + "Moves_legacy"];
//          var movepool2 = (pokemonInstance || {})[
//             obj.moveType + "Moves_exclusive"
//          ];
//          return (
//             movepool1 &&
//             movepool1.includes(obj.name) &&
//             movepool2 &&
//             movepool2.includes(obj.name)
//          );
//       };
//    } else if (str.toLowerCase() == "stab") {
//       // STAB Move
//       return function (obj) {
//          pokemonInstance = pokemonInstance || {};
//          return (
//             obj.pokeType == pokemonInstance.pokeType1 ||
//             obj.pokeType == pokemonInstance.pokeType2
//          );
//       };
//    } else if (str.toLowerCase() == "effect") {
//       // Move with effect
//       return function (obj) {
//          return obj.effect;
//       };
//    } else if (str.toLowerCase() == "weather") {
//       // Weather-boosted Move
//       var Weather = $("#weather").val() || $("[name=input-weather]").val();
//       return function (obj) {
//          return Data.BattleSettings.TypeBoostedWeather[obj.pokeType] == Weather;
//       };
//    } else {
//       // Match name/nickname/species
//       return function (obj) {
//          if (obj.name && obj.name.includes(str.toLowerCase())) return true;
//          return obj.label && obj.label.includes(str);
//       };
//    }
// }

export const Component = () => <div>Test</div>;

export default Component;
