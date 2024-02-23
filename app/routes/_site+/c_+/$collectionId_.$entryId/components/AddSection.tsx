import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { toast } from "sonner";
import urlSlug from "url-slug";

import { Button } from "~/components/Button";
import { Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Switch, SwitchField } from "~/components/Switch";
import type { Collection } from "~/db/payload-types";
import { isAdding, isProcessing } from "~/utils/form";

import { SectionSchema } from "../utils/SectionSchema";

export function AddSection({
   collection,
   setAllSections,
}: {
   collection: Collection;
   setAllSections: (sections: any) => void;
}) {
   const fetcher = useFetcher({ key: "section" });

   const zoSections = useZorm("sections", SectionSchema);
   const addingSection = isAdding(fetcher, "addSection");

   const disabled = isProcessing(fetcher.state);

   useEffect(() => {
      if (!addingSection) {
         setSectionName("");
         setSectionSlug("");
         zoSections.refObject.current && zoSections.refObject.current.reset();
         setAllSections(collection?.sections);
      }
   }, [addingSection, collection?.sections]);

   const [sectionName, setSectionName] = useState("");
   const [sectionSlug, setSectionSlug] = useState("");

   return (
      <fetcher.Form
         ref={zoSections.ref}
         className="shadow-sm shadow-1 gap-4 border border-color dark:border-zinc-600/50 rounded-lg bg-zinc-50 dark:bg-dark400 p-4 mb-4"
         method="post"
         action="/collections/sections"
         onSubmit={(e) => {
            const validation = zoSections.validate();
            if (!validation.success) {
               zoSections.errors.name((err) => toast.error(err.message));
               zoSections.errors.sectionSlug((err) => toast.error(err.message));
               e.preventDefault();
            }
         }}
      >
         <div className="max-laptop:space-y-3 laptop:flex items-center pb-5 justify-between gap-5">
            <Field disabled={disabled} className="w-full">
               <Label className="flex items-center justify-between gap-4">
                  <span>Name</span>
               </Label>
               <Input
                  className="w-full"
                  required
                  placeholder="Type a section name..."
                  name={zoSections.fields.name()}
                  onChange={(e) => {
                     setSectionName(e.target.value);
                     setSectionSlug(urlSlug(e.target.value));
                  }}
                  value={sectionName}
                  type="text"
               />
            </Field>
            <Field disabled={disabled} className="w-full">
               <Label className="flex items-center justify-between gap-4">
                  <span>Slug</span>
               </Label>
               <Input
                  className="flex-none bg-transparent text-xs focus:outline-none"
                  name={zoSections.fields.sectionSlug()}
                  value={sectionSlug}
                  onChange={(e) => {
                     setSectionSlug(e.target.value);
                  }}
                  type="text"
               />
            </Field>
            <Field disabled={disabled} className="laptop:min-w-40">
               <Label>Type</Label>
               <Select name={zoSections.fields.type()}>
                  <option value="editor">Editor</option>
                  <option value="customTemplate">Custom Template</option>
                  <option value="qna">Q&A</option>
                  <option value="comments">Comments</option>
               </Select>
            </Field>
            <input
               value={collection?.id}
               name={zoSections.fields.collectionId()}
               type="hidden"
            />
         </div>
         <div className="max-laptop:space-y-6 laptop:flex items-center justify-end gap-6">
            <div className="flex items-center justify-end gap-8">
               <SwitchField disabled={disabled}>
                  <Label className="!text-xs text-1">Show Ad</Label>
                  <Switch
                     value="true"
                     color="dark/white"
                     name={zoSections.fields.showAd()}
                  />
               </SwitchField>
               <SwitchField disabled={disabled}>
                  <Label className="!text-xs text-1">Show Title</Label>
                  <Switch
                     defaultChecked
                     value="true"
                     color="dark/white"
                     name={zoSections.fields.showTitle()}
                  />
               </SwitchField>
            </div>
            <div className="max-laptop:flex items-center justify-end">
               <Button
                  disabled={disabled}
                  className="text-sm cursor-pointer mr-0 ml-auto block"
                  name="intent"
                  value="addSection"
                  type="submit"
               >
                  {addingSection ? (
                     <Icon
                        name="loader-2"
                        size={14}
                        className="animate-spin text-white"
                     />
                  ) : (
                     <Icon name="plus" className="text-white" size={14} />
                  )}
                  Add Section
               </Button>
            </div>
         </div>
      </fetcher.Form>
   );
}
