import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { MobileTray } from "~/routes/_site+/_components/MobileTray";

import { AddSubSection } from "./AddSubSection";
import { SectionType } from "./SectionType";
import { SubSectionList } from "./SubSectionList";
import { UpdateSection } from "./UpdateSection";
import type { Section } from "../../_components/List";

export function SortableSectionItem({
   section,
   collection,
   setAllSections,
}: {
   section: Section;
   collection: Collection | undefined;
   setAllSections: (sections: any) => void;
}) {
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

   const [isOpen, setIsOpen] = useState(false);

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
         <MobileTray
            shouldScaleBackground
            direction="right"
            onOpenChange={setIsOpen}
            open={isOpen}
            dismissible={false}
         >
            <>
               <UpdateSection
                  setAllSections={setAllSections}
                  section={section}
                  collection={collection}
               />
               <SubSectionList section={section} collection={collection} />
               <AddSubSection section={section} collection={collection} />
            </>
         </MobileTray>
         <div className="flex items-center gap-2.5 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark450 hover:bg-white hover:shadow px-1 py-1.5 rounded-md touch-none",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" size={16} className="text-1" />
            </div>
            <span className="text-sm font-semibold">{section?.name}</span>
         </div>
         <div className="flex items-center -space-x-1">
            {section?.subSections?.map((subSection: any) => (
               <SectionType key={subSection.name} type={subSection.type} />
            ))}
         </div>
         <Button plain onClick={() => setIsOpen(true)}>
            <Icon className="text-1" name="more-horizontal" size={16} />
         </Button>
      </div>
   );
}
