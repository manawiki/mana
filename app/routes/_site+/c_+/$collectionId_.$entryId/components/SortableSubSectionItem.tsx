import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";
import { useZorm } from "react-zorm";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { isProcessing } from "~/utils/form";

export const SubSectionUpdateSchema = z.object({
   collectionId: z.string(),
   name: z.string(),
   sectionId: z.string(),
   subSectionId: z.string(),
   type: z.enum(["editor", "customTemplate", "qna", "comments"]),
});

export function SortableSubSectionItem({
   subSection,
   fetcher,
}: {
   subSection: { id: string; name: string; type: string };
   fetcher: FetcherWithComponents<unknown>;
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
   } = useSortable({ id: subSection.id });

   const [isOpen, setIsOpen] = useState(false);

   const zo = useZorm("subSectionUpdate", SubSectionUpdateSchema);

   const disabled =
      isProcessing(fetcher.state) || zo.validation?.success === false;

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
         className="flex items-center gap-3 p-2 pl-[18px] pr-5 justify-between"
      >
         <Dialog
            className="relative"
            size="lg"
            onClose={setIsOpen}
            open={isOpen}
         >
            <fetcher.Form method="post" ref={zo.ref}>
               <FieldGroup>
                  <Field className="w-full">
                     <Label>Name</Label>
                     <Input
                        name={zo.fields.name()}
                        defaultValue={subSection.name}
                        type="text"
                     />
                  </Field>
                  <Field className="w-full">
                     <Label>Id</Label>
                     <Input
                        name={zo.fields.subSectionId()}
                        defaultValue={subSection.id}
                        type="text"
                     />
                  </Field>
                  <Field className="tablet:min-w-40">
                     <Label>Type</Label>
                     <Select
                        defaultValue={subSection.type}
                        name={zo.fields.type()}
                     >
                        <option value="editor">Editor</option>
                        <option value="customTemplate">Custom Template</option>
                        <option value="qna">Q&A</option>
                        <option value="comments">Comments</option>
                     </Select>
                  </Field>
                  <div className="flex items-center justify-end gap-8">
                     <Button
                        name="intent"
                        value="updateSection"
                        type="submit"
                        disabled={disabled}
                     >
                        Save
                     </Button>
                  </div>
               </FieldGroup>
            </fetcher.Form>
         </Dialog>
         <div className="flex items-center gap-2 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark450 hover:bg-white hover:shadow px-0.5 py-1.5 rounded-md",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon
                  title="Update order"
                  name="grip-vertical"
                  size={16}
                  className="text-1"
               />
            </div>
            <span className="text-sm pt-0.5">{subSection?.name}</span>
         </div>
         <div className="text-xs flex items-center gap-2">
            <span className="text-1 capitalize">{subSection.type}</span>
            <span className="size-1 rounded-full bg-zinc-300" />
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
               {subSection.id}
            </span>
         </div>
         <Button plain onClick={() => setIsOpen(true)}>
            <Icon className="text-1" name="more-horizontal" size={16} />
         </Button>
      </div>
   );
}
