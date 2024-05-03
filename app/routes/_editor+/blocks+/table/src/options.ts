import type { CustomTypes, ExtendedType, Location } from "slate";

import { BlockType } from "~/routes/_editor+/core/types";

type ElementType = ExtendedType<"Element", CustomTypes>["type"];

export interface WithTableOptions {
   blocks: {
      td: ElementType;
      th: ElementType;
      content: ElementType;
      tr: ElementType;
      table: ElementType;
      tbody: ElementType;
      tfoot: ElementType;
      thead: ElementType;
   };
   withDelete: boolean;
   withFragments: boolean;
   withInsertText: boolean;
   withNormalization: boolean;
   withSelection: boolean;
   withSelectionAdjustment: boolean;
}

export const DEFAULT_WITH_TABLE_OPTIONS = {
   blocks: {
      td: BlockType.TableCell,
      th: BlockType.TableHeaderCell,
      content: BlockType.TableContent,
      tr: BlockType.TableRow,
      table: BlockType.Table,
      tbody: BlockType.TableBody,
      tfoot: BlockType.TableFooter,
      thead: BlockType.TableHead,
   },
   withDelete: true,
   withFragments: true,
   withInsertText: true,
   withNormalization: true,
   withSelection: true,
   withSelectionAdjustment: true,
} as const satisfies WithTableOptions;

export interface InsertTableOptions {
   rows: number;
   cols: number;
   at?: Location;
}

export const DEFAULT_INSERT_TABLE_OPTIONS = {
   rows: 2,
   cols: 2,
} as const satisfies InsertTableOptions;
