import type { SerializeFrom } from "@remix-run/node";

import type { ConveneType } from "~/db/payload-custom-types";

import type { loader, RollData } from "./route";



export type GachaSummary = {
    convene?: ConveneType;
    total: number;
    resonators: number;
    weapons: number;
    fiveStars: RollData[];
    fourStars: RollData[];
    fiveStarPity: number;
    fourStarPity: number;
 };
 
 export function getSummary({ gacha, convene }: SerializeFrom<typeof loader>) {

let total = 0, resonators = 0, weapons = 0, fiveStars: RollData[] = [], fourStars: RollData[] = [];        

 
    // use a for loop instead of forEach, work backwards from the last element in gacha.data
    let pity4 = 1; // 4* pity counter
    let pity5 = 1; // 5* pity counter
 
    for (let i = 1; i <= gacha.data.length; i++) {
       const roll = gacha.data[gacha.data.length - i];
       switch (roll?.resourceType) {
          case "Resonators":
             resonators++;
             total++;
             break;
          case "Weapons":
             weapons++;
             total++;
             break;
          default:
             console.log(i, "Unknown Resource Type: ", roll);
             total++;
             break;
       }
 
       switch (roll?.qualityLevel) {
          case 5:
             fiveStars.push({
                pity: pity5,
                ...roll,
             });
             pity5 = 1;
             pity4 = 1;
             break;
          case 4:
             fourStars.push({
                pity: pity4,
                ...roll,
             });
             pity4 = 1;
             break;
          default:
             pity5++;
             pity4++;
             break;
       }
    }

       // set average pity rate as fiveStarPity, which is average of roll.pity in summary.fiveStars
   const fiveStarPity = Math.floor(
    fiveStars.reduce(
       (acc: number, curr: RollData) => acc + (curr.pity ?? 80),
       0,
    ) / fiveStars.length || 80,
 );

 // set average pity rate as fourStarPity, which is average of roll.pity in summary.fourStars
 const fourStarPity = Math.floor(
    fourStars.reduce(
       (acc: number, curr: RollData) => acc + (curr.pity ?? 10),
       0,
    ) / fourStars.length || 10,
 );

 
    return {
        convene,
         total,
         resonators,
         weapons,
         fiveStars,
         fourStars,
         fiveStarPity,
         fourStarPity,         
    } satisfies GachaSummary;
 }
 