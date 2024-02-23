import { useState, useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";

import { Button } from "~/components/Button";
import { ErrorMessage, Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import type { Section } from "./Sections";

export const SectionUpdateSchema = z.object({
   sectionName: z.string(),
   sectionSlug: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section Id contains invalid characters",
      ),
   sectionId: z.string(),
   existingSectionSlug: z.string(),
   showTitle: z.coerce.boolean(),
   showAd: z.coerce.boolean(),
   collectionId: z.string(),
});

export function UpdateSection({
   setAllSections,
   section,
   collection,
}: {
   setAllSections: (sections: any) => void;
   section: Section;
   collection: Collection | undefined;
}) {
   const fetcher = useFetcher();

   const disabled = isProcessing(fetcher.state);

   const updateSection = useZorm("sectionUpdate", SectionUpdateSchema);

   const savingUpdateSection = isAdding(fetcher, "updateSection");

   const [isSectionUpdateFormChanged, setSectionUpdateFormChanged] =
      useState(false);

   useEffect(() => {
      if (!savingUpdateSection) {
         setAllSections(collection?.sections);
         setSectionUpdateFormChanged(false);
      }
   }, [savingUpdateSection, collection?.sections]);

   return (
      <fetcher.Form
         onChange={() => setSectionUpdateFormChanged(true)}
         method="post"
         action="/collections/sections"
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
               <Label>Name</Label>
               <Input
                  name={updateSection.fields.sectionName()}
                  defaultValue={section.name}
                  type="text"
               />
            </Field>
            <Field disabled={disabled} className="w-full">
               <Label>Slug</Label>
               <Input
                  name={updateSection.fields.sectionSlug()}
                  defaultValue={section.slug}
                  type="text"
               />
               {updateSection.errors.sectionSlug((err) => (
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
                  name={updateSection.fields.existingSectionSlug()}
                  value={section.slug}
               />
               <input
                  type="hidden"
                  name={updateSection.fields.sectionId()}
                  value={section.id}
               />
               <input
                  type="hidden"
                  name={updateSection.fields.collectionId()}
                  value={collection?.id}
               />
               <div className="flex items-center justify-end gap-2">
                  {isSectionUpdateFormChanged && !disabled && (
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
                     disabled={disabled || isSectionUpdateFormChanged === false}
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
   );
}
