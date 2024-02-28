import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { nanoid } from "nanoid";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { SubSectionSchema } from "../c_+/$collectionId_.$entryId/components/AddSubSection";
import { SectionUpdateSchema } from "../c_+/$collectionId_.$entryId/components/UpdateSection";
import { SectionSchema } from "../c_+/$collectionId_.$entryId/utils/SectionSchema";

export const EntrySchema = z.object({
   name: z.string(),
   collectionId: z.string(),
   siteId: z.string(),
});

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   if (!user || !user.id) return redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.enum([
         "addSection",
         "addSubSection",
         "updateSection",
         "updateSubSection",
         "updateSectionOrder",
         "updateSubSectionOrder",
      ]),
   });

   switch (intent) {
      case "addSection": {
         try {
            const { collectionId, sectionSlug, name, showTitle, type, showAd } =
               await zx.parseForm(request, SectionSchema);

            const collectionData = await payload.findByID({
               collection: "collections",
               id: collectionId,
               overrideAccess: false,
               user,
            });

            return await payload.update({
               collection: "collections",
               id: collectionData.id,
               data: {
                  sections: [
                     //@ts-ignore
                     ...collectionData?.sections,
                     {
                        id: nanoid(),
                        slug: sectionSlug,
                        name,
                        showTitle,
                        showAd,
                        subSections: [
                           {
                              id: nanoid(),
                              slug: sectionSlug,
                              name,
                              type,
                           },
                        ],
                     },
                  ],
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to add section",
            );
         }
      }
      case "addSubSection": {
         try {
            const results = await zx.parseForm(request, SubSectionSchema);

            const existingSections = await payload.findByID({
               collection: "collections",
               id: results.collectionId,
               overrideAccess: false,
               user,
            });

            const newSection = {
               id: nanoid(),
               slug: results.subSectionSlug,
               name: results.subSectionName,
               type: results.type,
            };

            const updatedSections =
               existingSections.sections?.map((section) =>
                  section.id === results.sectionId
                     ? section.subSections?.some(
                          (subSection) =>
                             subSection.slug === results.subSectionSlug,
                       )
                        ? { isDuplicateSlug: true }
                        : {
                             ...section,
                             //@ts-ignore
                             subSections: [...section.subSections, newSection],
                          }
                     : section,
               ) ?? [];

            const hasDuplicateSlug = updatedSections.some(
               //@ts-ignore
               (section) => section.isDuplicateSlug,
            );

            if (hasDuplicateSlug) {
               return jsonWithError(null, "Duplicate sub-section slug found.");
            }

            await payload.update({
               collection: "collections",
               id: results.collectionId,
               data: {
                  //@ts-ignore
                  sections: updatedSections,
               },
               user,
               overrideAccess: false,
            });

            return jsonWithSuccess(null, `Sub-section added`);
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to add Sub-section order.",
            );
         }
      }
      case "updateSection": {
         try {
            const results = await zx.parseForm(request, SectionUpdateSchema);

            const existingCollection = await payload.findByID({
               collection: "collections",
               id: results.collectionId,
               overrideAccess: false,
               user,
               depth: 0,
            });

            const sectionToUpdate = existingCollection?.sections?.find(
               (section) => section.id === results.sectionId,
            );

            const hasDuplicateSectionSlug =
               existingCollection?.sections?.some(
                  (section) => section.slug === results.sectionSlug,
               ) && results.existingSectionSlug !== results.sectionSlug;

            if (hasDuplicateSectionSlug) {
               return jsonWithError(null, "Duplicate section slug found.");
            }

            const updatedSection = {
               ...sectionToUpdate,
               ...(results.sectionName && { name: results.sectionName }),
               ...(results.sectionSlug && { slug: results.sectionSlug }),
               showTitle: results.showTitle,
               showAd: results.showAd,
            };

            const updatedSections =
               existingCollection.sections?.map((item) =>
                  item.id === results.sectionId ? updatedSection : item,
               ) ?? [];

            await payload.update({
               collection: "collections",
               id: results.collectionId,
               data: {
                  sections: updatedSections,
               },
               user,
               overrideAccess: false,
               depth: 0,
            });

            return jsonWithSuccess(null, "Section updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update section",
            );
         }
      }
      case "updateSubSection": {
         try {
            const results = await zx.parseForm(request, SubSectionSchema);

            const existingCollection = await payload.findByID({
               collection: "collections",
               id: results.collectionId,
               overrideAccess: false,
               user,
               depth: 0,
            });
            const hasDuplicateSubSectionSlug =
               existingCollection?.sections
                  ?.map(
                     (section) =>
                        section.subSections?.some(
                           (subSection) =>
                              subSection.slug === results.subSectionSlug,
                        ),
                  )
                  .some((x) => x) &&
               results.existingSubSectionSlug !== results.subSectionSlug;

            if (hasDuplicateSubSectionSlug) {
               return jsonWithError(null, "Duplicate subsection slug found.");
            }

            const sectionToUpdate = existingCollection?.sections?.find(
               (section) => section.id === results.sectionId,
            );

            const subSectionToUpdate = sectionToUpdate?.subSections?.find(
               (subSection) => subSection.id === results.subSectionId,
            );

            const updatedSubSection = {
               ...subSectionToUpdate,
               ...(results.subSectionSlug && { slug: results.subSectionSlug }),
               ...(results.subSectionName && { name: results.subSectionName }),
               ...(results.type && { type: results.type }),
            };

            const updatedSubSections = existingCollection.sections?.map(
               (section) => {
                  return {
                     ...section,
                     subSections: section.subSections?.map((subSection) =>
                        subSection.id === results.subSectionId
                           ? updatedSubSection
                           : subSection,
                     ),
                  };
               },
            );

            await payload.update({
               collection: "collections",
               id: results.collectionId,
               data: {
                  sections: updatedSubSections,
               },
               user,
               overrideAccess: false,
               depth: 0,
            });

            return jsonWithSuccess(null, "Subsection updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update subsection",
            );
         }
      }
      case "updateSectionOrder": {
         try {
            const { sections, collectionId } = await zx.parseForm(request, {
               collectionId: z.string(),
               sections: z.string(),
            });
            await payload.update({
               collection: "collections",
               id: collectionId,
               data: {
                  sections: JSON.parse(sections),
               },
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess(null, "Section order updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update section order.",
            );
         }
      }
      case "updateSubSectionOrder": {
         try {
            const { subSections, collectionId, sectionId } = await zx.parseForm(
               request,
               {
                  subSections: z.string(),
                  collectionId: z.string(),
                  sectionId: z.string(),
               },
            );
            const collectionData = await payload.findByID({
               collection: "collections",
               id: collectionId,
               overrideAccess: false,
               user,
            });
            const updatedSections =
               collectionData.sections?.map((item) =>
                  item.id === sectionId
                     ? { ...item, subSections: JSON.parse(subSections) }
                     : item,
               ) ?? [];

            await payload.update({
               collection: "collections",
               id: collectionData.id,
               data: {
                  sections: updatedSections,
               },
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess(null, "Sub-section order updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update subsection order.",
            );
         }
      }
   }
};
