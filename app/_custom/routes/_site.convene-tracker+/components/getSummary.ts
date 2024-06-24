import type { RollData } from "../($convene)";

export type GachaSummaryType = {
   cardPoolType?: string;
   total: number;
   resonators: number;
   weapons: number;
   fiveStars: RollData[];
   fourStars: RollData[];
   pity5: number;
   pity4: number;
   dates: Record<string, number>;
};

export function getSummary(
   gacha: { data: RollData[] },
   cardPoolType: string = "1",
) {
   let total = 0,
      resonators = 0,
      weapons = 0,
      fiveStars: RollData[] = [],
      fourStars: RollData[] = [],
      dates: Record<string, number> = {};

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
            pity5++;
            pity4 = 1;
            break;
         default:
            pity5++;
            pity4++;
            break;
      }

      // increment date count
      const date = roll?.time.split(" ")[0];

      if (date) {
         dates[date] = (dates[date] || 0) + 1;
      }
   }

   return {
      cardPoolType,
      total,
      resonators,
      weapons,
      fiveStars,
      fourStars,
      pity5,
      pity4,
      dates,
   } satisfies GachaSummaryType;
}
