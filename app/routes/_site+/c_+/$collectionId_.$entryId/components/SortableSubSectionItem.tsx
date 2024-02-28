import { useEffect, useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";
import { useZorm } from "react-zorm";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { isAdding, isProcessing } from "~/utils/form";

import { SubSectionSchema } from "./AddSubSection";

export function SortableSubSectionItem({
   collectionId,
   subSection,
   sectionId,
   fetcher,
}: {
   collectionId: string | undefined;
   sectionId: string;
   subSection: { id: string; slug: string; name: string; type: string };
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

   const updateSubSection = useZorm("subSectionUpdate", SubSectionSchema);

   const disabled =
      isProcessing(fetcher.state) ||
      updateSubSection.validation?.success === false;

   const [isSubSectionUpdateFormChanged, setSubSectionUpdateFormChanged] =
      useState(false);

   const savingUpdateSubSection = isAdding(fetcher, "updateSubSection");

   useEffect(() => {
      if (!savingUpdateSubSection) {
         setSubSectionUpdateFormChanged(false);
      }
   }, [savingUpdateSubSection]);

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
            <fetcher.Form
               onChange={() => setSubSectionUpdateFormChanged(true)}
               method="post"
               action="/collections/sections"
               ref={updateSubSection.ref}
            >
               <FieldGroup>
                  <Field className="w-full">
                     <Label>Name</Label>
                     <Input
                        name={updateSubSection.fields.subSectionName()}
                        defaultValue={subSection.name}
                        type="text"
                     />
                  </Field>
                  <Field className="w-full">
                     <Label>Slug</Label>
                     <Input
                        name={updateSubSection.fields.subSectionSlug()}
                        defaultValue={subSection.slug}
                        type="text"
                     />
                  </Field>
                  <Field className="tablet:min-w-40">
                     <Label>Type</Label>
                     <Select
                        defaultValue={subSection.type}
                        name={updateSubSection.fields.type()}
                     >
                        <option value="editor">Editor</option>
                        <option value="customTemplate">Custom Template</option>
                        <option value="qna">Q&A</option>
                        <option value="comments">Comments</option>
                     </Select>
                  </Field>
                  <input
                     type="hidden"
                     name={updateSubSection.fields.collectionId()}
                     value={collectionId}
                  />
                  <input
                     type="hidden"
                     name={updateSubSection.fields.sectionId()}
                     value={sectionId}
                  />
                  <input
                     type="hidden"
                     name={updateSubSection.fields.subSectionId()}
                     value={subSection.id}
                  />
                  <input
                     type="hidden"
                     name={updateSubSection.fields.existingSubSectionSlug()}
                     value={subSection.slug}
                  />
                  <div className="flex items-center justify-end gap-4">
                     {isSubSectionUpdateFormChanged && (
                        <Button
                           plain
                           type="button"
                           onClick={() => {
                              //@ts-ignore
                              updateSubSection.refObject.current.reset();
                              setSubSectionUpdateFormChanged(false);
                           }}
                        >
                           <Icon
                              title="Reset"
                              size={14}
                              name="refresh-ccw"
                              className="text-1"
                           />
                        </Button>
                     )}
                     <Button
                        name="intent"
                        value="updateSubSection"
                        type="submit"
                        color="zinc"
                        disabled={
                           disabled || isSubSectionUpdateFormChanged === false
                        }
                     >
                        {savingUpdateSubSection ? (
                           <>
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin text-white"
                              />
                              Saving
                           </>
                        ) : (
                           "Update Subsection"
                        )}
                     </Button>
                  </div>
               </FieldGroup>
            </fetcher.Form>
         </Dialog>
         <div className="flex items-center gap-2 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark450 hover:bg-white hover:shadow px-0.5 py-1.5 rounded-md touch-none",
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
         <span className="text-1 text-xs capitalize">{subSection.type}</span>
         <Button plain onClick={() => setIsOpen(true)}>
            <Icon className="text-1" name="more-horizontal" size={16} />
         </Button>
      </div>
   );
}
