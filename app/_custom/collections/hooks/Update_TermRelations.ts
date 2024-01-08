// Usage:
// Place as a hook on the field that should have a two way relationship.
// Make sure to include the field name (first level), the child field name that includes the _term (second level), and the target collection and field to update.
// ================
// {
//     name: "effect_list",
//     type: "array",
//     fields: [
//        {
//           name: "effect",
//           type: "relationship",
// *HERE*>   hooks: {
//              beforeChange: [Update_TermRelationsOneDeep(
//                 "effect_list", // Origin collection first level field name
//                 "effect", // Origin collection second level field name
//                 "_craftEssenceTypeSpecifics", // Target collection to update
//                 "ceWithEffect" // Target collection field to update
//                 )]
//           },
//           relationTo: "_craftEssenceTypeSpecifics",
//           hasMany: false,
//        },
// .....

import type { FieldHook } from "payload/types";

export const Update_TermRelations =
   (firstLevel: any, collectionName: any, fieldUpdateName: any): FieldHook =>
   async (args) => {
      const {
         value,
         data,
         // siblingData,
         previousDoc,
         // operation,
         req: { payload },
      } = args;

      const id = value; // Existing entry
      const entity = data?.id;

      // Compare original and current data fields to determine if a deletion occurred, and pull IDs that should be marked for deletion.
      // We don't have a hook for deletion of elements for array fields, so we need to do a manual comparison.
      const newDataIds = Array.isArray(data?.[firstLevel])
         ? data?.[firstLevel]?.map((a: any) => a).flat()
         : data?.[firstLevel];
      const oldDataIds = Array.isArray(previousDoc?.[firstLevel])
         ? previousDoc?.[firstLevel]?.map((a: any) => a).flat()
         : previousDoc?.[firstLevel];

      const toDelete = Array.isArray(oldDataIds)
         ? oldDataIds?.filter((x: any) => !newDataIds?.includes(x))
         : newDataIds == null
         ? [oldDataIds]
         : null;

      // Delete erased array relations
      // ========================
      for (var del in toDelete) {
         var delQuery = await payload.find({
            collection: collectionName,
            where: {
               id: {
                  equals: toDelete[parseInt(del)],
               },
            },
            depth: 2,
         });
         const delTerm = delQuery.docs[0]?.[fieldUpdateName]?.map(
            (a: any) => a?.id,
         );
         // If the entry is in the delTerm list, remove it!
         if (delTerm?.indexOf(entity) > -1) {
            const delEntries = delTerm.filter((a: any) => a != entity);
            const updateQuery = await payload.update({
               collection: collectionName,
               id: toDelete[parseInt(del)],
               data: {
                  ...delQuery.docs,
                  [fieldUpdateName]: delEntries,
               },
            });
         }
      }
      // ========================
      // Update new entries: Find entry in collection
      // ========================
      // Check if field is an array, update individual or loop through array.

      // console.log("data")
      // console.log(data?.["_id"])
      if (Array.isArray(id)) {
         for (var arrId in id) {
            var cId = id[arrId];
            const searchDocQuery = await payload.find({
               collection: collectionName,
               where: {
                  id: {
                     equals: cId,
                  },
               },
               depth: 2,
            });
            // console.log("searchDocQuery")
            // console.log(searchDocQuery)
            // Get IDs for all entries in the fieldUpdateName field
            const currEntries = searchDocQuery.docs[0]?.[fieldUpdateName]?.map(
               (a: any) => a?.id,
            );
            if (!currEntries || currEntries?.indexOf(entity) == -1) {
               const newEntries = currEntries
                  ? [...currEntries, entity]
                  : entity;
               const updateQuery = await payload.update({
                  collection: collectionName,
                  id: cId,
                  data: {
                     ...searchDocQuery.docs,
                     [fieldUpdateName]: newEntries,
                  },
               });
            }
         }
      } else if (id) {
         const searchDocQuery = await payload.find({
            collection: collectionName,
            where: {
               id: {
                  equals: id,
               },
            },
            depth: 2,
         });
         // Get IDs for all entries in the fieldUpdateName field

         if (searchDocQuery.docs.length > 0) {
            const currEntries = searchDocQuery.docs[0]?.[fieldUpdateName]?.map(
               (a: any) => a?.id,
            );
            if (!currEntries || currEntries?.indexOf(entity) == -1) {
               const newEntries = currEntries
                  ? [...currEntries, entity]
                  : entity;
               const updateQuery = await payload.update({
                  collection: collectionName,
                  id: id,
                  data: {
                     ...searchDocQuery.docs,
                     [fieldUpdateName]: newEntries,
                  },
               });
            }
         }
      }
   };
