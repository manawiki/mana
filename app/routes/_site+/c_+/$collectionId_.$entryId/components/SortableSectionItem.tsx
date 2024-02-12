import { useEffect, useState } from "react";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type FetcherWithComponents } from "@remix-run/react";
import clsx from "clsx";
import { useZorm } from "react-zorm";
import { z } from "zod";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { ErrorMessage, Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Switch, SwitchField } from "~/components/Switch";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import type { Section } from "./Sections";
// eslint-disable-next-line import/no-cycle
import { SortableSubSectionItem } from "./SortableSubSectionItem";

export const SectionUpdateSchema = z.object({
   sectionName: z.string(),
   sectionId: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section Id contains invalid characters",
      ),
   existingSectionId: z.string(),
   showTitle: z.coerce.boolean(),
   showAd: z.coerce.boolean(),
   collectionId: z.string(),
});

export const SubSectionSchema = z.object({
   subSectionName: z.string(),
   sectionId: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section Id contains invalid characters",
      ),
   existingSubSectionId: z.string().optional(),
   subSectionId: z.string(),
   collectionId: z.string(),
   type: z.enum(["editor", "customTemplate", "qna", "comments"]),
});

export function SortableSectionItem({
   section,
   fetcher,
   collectionId,
}: {
   section: Section;
   fetcher: FetcherWithComponents<unknown>;
   collectionId: Collection["id"] | undefined;
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

   const updateSection = useZorm("sectionUpdate", SectionUpdateSchema);
   const addSubSection = useZorm("addSubSection", SubSectionSchema);

   const disabled =
      isProcessing(fetcher.state) ||
      updateSection.validation?.success === false;

   //DND
   const subSections = section?.subSections?.map((item) => item.id) ?? [];

   const [activeId, setActiveId] = useState<string | null>(null);

   const activeSubSection = section?.subSections?.find(
      (x) => "id" in x && x.id === activeId,
   );

   function handleDragStart(event: DragStartEvent) {
      if (event.active) {
         setActiveId(event.active.id as string);
      }
   }

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active.id !== over?.id) {
         fetcher.submit(
            {
               sectionId: section?.id ?? "",
               activeId: active?.id,
               overId: over?.id ?? "",
               intent: "updateSubSectionOrder",
            },
            {
               method: "patch",
            },
         );
      }
      setActiveId(null);
   }

   const [isSectionUpdateFormChanged, setSectionUpdateFormChanged] =
      useState(false);

   const savingUpdateSection = isAdding(fetcher, "updateSection");

   useEffect(() => {
      if (!savingUpdateSection) {
         setSectionUpdateFormChanged(false);
      }
   }, [savingUpdateSection]);

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
         <Dialog
            className="relative"
            size="xl"
            onClose={setIsOpen}
            open={isOpen}
         >
            <fetcher.Form
               onChange={() => setSectionUpdateFormChanged(true)}
               method="post"
               ref={updateSection.ref}
            >
               <div className="text-xs font-semibold flex items-center gap-2 pb-3 pl-2">
                  <Icon
                     name="layout-panel-top"
                     className="text-zinc-400 dark:text-zinc-500"
                     size={16}
                  />
                  <span className="pt-0.5">Section</span>
               </div>
               <FieldGroup className="p-5 bg-2-sub border border-color-sub rounded-xl mb-7">
                  <Field disabled={disabled} className="w-full">
                     <Label>Section Name</Label>
                     <Input
                        name={updateSection.fields.sectionName()}
                        defaultValue={section.name}
                        type="text"
                     />
                  </Field>
                  <Field disabled={disabled} className="w-full">
                     <Label>Section Id</Label>
                     <Input
                        name={updateSection.fields.sectionId()}
                        defaultValue={section.id}
                        type="text"
                     />
                     {updateSection.errors.sectionId((err) => (
                        <ErrorMessage>{err.message}</ErrorMessage>
                     ))}
                  </Field>
                  <div className="max-laptop:space-y-6 laptop:flex items-center justify-between gap-6">
                     <div className="flex items-center justify-end gap-8">
                        <SwitchField disabled={disabled}>
                           <Label className="!text-xs text-1">Show Ad</Label>
                           <Switch
                              onChange={() => setSectionUpdateFormChanged(true)}
                              defaultChecked={Boolean(section.showAd)}
                              value="true"
                              color="dark/white"
                              name={updateSection.fields.showAd()}
                           />
                        </SwitchField>
                        <SwitchField disabled={disabled}>
                           <Label className="!text-xs text-1">Show Title</Label>
                           <Switch
                              onChange={() => setSectionUpdateFormChanged(true)}
                              defaultChecked={Boolean(section.showTitle)}
                              value="true"
                              color="dark/white"
                              name={updateSection.fields.showTitle()}
                           />
                        </SwitchField>
                     </div>
                     <input
                        type="hidden"
                        name={updateSection.fields.existingSectionId()}
                        value={section.id}
                     />
                     <input
                        type="hidden"
                        name={updateSection.fields.collectionId()}
                        value={collectionId}
                     />
                     <div className="flex items-center justify-end gap-2">
                        {isSectionUpdateFormChanged && (
                           <Button
                              plain
                              type="button"
                              onClick={() => {
                                 //@ts-ignore
                                 updateSection.refObject.current.reset();
                                 setSectionUpdateFormChanged(false);
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
                           value="updateSection"
                           type="submit"
                           disabled={
                              disabled || isSectionUpdateFormChanged === false
                           }
                        >
                           {savingUpdateSection ? (
                              <>
                                 <Icon
                                    name="loader-2"
                                    size={14}
                                    className="animate-spin text-white"
                                 />
                                 Saving
                              </>
                           ) : (
                              "Update Section"
                           )}
                        </Button>
                     </div>
                  </div>
               </FieldGroup>
            </fetcher.Form>
            <fetcher.Form method="post" ref={addSubSection.ref}>
               <>
                  <div className="text-xs pb-3 font-semibold flex items-center gap-2">
                     <Icon
                        name="columns-2"
                        className="text-zinc-400 dark:text-zinc-500"
                        size={16}
                     />
                     <span className="pt-0.5">Subsections</span>
                  </div>
                  <DndContext
                     onDragStart={handleDragStart}
                     onDragEnd={handleDragEnd}
                     modifiers={[restrictToVerticalAxis]}
                     collisionDetection={closestCenter}
                  >
                     <SortableContext
                        items={subSections}
                        strategy={verticalListSortingStrategy}
                     >
                        <div className="divide-y bg-2-sub divide-color-sub mb-4 -mx-5 border-y border-color-sub">
                           {section.subSections?.map((row) => (
                              <SortableSubSectionItem
                                 key={row.id}
                                 subSection={row}
                                 sectionId={section.id}
                                 fetcher={fetcher}
                                 collectionId={collectionId}
                              />
                           ))}
                        </div>
                     </SortableContext>
                     <DragOverlay adjustScale={false}>
                        {activeSubSection && (
                           <SortableSubSectionItem
                              fetcher={fetcher}
                              subSection={activeSubSection}
                              sectionId={section.id}
                              collectionId={collectionId}
                           />
                        )}
                     </DragOverlay>
                  </DndContext>
                  <FieldGroup className="tablet:space-y-0 tablet:flex items-center gap-4 pb-5">
                     <Field className="w-full">
                        <Label>Name</Label>
                        <Input
                           name={addSubSection.fields.subSectionName()}
                           type="text"
                        />
                     </Field>
                     <Field className="w-full">
                        <Label>Id</Label>
                        <Input
                           name={addSubSection.fields.subSectionId()}
                           type="text"
                        />
                        {addSubSection.errors.subSectionId((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                     <Field className="tablet:min-w-40">
                        <Label>Type</Label>
                        <Select name={addSubSection.fields.type()}>
                           <option value="editor">Editor</option>
                           <option value="customTemplate">
                              Custom Template
                           </option>
                           <option value="qna">Q&A</option>
                           <option value="comments">Comments</option>
                        </Select>
                     </Field>
                  </FieldGroup>
                  <input
                     type="hidden"
                     name={addSubSection.fields.collectionId()}
                     value={collectionId}
                  />
                  <input
                     type="hidden"
                     name={addSubSection.fields.sectionId()}
                     value={section.id}
                  />
                  <div className="max-tablet:pb-6 flex items-center justify-end">
                     <Button
                        name="intent"
                        value="addSubSection"
                        type="submit"
                        className="flex-none"
                        disabled={disabled}
                     >
                        <Icon name="plus" size={16} />
                        Add Subsection
                     </Button>
                  </div>
               </>
            </fetcher.Form>
         </Dialog>
         <div className="flex items-center gap-2.5 flex-grow">
            <div
               className={clsx(
                  isDragging ? "cursor-grabbing" : "cursor-move",
                  "dark:hover:bg-dark450 hover:bg-zinc-100 px-0.5 py-1.5 rounded-md",
               )}
               aria-label="Drag to reorder"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <Icon name="grip-vertical" size={16} className="text-1" />
            </div>
            <span className="text-sm">{section?.name}</span>
         </div>
         <div className="text-xs text-zinc-400 dark:text-zinc-500">
            {section.id}
         </div>
         <Button plain onClick={() => setIsOpen(true)}>
            <Icon className="text-1" name="more-horizontal" size={16} />
         </Button>
      </div>
   );
}
