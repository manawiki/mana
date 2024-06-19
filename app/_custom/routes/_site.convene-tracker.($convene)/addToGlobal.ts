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
   fiveStars: Record<
      string,
      { pities: Record<string, number>; dates: Record<string, number> }
   >;
};

export function toGlobal(summary: GachaSummaryType) {
   let cardPoolType = summary.cardPoolType || "1",
      total = summary.total,
      players = 1,
      resonators = summary.resonators,
      weapons = summary.weapons,
      dates = summary.dates,
      pities: Record<string, number> = {},
      fiveStar = summary.fiveStars.length,
      fourStar = summary.fourStars.length,
      fiveStars: Record<
         string,
         { pities: Record<string, number>; dates: Record<string, number> }
      > = {};

   // digest summary.fiveStars
   for (let i = 0; i < summary.fiveStars.length; i++) {
      const { resourceId, pity, time } = summary.fiveStars[i]!;

      const date = time.split(" ")[0]!;

      if (pity) {
         pities[pity] ? pities[pity]++ : (pities[pity] = 1);

         if (fiveStars[resourceId]) {
            fiveStars[resourceId].pities && fiveStars[resourceId].pities[pity]
               ? fiveStars[resourceId].pities[pity]++
               : (fiveStars[resourceId].pities[pity] = 1);

            fiveStars[resourceId].dates && fiveStars[resourceId].dates[date]
               ? fiveStars[resourceId].dates[date]++
               : (fiveStars[resourceId].dates[date] = 1);
         } else {
            fiveStars[resourceId] = {
               pities: { [pity]: 1 },
               dates: { [date]: 1 },
            };
         }
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

// This function adds GlobalSummary a and b together
export function addGlobalSummary(a: GlobalSummaryType, b: GlobalSummaryType) {
   const cardPoolType = a.cardPoolType ?? b.cardPoolType;
   const total = (a.total || 0) + (b.total || 0);
   const players = (a.players || 0) + (b.players || 0);
   const resonators = (a.resonators || 0) + (b.resonators || 0);
   const weapons = (a.weapons || 0) + (b.weapons || 0);
   const fiveStar = (a.fiveStar || 0) + (b.fiveStar || 0);
   const fourStar = (a.fourStar || 0) + (b.fourStar || 0);

   //combine dates from a and b, if date exists in both, add them together
   const dates = addAandB(a.dates, b.dates);
   const pities = addAandB(a.pities, b.pities);

   const fiveStars = { ...a.fiveStars };

   for (const resourceId of Object.keys(b.fiveStars)) {
      !fiveStars[resourceId]
         ? (fiveStars[resourceId] = b.fiveStars[resourceId]!)
         : (fiveStars[resourceId] = {
              pities: addAandB(
                 fiveStars[resourceId].pities,
                 b.fiveStars[resourceId]!.pities,
              ),
              dates: addAandB(
                 fiveStars[resourceId].dates,
                 b.fiveStars[resourceId]!.dates,
              ),
           });
   }

   return {
      cardPoolType,
      total,
      players,
      resonators,
      weapons,
      dates,
      pities,
      fiveStar,
      fourStar,
      fiveStars,
   } satisfies GlobalSummaryType;
}

export function addAandB(
   a: Record<string, number>,
   b: Record<string, number> | undefined,
) {
   if (!b) return a;
   if (!a) return b;
   const dates = { ...a };
   for (const date of Object.keys(b)) {
      dates[date] = (dates[date] || 0) + (b[date] || 0);
   }
   return dates;
}

export function subAandB(
   a: Record<string, number>,
   b: Record<string, number> | undefined,
) {
   if (!b) return a;
   if (!a) return b;

   const dates = { ...a };
   for (const date of Object.keys(b)) {
      dates[date] = (dates[date] || 0) - (b[date] || 0);
   }
   return dates;
}

// This function subsracts GlobalSummary a from b
export function subGlobalSummary(a: GlobalSummaryType, b: GlobalSummaryType) {
   const cardPoolType = a.cardPoolType ?? b.cardPoolType;
   const total = (a.total || 0) - (b.total || 0);
   const players = (a.players || 0) - (b.players || 0);
   const resonators = (a.resonators || 0) - (b.resonators || 0);
   const weapons = (a.weapons || 0) - (b.weapons || 0);
   const fiveStar = (a.fiveStar || 0) - (b.fiveStar || 0);
   const fourStar = (a.fourStar || 0) - (b.fourStar || 0);
   //combine dates from a and b, if date exists in both, add them together
   const dates = subAandB(a.dates, b.dates);
   const pities = subAandB(a.pities, b.pities);

   const fiveStars = { ...a.fiveStars };

   for (const resourceId of Object.keys(b.fiveStars)) {
      !fiveStars[resourceId]
         ? (fiveStars[resourceId] = b.fiveStars[resourceId]!)
         : (fiveStars[resourceId] = {
              pities: subAandB(
                 fiveStars[resourceId].pities,
                 b.fiveStars[resourceId]!.pities,
              ),
              dates: subAandB(
                 fiveStars[resourceId].dates,
                 b.fiveStars[resourceId]!.dates,
              ),
           });
   }

   return {
      cardPoolType,
      total,
      players,
      resonators,
      weapons,
      fiveStar,
      fourStar,
      fiveStars,
      pities,
      dates,
   } satisfies GlobalSummaryType;
}
