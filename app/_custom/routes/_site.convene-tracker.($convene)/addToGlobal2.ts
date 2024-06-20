import type { GachaSummaryType } from "./getSummary";

export type GlobalSummaryType = {
   cardPoolType: string;
   total: number;
   players: number;
   resonators: number;
   weapons: number;
   pities: Record<string, number>;
   dates: Record<string, number>;
   fiveStar: number;
   fourStar: number;
   fiveStars: Record<string, Record<string, Record<string, number>>>;
};

export function toGlobal(summary: GachaSummaryType) {
   let { cardPoolType = "1", total, resonators, weapons, dates } = summary;

   let players = 1,
      pities: Record<string, number> = {},
      fiveStar = summary.fiveStars.length,
      fourStar = summary.fourStars.length,
      fiveStars: Record<string, Record<string, Record<string, number>>> = {};

   // digest summary.fiveStars
   // five stars should be in the shape of { dates[]: { resourceIds[]: { pities[]: count } } }
   for (let i = 0; i < summary.fiveStars.length; i++) {
      const { resourceId, pity, time } = summary.fiveStars[i]!;

      const date = time.split(" ")[0]!;

      if (pity) {
         pities[pity] ? pities[pity]++ : (pities[pity] = 1);

         if (!fiveStars[date]) fiveStars[date] = {};
         if (!fiveStars[date][resourceId]) fiveStars[date][resourceId] = {};

         fiveStars[date][resourceId][pity]
            ? fiveStars[date][resourceId][pity]++
            : (fiveStars[date][resourceId][pity] = 1);
      }
   }

   return {
      cardPoolType,
      total,
      players,
      resonators,
      weapons,
      pities,
      dates,
      fiveStar,
      fourStar,
      fiveStars,
   } satisfies GlobalSummaryType;
}

// This function drills down the object and adds up the values of the same keys.
export function addAandB<T>(a: Record<string, any>, b: Record<string, any>) {
   const result: Record<string, any> = { ...a };

   Object.entries(b).forEach(([key, value]) => {
      if (!a[key]) result[key] = value;
      else {
         switch (typeof value) {
            case "object":
               result[key] = addAandB(a[key], value);
               break;
            case "number":
               result[key] = (a[key] || 0) + (value || 0);
               break;
            default:
               result[key] = value || a[key];
               break;
         }
      }
   });

   return result as T;
}

// This function drills down the object and subtracts the values of the same keys.
export function subAandB<T>(a: Record<string, any>, b: Record<string, any>) {
   const result: Record<string, any> = { ...a };

   Object.entries(b).forEach(([key, value]) => {
      if (!a[key]) result[key] = value;
      else {
         switch (typeof value) {
            case "object":
               result[key] = subAandB(a[key], value);
               break;
            case "number":
               result[key] = (a[key] || 0) - (value || 0);
               break;
            default:
               result[key] = value || a[key];
               break;
         }
      }
   });

   return result as T;
}
