import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { toast } from "sonner";
import urlSlug from "url-slug";
import { z } from "zod";

import { Button } from "~/components/Button";
import { FieldGroup, Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import type { Section } from "../../_components/List";

export const SubSectionSchema = z.object({
   subSectionName: z.string(),
   subSectionSlug: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section slug contains invalid characters",
      ),
   existingSubSectionSlug: z.string().optional(),
   subSectionId: z.string().optional(),
   sectionId: z.string(),
   collectionId: z.string(),
   type: z.enum(["editor", "customTemplate", "qna", "comments"]),
});

export function AddSubSection({
   section,
   collection,
}: {
   section: Section;
   collection: Collection | undefined;
}) {
   const addSubSection = useZorm("addSubSection", SubSectionSchema);
   const fetcher = useFetcher();

   const disabled = isProcessing(fetcher.state);

   const addingSubSection = isAdding(fetcher, "addSubSection");

   useEffect(() => {
      if (!addingSubSection) {
         setSubSectionName("");
         setSubSectionSlug("");
      }
   }, [addingSubSection]);

   const [subSubSectionName, setSubSectionName] = useState("");
   const [subSubSectionSlug, setSubSectionSlug] = useState("");

   return (
      <fetcher.Form
         method="post"
         action="/collections/sections"
         ref={addSubSection.ref}
         className="relative"
         onSubmit={(e) => {
            const validation = addSubSection.validate();
            if (!validation.success) {
               addSubSection.errors.subSectionName((err) =>
                  toast.error(err.message),
               );
               addSubSection.errors.subSectionSlug((err) =>
                  toast.error(err.message),
               );
               e.preventDefault();
            }
         }}
      >
         <FieldGroup className="pb-5">
            <div className="grid grid-cols-2 gap-3">
               <Field disabled={disabled} className="w-full">
                  <Label>Name</Label>
                  <Input
                     name={addSubSection.fields.subSectionName()}
                     type="text"
                     value={subSubSectionName}
                     onChange={(e) => {
                        setSubSectionName(e.target.value);
                        setSubSectionSlug(urlSlug(e.target.value));
                     }}
                  />
               </Field>
               <Field disabled={disabled} className="w-full">
                  <Label>Slug</Label>
                  <Input
                     name={addSubSection.fields.subSectionSlug()}
                     value={subSubSectionSlug}
                     onChange={(e) => {
                        setSubSectionSlug(e.target.value);
                     }}
                     type="text"
                  />
               </Field>
            </div>
            <Field disabled={disabled} className="tablet:min-w-40">
               <Label>Type</Label>
               <Select name={addSubSection.fields.type()}>
                  <option value="editor">Editor</option>
                  <option value="customTemplate">Custom Template</option>
                  <option value="qna">Q&A</option>
                  <option value="comments">Comments</option>
               </Select>
            </Field>
         </FieldGroup>
         <input
            type="hidden"
            name={addSubSection.fields.collectionId()}
            value={collection?.id}
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
               color="zinc"
               disabled={disabled}
            >
               {addingSubSection ? (
                  <Icon name="loader-2" size={15} className="animate-spin " />
               ) : (
                  <Icon name="plus" size={15} />
               )}
               Add Subsection
            </Button>
         </div>
      </fetcher.Form>
   );
}
