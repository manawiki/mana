import { useEffect } from "react";

import { Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import type { Section } from "../../_components/List";

export function SectionCommandBar({
   collection,
   isChanged,
   setIsChanged,
   allSections,
   setAllSections,
}: {
   collection: Collection | undefined;
   isChanged: boolean;
   setIsChanged: (value: boolean) => void;
   allSections: Section[] | undefined | null;
   setAllSections: (sections: any) => void;
}) {
   const fetcher = useFetcher();

   const disabled = isProcessing(fetcher.state);
   const saving = isAdding(fetcher, "updateSectionOrder");

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   return (
      <Transition
         show={isChanged}
         enter="transition ease-out duration-200"
         enterFrom="opacity-0 translate-y-1"
         enterTo="opacity-100 translate-y-0"
         leave="transition ease-in duration-200"
         leaveFrom="opacity-100 translate-y-0"
         leaveTo="opacity-0 translate-y-1"
         className="w-full max-tablet:inset-x-0 max-tablet:px-3 z-30 fixed bottom-8 tablet:w-[728px]"
      >
         <div
            className="mt-6 flex items-center gap-5 justify-between dark:bg-dark450 bg-zinc-100
   border dark:border-zinc-500 border-zinc-400 shadow-lg dark:shadow-zinc-900/50 rounded-2xl p-3"
         >
            <button
               type="button"
               onClick={() => {
                  setIsChanged(false);
                  setAllSections(collection?.sections);
               }}
               className="text-sm h-8 font-semibold cursor-pointer rounded-lg
      dark:hover:bg-dark500 gap-2 flex items-center justify-center pl-2 pr-3.5"
            >
               <Icon
                  title="Reset"
                  size={14}
                  name="refresh-ccw"
                  className="dark:text-zinc-500"
               />
               <span>Reset</span>
            </button>
            <input type="hidden" name="intent" value="saveSettings" />
            <Button
               type="submit"
               color="blue"
               className="cursor-pointer !font-bold text-sm h-8 w-20"
               disabled={!isChanged || disabled}
               onClick={() =>
                  fetcher.submit(
                     {
                        collectionId: collection?.id ?? "",
                        sections: JSON.stringify(allSections),
                        intent: "updateSectionOrder",
                     },
                     {
                        method: "POST",
                        action: "/collections/sections",
                     },
                  )
               }
            >
               {saving ? <DotLoader /> : "Save"}
            </Button>
         </div>
      </Transition>
   );
}
