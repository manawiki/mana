import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "~/_custom/classes";
import type { Move } from "~/db/payload-custom-types";

export function MovesPVPInfo({ data: move }: { data: Move }) {
   return (
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
         {move.pvp?.turnDurationFast ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Turn Duration (seconds)</div>
               <div className={InfoBlock_Content}>
                  {move.pvp?.turnDurationFast}
               </div>
            </div>
         ) : undefined}
         {move.pvp?.secondDurationFast ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Cooldown (seconds)</div>
               <div className={InfoBlock_Content}>
                  {move.pvp?.secondDurationFast}
               </div>
            </div>
         ) : undefined}
         {move.pvp?.energyDeltaFast ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Energy Delta</div>
               <div className={InfoBlock_Content}>
                  {move.pvp?.energyDeltaFast}
               </div>
            </div>
         ) : undefined}
         {move.pvp?.damagePerEnergy ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Damage per Energy</div>
               <div className={InfoBlock_Content}>
                  {move.pvp?.damagePerEnergy}
               </div>
            </div>
         ) : undefined}
      </section>
   );
}
