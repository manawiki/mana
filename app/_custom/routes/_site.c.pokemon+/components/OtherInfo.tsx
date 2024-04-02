import type { Pokemon as PokemonType } from "~/db/payload-custom-types";

import { Label } from "./Label";
import {
   InfoBlock_Container,
   InfoBlock_Content,
   InfoBlock_Label,
   InfoBlock_Row,
} from "../../../classes";

export function OtherInfo({ data: pokemon }: { data: PokemonType }) {
   return (
      <>
         <div className={InfoBlock_Container}>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Purification Cost</div>
               <div className={InfoBlock_Content}>
                  <Label
                     fieldName="purificationCost"
                     value={pokemon.purificationCost}
                  />
               </div>
            </div>
            {pokemon.secondChargeMoveCost && (
               <div className={InfoBlock_Row}>
                  <div className={InfoBlock_Label}>Second Charge Move Cost</div>
                  <div className={InfoBlock_Content}>
                     <Label
                        fieldName="secondChargeMoveCost"
                        value={pokemon.secondChargeMoveCost}
                     />
                  </div>
               </div>
            )}
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Flee Rate</div>
               <div className={InfoBlock_Content}>{pokemon.fleeRate} %</div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Buddy Distance</div>
               <div className={InfoBlock_Content}>
                  <Label
                     fieldName="buddyDistance"
                     value={pokemon.buddyDistance}
                  />
               </div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Catch Rate</div>
               <div className={InfoBlock_Content}>{pokemon.catchRate} %</div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Female Ratio</div>
               <div className={InfoBlock_Content}>{pokemon.femaleRate} %</div>
            </div>
            <div className={InfoBlock_Row}>
               <div className={InfoBlock_Label}>Male Ratio</div>
               <div className={InfoBlock_Content}>{pokemon.maleRate} %</div>
            </div>
         </div>
      </>
   );
}
