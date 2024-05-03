import type { Editor } from "slate";

import { normalizeAttributes } from "./normalize-attributes";
import { normalizeContent } from "./normalize-content";
import { normalizeSections } from "./normalize-sections";
import { normalizeTable } from "./normalize-table";
import { normalizeTd } from "./normalize-td";
import { normalizeTr } from "./normalize-tr";
import type { WithTableOptions } from "../options";

export function withNormalization<T extends Editor>(
   editor: T,
   options: WithTableOptions,
): T {
   if (!options.withNormalization) {
      return editor;
   }

   editor = normalizeAttributes(editor, options);
   editor = normalizeContent(editor, options);
   editor = normalizeSections(editor, options);
   editor = normalizeTable(editor, options);
   editor = normalizeTd(editor, options);
   editor = normalizeTr(editor, options);

   return editor;
}
