import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
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
         className={clsx(
            sectionName
               ? "border p-4 rounded-xl bg-zinc-50 dark:bg-dark400 dark:border-zinc-600/40 tablet:shadow-sm shadow-1 pb-4"
               : "",
            "gap-4 mb-3 max-tablet:mx-3 max-tablet:my-4",
         )}
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
         <div className="max-tablet:space-y-3 tablet:flex items-center gap-3">
            <Field
               disabled={disabled}
               className="tablet:flex items-center gap-4 flex-none flex-grow"
            >
               <Label className={clsx(sectionName ? "" : "hidden")}>Name</Label>
               <Input
                  required
                  placeholder="Type a section name..."
                  name={zoSections.fields.name()}
                  onChange={(e) => {
                     setSectionName(e.target.value);
                     setSectionSlug(urlSlug(e.target.value));
                  }}
                  value={sectionName}
                  className="tablet:!mt-0"
                  type="text"
               />
            </Field>
            {!sectionName && (
               <Button color="blue" type="button" className="max-tablet:w-full">
                  Add Section
               </Button>
            )}
            {sectionName && (
               <Field
                  disabled={disabled}
                  className="tablet:flex items-center gap-4 flex-none"
               >
                  <Label>Slug</Label>
                  <Input
                     name={zoSections.fields.sectionSlug()}
                     value={sectionSlug}
                     onChange={(e) => {
                        setSectionSlug(e.target.value);
                     }}
                     className="tablet:!mt-0"
                     type="text"
                  />
               </Field>
            )}
            <input
               value={collection?.id}
               name={zoSections.fields.collectionId()}
               type="hidden"
            />
         </div>
         {sectionName && (
            <div className="max-tablet:space-y-6 tablet:flex items-center justify-between gap-6 pt-5">
               <Field
                  disabled={disabled}
                  className="tablet:flex items-center gap-4 flex-none"
               >
                  <Label className="tablet:w-12">Type</Label>
                  <Select
                     name={zoSections.fields.type()}
                     className="tablet:!mt-0"
                  >
                     <option value="editor">Editor</option>
                     <option value="customTemplate">Custom Template</option>
                     <option value="qna">Q&A</option>
                     <option value="comments">Comments</option>
                  </Select>
               </Field>
               <div className="flex items-center justify-end gap-8">
                  <SwitchField disabled={disabled}>
                     <Label className="!text-xs text-1">Show Ad</Label>
                     <Switch
                        value="true"
                        color="emerald"
                        name={zoSections.fields.showAd()}
                     />
                  </SwitchField>
                  <SwitchField disabled={disabled}>
                     <Label className="!text-xs text-1">Show Title</Label>
                     <Switch
                        defaultChecked
                        value="true"
                        color="emerald"
                        name={zoSections.fields.showTitle()}
                     />
                  </SwitchField>
               </div>
               <div className="max-laptop:flex items-center justify-end">
                  <Button
                     disabled={disabled}
                     color="blue"
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
         )}
      </fetcher.Form>
   );
}
