import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { H2 } from "~/components";
import type { Move } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/$siteId.c_+/components/Entry";
import {
   customEntryMeta,
   fetchEntry,
} from "~/routes/_site+/$siteId.c_+/functions/entry";

import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "../classes";

export { customEntryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      rest: {
         depth: 1,
      },
   });

   return json({
      entry,
   });
}

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();

   // styles

   const move = entry.data as Move;

   const dpsPVE =
      move?.pve?.power &&
      move?.pve?.duration &&
      //@ts-ignore
      (move?.pve?.power / move?.pve?.pveCooldown).toFixed(2);

   const dpePVE =
      move?.pve?.power &&
      move?.pve?.energyDeltaCharge &&
      //@ts-ignore
      (move?.pve?.power / move?.pve?.pveEnergyDeltaCharge).toFixed(2);

   const dpePVP =
      move?.pvp?.power &&
      move?.pvp?.energyDeltaCharge &&
      Math.abs(move?.pvp?.power / move?.pvp?.energyDeltaCharge).toFixed(2);

   //@ts-ignore
   const dpe_dps = (dpsPVE * dpePVE).toFixed(2);

   const moveEffect =
      move.probability &&
      `${move.probability && move.probability * 100}% chance to ${
         move?.stageDelta && move?.stageDelta > 0 ? "increase" : "decrease"
      } ${move.stat}
      of ${move.subject} by ${
         move?.stageDelta ? Math.abs(move?.stageDelta) : ""
      } ${move.stageMax ? `- ${Math.abs(move.stageMax)}` : ""} stages`;

   return (
      <Entry>
         <section className={InfoBlock_Container}>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Category</div>
               <div className={`${InfoBlock_Content} capitalize`}>
                  {move.category}
               </div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Type</div>
               <div className={InfoBlock_Content}>{move.type?.name}</div>
            </div>
            {moveEffect ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Effect</div>
                  <div className={InfoBlock_Content}>{moveEffect}</div>
               </div>
            ) : undefined}
         </section>
         <H2 text="PvE Info" />
         <section className={InfoBlock_Container}>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Base Power</div>
               <div className={InfoBlock_Content}>{move.pve?.power}</div>
            </div>
            {dpsPVE ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Damage Per Second</div>
                  <div className={InfoBlock_Content}>{dpsPVE}</div>
               </div>
            ) : undefined}
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Damage Window</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.damageWindowEnd} seconds
               </div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Cooldown</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.duration} seconds
               </div>
            </div>
            {move.pve?.energyDeltaCharge ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Charge Energy</div>
                  <div className={InfoBlock_Content}>
                     {move.pve?.energyDeltaCharge}
                  </div>
               </div>
            ) : undefined}
            {move.pve?.energyDeltaFast ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Fast Energy</div>
                  <div className={InfoBlock_Content}>
                     {move.pve?.energyDeltaFast}
                  </div>
               </div>
            ) : undefined}
            {dpePVE ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Damage Per Energy</div>
                  <div className={InfoBlock_Content}>{dpePVE}</div>
               </div>
            ) : undefined}
            {dpe_dps ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>DPE*DPS</div>
                  <div className={InfoBlock_Content}>{dpe_dps}</div>
               </div>
            ) : undefined}
         </section>
         <H2 text="PvP Info" />
         <section className={InfoBlock_Container}>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Base Power</div>
               <div className={InfoBlock_Content}>{move.pvp?.power}</div>
            </div>
            {move.pvp?.energyDeltaCharge ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Charge Energy</div>
                  <div className={InfoBlock_Content}>
                     {move.pvp?.energyDeltaCharge}
                  </div>
               </div>
            ) : undefined}
            {move.pvp?.secondDurationFast ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Duration (seconds)</div>
                  <div className={InfoBlock_Content}>
                     {move.pvp?.secondDurationFast}
                  </div>
               </div>
            ) : undefined}
            {dpePVP ? (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Damage per Energy</div>
                  <div className={InfoBlock_Content}>{dpePVP}</div>
               </div>
            ) : undefined}
         </section>
      </Entry>
   );
}
