import { useState, useEffect } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";

import { Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Switch, SwitchField } from "~/components/Switch";
import type { Collection } from "~/db/payload-types";
import { useDebouncedValue, useIsMount } from "~/utils/use-debounce";

import type { Section } from "./Sections";

export function SortableSectionItem({
   section,
   fetcher,
   collectionId,
}: {
   section: Section;
   fetcher: FetcherWithComponents<unknown>;
   collectionId: Collection["id"] | undefined;
}) {
   const sectionFields = {
      collectionId: collectionId ?? "",
      sectionId: section?.id,
   };

   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isSorting,
      transition,
      isDragging,
      setActivatorNodeRef,
   } = useSortable({ id: section.id });

   const isMount = useIsMount();

   const [sectionName, setSectionName] = useState(section?.name);

   const debouncedSectionName = useDebouncedValue(sectionName, 500);

   // useEffect(() => {
   //    if (!isMount) {
   //       fetcher.submit(
   //          {
   //             ...sectionFields,
   //             showTitle: titleVisibility ?? null,
   //             intent: "updateSection",
   //          },
   //          {
   //             method: "patch",
   //          },
   //       );
   //    }
   // }, [titleVisibility]);
   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               ...sectionFields,
               name: debouncedSectionName ?? "",
               intent: "updateSection",
            },
            { method: "patch" },
         );
      }
   }, [debouncedSectionName]);

   return (
      <div
         ref={setNodeRef}
         style={
            {
               transition: transition,
               transform: CSS.Transform.toString(transform),
               pointerEvents: isSorting ? "none" : undefined,
               opacity: isDragging ? 0 : 1,
            } as React.CSSProperties /* cast because of css variable */
         }
         {...attributes}
         className="flex items-center gap-3 p-2 justify-between"
      >
         <div className="flex items-center gap-2.5 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark400 hover:bg-zinc-100 px-0.5 py-1.5 rounded-md",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" size={14} className="text-1" />
            </div>
            <input
               required
               value={sectionName}
               onChange={(event) => setSectionName(event.target.value)}
               type="text"
               className="w-full bg-transparent font-semibold text-xs h-6 p-0 focus:border-0 focus:ring-0 border-0"
            />
         </div>
         <div className="text-xs text-zinc-400 dark:text-zinc-500 border-r border-color-sub pr-3">
            {section.id}
         </div>
         <SwitchField>
            <Label className="!text-xs text-1">Title</Label>
            <Switch
               defaultChecked={section?.showTitle}
               value="true"
               color="dark/white"
               // name={zo.fields.showTitle()}
            />
         </SwitchField>
      </div>
   );
}
