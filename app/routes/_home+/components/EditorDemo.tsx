import { initialValue } from "~/routes/_editor+/core/utils";
import { ManaEditor } from "~/routes/_editor+/editor";

export function EditorDemo() {
   return (
      <div className="min-h-[216px] bg-3 p-5 rounded-xl border border-color-sub shadow-sm shadow-1">
         <ManaEditor defaultValue={initialValue()} />
      </div>
   );
}
