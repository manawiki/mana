import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "~/_custom/classes";
import type { Move } from "~/db/payload-custom-types";

import { ChargeBar } from "../../_site.c.pokemon+/components/ChargeBar";

export function MovesMain({ data: move }: { data: Move }) {
   const moveEffect =
      move.probability &&
      `${move.probability && move.probability * 100}% chance to ${
         move?.stageDelta && move?.stageDelta > 0 ? "increase" : "decrease"
      } ${move.stat}
    of ${move.subject} by ${
       move?.stageDelta ? Math.abs(move?.stageDelta) : ""
    } ${move.stageMax ? `- ${Math.abs(move.stageMax)}` : ""} stages`;
   return (
      <section className={InfoBlock_Container}>
         <div className={InfoBlock_Row}>
            <div className={InfoBlock_Label}>Category</div>
            <div className={`${InfoBlock_Content} capitalize`}>
               {move.category}
            </div>
         </div>
         {move.category == "charge" ? (
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Charge Energy</div>
               <div className={InfoBlock_Content}>
                  <ChargeBar value={move?.pve?.energyDeltaCharge} />
               </div>
            </div>
         ) : undefined}
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
   );
}
