import path from "path";

import Payload from "payload";

import { manaSlug } from "../../utils/url-slug";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL: `${process.env.CUSTOM_DB_URI}` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

// const data = require("./pokemon.json");

async function mapper() {
   const requests = Array.from({ length: 156 }, (_, i) =>
      fetch(
         `https://pogo.gamepress.gg/pokemongo-export-full?page=${i}&_format=json`,
      ).then((response) => response.json()),
   );

   const getPokemon = await Promise.all(requests);

   const flattenedPokemon = getPokemon.flat();

   console.log(flattenedPokemon.length, "flattenedPokemon");

   const uniquePokemon = flattenedPokemon.reduce((acc, curr) => {
      const existingPokemon = acc.find(
         (pokemon: any) => pokemon.title === curr.title,
      );
      if (!existingPokemon) {
         acc.push(curr);
      }
      return acc;
   }, []);

   console.log(uniquePokemon.length, "uniquePokemon");

   try {
      await Promise.all(
         uniquePokemon.map(async (row: any) => {
            try {
               const existingPokemon = await payload.find({
                  collection: "pokemon",
                  where: { name: { equals: row?.title } },
               });

               if (existingPokemon.docs.length > 0) {
                  payload.logger.info(
                     `Document already exists for ${row?.title}`,
                  );
                  return;
               }

               const mainImage =
                  row.field_pokemon_image &&
                  (await fetch(
                     `https://pogo.gamepress.gg/${row.field_pokemon_image}`,
                  )
                     .then((response) => response.blob())
                     .then(async (blob) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const ext = path
                           .extname(row.field_pokemon_image)
                           .slice(1);

                        const imageFile = {
                           data: buffer,
                           mimetype: blob.type,
                           name: `${manaSlug(row?.title)}-main.${ext}`,
                           size: blob.size,
                        };

                        return await payload.create({
                           collection: "images",
                           data: {
                              id: `${manaSlug(row?.title)}-main`,
                              createdBy: "643fc4b599231b1364d3ae87",
                           },
                           file: imageFile,
                        });
                     })
                     .catch((error) => {
                        payload.logger.error(`Main Image failed to upload`);
                        console.log(row.title);
                        payload.logger.error(error);
                     }));

               const florkImage =
                  row.field_flork_image &&
                  (await fetch(
                     `https://pogo.gamepress.gg/${row.field_flork_image}`,
                  )
                     .then((response) => response.blob())
                     .then(async (blob) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const ext = path
                           .extname(row.field_flork_image)
                           .slice(1);

                        const imageFile = {
                           data: buffer,
                           mimetype: blob.type,
                           name: `${manaSlug(row?.title)}-flork.${ext}`,
                           size: blob.size,
                        };

                        return await payload.create({
                           collection: "images",
                           data: {
                              id: `${manaSlug(row?.title)}-flork`,
                              createdBy: "643fc4b599231b1364d3ae87",
                           },
                           file: imageFile,
                        });
                     })
                     .catch((error) => {
                        payload.logger.error(`Flork Image failed to upload`);
                        console.log(row.title);
                        payload.logger.error(error);
                     }));

               const goImage =
                  row.field_pokemon_go_image &&
                  (await fetch(
                     `https://pogo.gamepress.gg/${row.field_pokemon_go_image}`,
                  )
                     .then((response) => response.blob())
                     .then(async (blob) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const ext = path
                           .extname(row.field_pokemon_go_image)
                           .slice(1);

                        const imageFile = {
                           data: buffer,
                           mimetype: blob.type,
                           name: `${manaSlug(row?.title)}-go.${ext}`,
                           size: blob.size,
                        };

                        return await payload.create({
                           collection: "images",
                           data: {
                              id: `${manaSlug(row?.title)}-go`,
                              createdBy: "643fc4b599231b1364d3ae87",
                           },
                           file: imageFile,
                        });
                     })
                     .catch((error) => {
                        payload.logger.error(`GO Image failed to upload`);
                        console.log(row.title);
                        payload.logger.error(error);
                     }));

               const goShinyImage =
                  row.field_pokemon_go_shiny_image &&
                  (await fetch(
                     `https://pogo.gamepress.gg/${row.field_pokemon_go_shiny_image}`,
                  )
                     .then((response) => response.blob())
                     .then(async (blob) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const ext = path
                           .extname(row.field_pokemon_go_shiny_image)
                           .slice(1);

                        const imageFile = {
                           data: buffer,
                           mimetype: blob.type,
                           name: `${manaSlug(row?.title)}-go-shiny.${ext}`,
                           size: blob.size,
                        };

                        return await payload.create({
                           collection: "images",
                           data: {
                              id: `${manaSlug(row?.title)}-go-shiny`,
                              createdBy: "643fc4b599231b1364d3ae87",
                           },
                           file: imageFile,
                        });
                     })
                     .catch((error) => {
                        payload.logger.error(`Shiny Image failed to upload`);
                        console.log(row.title);
                        payload.logger.error(error);
                     }));

               const shuffleImage =
                  row.field_shuffle_sprites &&
                  (await fetch(
                     `https://pogo.gamepress.gg/${row.field_shuffle_sprites}`,
                  )
                     .then((response) => response.blob())
                     .then(async (blob) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const ext = path
                           .extname(row.field_shuffle_sprites)
                           .slice(1);

                        const imageFile = {
                           data: buffer,
                           mimetype: blob.type,
                           name: `${manaSlug(row?.title)}-shuffle${ext}`,
                           size: blob.size,
                        };

                        return await payload.create({
                           collection: "images",
                           data: {
                              id: `${manaSlug(row?.title)}-shuffle`,
                              createdBy: "643fc4b599231b1364d3ae87",
                           },
                           file: imageFile,
                        });
                     })
                     .catch((error) => {
                        payload.logger.error(`Shuffle Image failed to upload`);
                        console.log(row.title);
                        payload.logger.error(error);
                     }));

               const purifiedFastMoves =
                  row.field_purified_fast_moves &&
                  row.field_purified_fast_moves.split(",");

               const purifiedChargeMoves =
                  row.field_purified_charge_moves &&
                  row.field_purified_charge_moves.split(",");

               const fastMoves =
                  row.field_primary_moves && row.field_primary_moves.split(",");
               const chargeMoves =
                  row.field_secondary_moves &&
                  row.field_secondary_moves.split(",");

               const eliteFastMoves =
                  row.field_elite_fast_moves &&
                  row.field_elite_fast_moves.split(",");

               const eliteChargeMoves =
                  row.field_elite_charge_moves &&
                  row.field_elite_charge_moves.split(",");

               const exclusiveFastMoves =
                  row.field_exclusive_quick_moves &&
                  row.field_exclusive_quick_moves.split(",");
               const exclusiveChargeMoves =
                  row.field_exclusive_charge_moves &&
                  row.field_exclusive_charge_moves.split(",");

               const legacyFastMoves =
                  row.field_legacy_quick_moves &&
                  row.field_legacy_quick_moves.split(",");
               const legacyChargeMoves =
                  row.field_legacy_charge_moves &&
                  row.field_legacy_charge_moves.split(",");

               const fMoves = [
                  ...(fastMoves &&
                     fastMoves.map((row: any) => {
                        return { move: manaSlug(row) };
                     })),
                  ...(eliteFastMoves &&
                     eliteFastMoves.map((row: any) => {
                        return { category: "elite", move: manaSlug(row) };
                     })),
                  ...(exclusiveFastMoves &&
                     exclusiveFastMoves.map((row: any) => {
                        return { category: "exclusive", move: manaSlug(row) };
                     })),
                  ...(legacyFastMoves &&
                     legacyFastMoves.map((row: any) => {
                        return { category: "legacy", move: manaSlug(row) };
                     })),
                  ...(purifiedFastMoves &&
                     purifiedFastMoves.map((row: any) => {
                        return { category: "purified", move: manaSlug(row) };
                     })),
               ];
               const cMoves = [
                  ...(chargeMoves &&
                     chargeMoves.map((row: any) => {
                        return { move: manaSlug(row) };
                     })),
                  ...(eliteChargeMoves &&
                     eliteChargeMoves.map((row: any) => {
                        return { category: "elite", move: manaSlug(row) };
                     })),
                  ...(exclusiveChargeMoves &&
                     exclusiveChargeMoves.map((row: any) => {
                        return { category: "exclusive", move: manaSlug(row) };
                     })),
                  ...(legacyChargeMoves &&
                     legacyChargeMoves.map((row: any) => {
                        return { category: "legacy", move: manaSlug(row) };
                     })),
                  ...(purifiedChargeMoves &&
                     purifiedChargeMoves.map((row: any) => {
                        return { category: "purified", move: manaSlug(row) };
                     })),
               ];

               const specialEvolutionRequirements = async () => {
                  if (row.field_evolution_requirements) {
                     const { docs } = await payload.find({
                        collection: "evolution-requirements",
                        where: {
                           name: {
                              equals: row.field_evolution_requirements,
                           },
                        },
                     });
                     console.log(docs);
                     return docs[0].id;
                  }
               };

               const evolutionRequirements = async () => {
                  if (row.field_evolution_item) {
                     const { docs } = await payload.find({
                        collection: "evolution-requirements",
                        where: {
                           name: {
                              equals: row.field_evolution_item,
                           },
                        },
                     });

                     console.log(docs);
                     return docs[0].id;
                  }
               };

               const isShadow =
                  row.field_shadow_pokemon_ &&
                  row.field_shadow_pokemon_ == "False"
                     ? false
                     : true;

               const megaPokemon =
                  row.field_mega_evolutions_list &&
                  row.field_mega_evolutions_list.split(",").map((row: any) => {
                     return manaSlug(row);
                  });

               const megaEnergyRequirements = () => {
                  if (
                     row.field_mega_evolution_unlock &&
                     row.field_mega_energy_cost
                  ) {
                     if (
                        row.field_mega_evolution_unlock == "100" &&
                        row.field_mega_energy_cost == "20"
                     )
                        return "_100_20";
                     if (
                        row.field_mega_evolution_unlock == "200" &&
                        row.field_mega_energy_cost == "40"
                     )
                        return "_200_40";
                     if (
                        row.field_mega_evolution_unlock == "300" &&
                        row.field_mega_energy_cost == "40"
                     )
                        return "_300_40";
                     if (
                        row.field_mega_evolution_unlock == "300" &&
                        row.field_mega_energy_cost == "60"
                     )
                        return "_300_60";
                     if (
                        row.field_mega_evolution_unlock == "400" &&
                        row.field_mega_energy_cost == "80"
                     )
                        return "_400_80";
                  }
               };

               const purificationCost = () => {
                  if (
                     row.field_purification_candy_cost &&
                     row.field_purification_stardust_cost
                  ) {
                     if (
                        row.field_purification_candy_cost == "1" &&
                        row.field_purification_stardust_cost == "1000"
                     )
                        return "_1_1";
                     if (
                        row.field_purification_candy_cost == "3" &&
                        row.field_purification_stardust_cost == "3000"
                     )
                        return "_3_3";
                     if (
                        row.field_purification_candy_cost == "5" &&
                        row.field_purification_stardust_cost == "5000"
                     )
                        return "_5_5";
                     if (
                        row.field_purification_candy_cost == "20" &&
                        row.field_purification_stardust_cost == "20000"
                     )
                        return "_20_20";
                  }
                  return;
               };

               const attackerRatings = () => {
                  if (row.gptier_attackerstierlist) {
                     if (row.gptier_attackerstierlist >= 10.0) return "s";
                     if (
                        row.gptier_attackerstierlist >= 9.0 &&
                        row.gptier_attackerstierlist < 10.0
                     )
                        return "a_plus";
                     if (
                        row.gptier_attackerstierlist >= 8.0 &&
                        row.gptier_attackerstierlist < 9.0
                     )
                        return "a";
                     if (
                        row.gptier_attackerstierlist >= 7.0 &&
                        row.gptier_attackerstierlist < 8.0
                     )
                        return "b_plus";
                     if (
                        row.gptier_attackerstierlist >= 6.0 &&
                        row.gptier_attackerstierlist < 7.0
                     )
                        return "b";
                     if (
                        row.gptier_attackerstierlist >= 5.0 &&
                        row.gptier_attackerstierlist < 6.0
                     )
                        return "c";
                  }
                  return undefined;
               };

               const raidBossTier = () => {
                  if (row.field_raid_boss_tier) {
                     if (row.field_raid_boss_tier == "1") return "_1";
                     if (row.field_raid_boss_tier == "2") return "_2";
                     if (row.field_raid_boss_tier == "3") return "_3";
                     if (row.field_raid_boss_tier == "4") return "_4";
                     if (row.field_raid_boss_tier == "5") return "_5";
                     if (row.field_raid_boss_tier == "6") return "_6";
                     if (row.field_raid_boss_tier == "Elite") return "elite";
                     if (row.field_raid_boss_tier == "Legendary Mega")
                        return "legendary_Mega";
                     if (row.field_raid_boss_tier == "Mega") return "mega";
                  }
                  return;
               };

               const secondChargeMoveCost = () => {
                  if (row.field_pokemon_second_move_cost) {
                     if (
                        row.field_pokemon_second_move_cost ==
                        "10,000 Stardust + 25 Candy"
                     )
                        return "_10_25";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "12,000 Stardust + 30 Candy"
                     )
                        return "_12_30";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "50,000 Stardust + 50 Candy"
                     )
                        return "_50_50";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "60,000 Stardust + 60 Candy"
                     )
                        return "_60_60";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "75,000 Stardust + 50 Candy"
                     )
                        return "_75_50";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "75,000 Stardust + 75 Candy"
                     )
                        return "_75_75";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "90,000 Stardust + 90 Candy"
                     )
                        return "_90_90";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "100,000 Stardust + 100 Candy"
                     )
                        return "_100_100";
                     if (
                        row.field_pokemon_second_move_cost ==
                        "120,000 Stardust + 120 Candy"
                     )
                        return "_120_120";
                  }
                  return;
               };

               const buddyDistance = () => {
                  if (row.field_buddy_distance_requirement) {
                     if (row.field_buddy_distance_requirement == "1 km")
                        return "_1";
                     if (row.field_buddy_distance_requirement == "3 km")
                        return "_3";
                     if (row.field_buddy_distance_requirement == "5 km")
                        return "_5";
                     if (row.field_buddy_distance_requirement == "20 km")
                        return "_20";
                  }
                  return;
               };

               const hatchDistance = () => {
                  if (row.field_pokemon_hatching_distance) {
                     if (row.field_pokemon_hatching_distance == "2 km")
                        return "_2";
                     if (row.field_pokemon_hatching_distance == "5 km")
                        return "_5";
                     if (row.field_pokemon_hatching_distance == "7 km")
                        return "_7";
                     if (row.field_pokemon_hatching_distance == "10 km")
                        return "_10";
                     if (row.field_pokemon_hatching_distance == "20 km")
                        return "_20";
                  }
                  return;
               };

               function allReplace(
                  str: string,
                  obj: { [key: string]: string },
               ) {
                  for (const x in obj) {
                     // @ts-ignore
                     str = str.replace(new RegExp(x, "g"), obj[x]);
                  }
                  return str;
               }

               const shinyAcquireMethod = () => {
                  if (row.field_how_shiny_is_acquired) {
                     console.log(row.field_how_shiny_is_acquired, "debug this");
                     const makeArray =
                        row.field_how_shiny_is_acquired.split(",");

                     const result = makeArray.map((row: any) => {
                        return allReplace(row, {
                           Eggs: "eggs",
                           Evolution: "evolution",
                           "Mega evolution": "mega_evolution",
                           "Mystery Box": "mystery_box",
                           Raids: "raids",
                           "Research Encounter": "research_encounter",
                           "Rocket Grunts": "rocket_grunts",
                           "Rocket Leader Battles": "rocket_leader_battles",
                           Wild: "wild",
                        });
                     });
                     console.log(result);
                     return result;
                  }
                  return undefined;
               };

               const generation = () => {
                  if (row.field_pokemon_generation) {
                     if (row.field_pokemon_generation == "Generation 1")
                        return "_1";
                     if (row.field_pokemon_generation == "Generation 2")
                        return "_2";
                     if (row.field_pokemon_generation == "Generation 3")
                        return "_3";
                     if (row.field_pokemon_generation == "Generation 4")
                        return "_4";
                     if (row.field_pokemon_generation == "Generation 5")
                        return "_5";
                     if (row.field_pokemon_generation == "Generation 6")
                        return "_6";
                     if (row.field_pokemon_generation == "Generation 7")
                        return "_7";
                     if (row.field_pokemon_generation == "Generation 8")
                        return "_8";
                     if (row.field_pokemon_generation == "Generation 9")
                        return "_9";
                  }
                  return;
               };

               const ratings = {
                  ...(row.gptier_attackerstierlist &&
                     row.gptier_attackerstierlist != "0.0" && {
                        attackerRating: attackerRatings(),
                     }),
                  ...(row.gptier_greatleaguetierlist &&
                     row.gptier_greatleaguetierlist != "0.0" && {
                        greatLeagueRating: `_${row.gptier_greatleaguetierlist.replace(
                           ".",
                           "_",
                        )}`,
                     }),
                  ...(row.gptier_ultraleaguetierlist &&
                     row.gptier_ultraleaguetierlist != "0.0" && {
                        ultraLeagueRating: `_${row.gptier_ultraleaguetierlist.replace(
                           ".",
                           "_",
                        )}`,
                     }),
                  ...(row.gptier_masterleaguetierlist &&
                     row.gptier_masterleaguetierlist != "0.0" && {
                        masterLeagueRating: `_${row.gptier_masterleaguetierlist.replace(
                           ".",
                           "_",
                        )}`,
                     }),
               };

               const type =
                  row.field_pokemon_type &&
                  row.field_pokemon_type.split(",").map((row: any) => {
                     return manaSlug(row);
                  });

               await payload.create({
                  collection: "pokemon",
                  data: {
                     id: manaSlug(row?.title),
                     name: row?.title,
                     slug: manaSlug(row?.title),
                     icon: mainImage.id,
                     number: row.field_pokemon_number,
                     baseAttack: row.field_base_attack,
                     baseDefense: row.field_base_defense,
                     baseStamina: row.field_base_stamina,
                     specialEvolutionRequirements:
                        await specialEvolutionRequirements(),
                     evolutionRequirements: await evolutionRequirements(),
                     isShadow,
                     // shadowPokemon:
                     //    row.field_shadow_pokemon &&
                     //    manaSlug(row.field_shadow_pokemon),
                     isMega:
                        row.field_mega_pokemon_ &&
                        row.field_mega_pokemon_ == "True"
                           ? true
                           : false,
                     // megaPokemon,
                     images: {
                        florkImage: florkImage ? florkImage.id : undefined,
                        goImage: goImage ? goImage.id : undefined,
                        goShinyImage: goShinyImage
                           ? goShinyImage.id
                           : undefined,
                        shuffleImage: shuffleImage
                           ? shuffleImage.id
                           : undefined,
                     },
                     type,
                     maleRate: row.field_male_percentage,
                     femaleRate: row.field_female_percentage,
                     weight: row.field_weight,
                     height: row.field_pokemon_height,
                     isNestingSpecie:
                        row.field_nesting_specie_ &&
                        row.field_nesting_specie_ == "True"
                           ? true
                           : false,
                     fleeRate: row.field_flee_rate,
                     catchRate: row.field_capture_rate,
                     megaEnergyRequirements: megaEnergyRequirements(),
                     ratings,
                     fastMoves: fMoves,
                     chargeMoves: cMoves,
                     raidBossTier: raidBossTier(),
                     secondChargeMoveCost: secondChargeMoveCost(),
                     buddyDistance: buddyDistance(),
                     hatchDistance: hatchDistance(),
                     purificationCost: purificationCost(),
                     shinyAcquireMethod: shinyAcquireMethod(),
                     generation: generation(),
                  },
               });
               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);
               console.log(row.gptier_greatleaguetierlist);
               console.log(row.title);
               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}
