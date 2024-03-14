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
      mongoURL:
         `${process.env.MONGODB_URI}/${process.env.CUSTOM_DB_NAME}` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

const data = require("./moves.json");

async function mapper() {
   console.log(data.length);
   try {
      await Promise.all(
         data.map(async (row: any) => {
            try {
               await payload.create({
                  collection: "moves",
                  data: {
                     id: manaSlug(row?.title),
                     name: row?.title,
                     slug: manaSlug(row?.title),
                     icon: row?.move_type.toLowerCase(),
                     type: row?.move_type.toLowerCase(),
                     category:
                        row?.move_category == "Fast Move" ? "fast" : "charge",
                     pve: {
                        power: row?.power, //
                        duration: row?.cooldown, //
                        damageWindowStart: row?.damage_window, //
                        damageWindowEnd: row?.field_damage_window_end,
                        energyDeltaFast: row?.energy_gain,
                        energyDeltaCharge: row?.energy_cost
                           ? Math.abs(row?.energy_cost)
                           : undefined,
                     },
                     pvp: {
                        power: row?.pvp_fast_power
                           ? row?.pvp_fast_power
                           : row?.pvp_charge_damage, //
                        energyDeltaFast: row?.pvp_fast_energy, //
                        energyDeltaCharge: row?.pvp_charge_energy, //
                        secondDurationFast: row?.pvp_fast_duration_seconds, //
                        turnDurationFast: row?.pvp_fast_duration, //
                     },
                     probability: row?.probability, //
                     stageDelta: row?.stage_delta, //
                     stageMax: row?.field_stage_delta_max,
                     stat: row?.stat
                        ? row?.stat == "Atk, Def"
                           ? ["atk", "def"]
                           : row?.stat?.toLowerCase()
                        : undefined,
                     subject: row?.subject
                        ? row?.subject?.toLowerCase()
                        : undefined, //
                  },
               });
               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(
                  `Document with title ${manaSlug(row?.title)}  failed to add`,
               );
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
