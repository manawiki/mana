import type { CollectionBeforeChangeHook } from "payload/types";

export const movesBeforeChangeHook: CollectionBeforeChangeHook = async ({
   req: { payload },
   data,
}) => {
   try {
      if (data.category == "dynamax") return data;

      const pvePower = data?.pve?.power;
      const duration = data?.pve?.duration;

      const damagePerSecond = (pvePower * (1 / duration)).toFixed(2);

      const dodgeWindow = (
         data?.pve?.damageWindowEnd - data?.pve?.damageWindowStart
      ).toFixed(2);

      const energyPerSecond =
         data.category == "fast"
            ? (
                 data?.pve?.energyDeltaFast *
                 (pvePower == 0
                    ? 1 / duration
                    : (damagePerSecond as unknown as number) / pvePower)
              ).toFixed(2)
            : undefined;

      const damagePerEnergyPVE =
         data.category == "charge"
            ? Math.abs(data?.pve?.power / data?.pve?.energyDeltaCharge).toFixed(
                 2,
              )
            : undefined;

      const damagePerEnergyPVP =
         data.category == "charge"
            ? Math.abs(data?.pvp?.power / data?.pvp?.energyDeltaCharge).toFixed(
                 2,
              )
            : undefined;

      const damagePerEnergyDamagePerSecond =
         data.category == "charge"
            ? Math.abs(
                 //@ts-ignore
                 damagePerEnergyPVE * damagePerSecond,
              ).toFixed(2)
            : undefined;

      const updatedMoveData = {
         ...data,
         pve: {
            ...data.pve,
            ...(damagePerSecond && {
               damagePerSecond,
            }),
            ...(dodgeWindow && {
               dodgeWindow,
            }),
            ...(damagePerEnergyDamagePerSecond && {
               damagePerEnergyDamagePerSecond,
            }),
            ...(energyPerSecond && { energyPerSecond }),
            ...(damagePerEnergyPVE && {
               damagePerEnergy: damagePerEnergyPVE,
            }),
         },
         pvp: {
            ...data.pvp,
            ...(damagePerEnergyPVP && {
               damagePerEnergy: damagePerEnergyPVP,
            }),
         },
      };

      return updatedMoveData;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
