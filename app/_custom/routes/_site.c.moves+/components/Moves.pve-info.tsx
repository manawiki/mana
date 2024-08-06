import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "~/_custom/classes";
import type { Move } from "~/db/payload-custom-types";

export function MovesPVEInfo({ data: move }: { data: Move }) {
   return (
      <section className={InfoBlock_Container}>
         <div className={InfoBlock_Row}>
            <div className={InfoBlock_Label}>Base Power</div>
            <div className={InfoBlock_Content}>{move.pve?.power}</div>
         </div>
         <div className={InfoBlock_Row}>
            <div className={InfoBlock_Label}>Damage Per Second</div>
            <div className={InfoBlock_Content}>{move.pve?.damagePerSecond}</div>
         </div>
         {move.pve?.energyPerSecond && (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Energy Per Second</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.energyPerSecond}
               </div>
            </div>
         )}
         <div className={InfoBlock_Row}>
            <div className={InfoBlock_Label}>Damage Window</div>
            <div className={InfoBlock_Content}>
               {move.pve?.damageWindowStart} seconds
            </div>
         </div>
         <div className={InfoBlock_Row}>
            <div className={InfoBlock_Label}>Cooldown</div>
            <div className={InfoBlock_Content}>
               {move.pve?.duration} seconds
            </div>
         </div>
         {move.pve?.energyDeltaFast ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Energy Delta</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.energyDeltaFast}
               </div>
            </div>
         ) : undefined}
         {move.pve?.damagePerEnergy ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Damage Per Energy</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.damagePerEnergy}
               </div>
            </div>
         ) : undefined}
         {move.pve?.damagePerEnergyDamagePerSecond ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>DPE*DPS</div>
               <div className={InfoBlock_Content}>
                  {move.pve?.damagePerEnergyDamagePerSecond}
               </div>
            </div>
         ) : undefined}
      </section>
   );
}
