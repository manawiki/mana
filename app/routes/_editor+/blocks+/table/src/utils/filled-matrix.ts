import type { Editor, Location } from "slate";

import { matrices } from "./matrices";
import type { NodeEntryWithContext } from "./types";

export function filledMatrix(
   editor: Editor,
   options: { at?: Location } = {},
): NodeEntryWithContext[][] {
   const filled: NodeEntryWithContext[][] = [];

   // Expand each section separately to avoid sections collapsing into each other.
   for (const matrix of matrices(editor, { at: options.at })) {
      const filledSection: NodeEntryWithContext[][] = [];

      for (let x = 0; x < matrix.length; x++) {
         if (!filledSection[x]) {
            filledSection[x] = [];
         }
         //@ts-ignore
         for (let y = 0, offset = 0; y < matrix[x].length; y++) {
            //@ts-ignore
            const [{ rowSpan = 1, colSpan = 1 }] = matrix[x][y];

            for (let c = 0, occupied = 0; c < colSpan + occupied; c++) {
               //@ts-ignore
               if (filledSection[x][y + c + offset]) {
                  occupied++;
                  continue;
               }

               for (let r = 0; r < rowSpan; r++) {
                  if (!filledSection[x + r]) {
                     filledSection[x + r] = [];
                  }
                  //@ts-ignore
                  filledSection[x + r][y + c + offset] = [
                     //@ts-ignore
                     matrix[x][y], // entry
                     {
                        rtl: c - occupied + 1,
                        ltr: colSpan - c + occupied,
                        ttb: r + 1,
                        btt: rowSpan - r,
                     },
                  ];
               }
            }
            offset += colSpan - 1;
         }
      }

      filled.push(...filledSection);
   }

   return filled;
}
