// Usage:
// Place as a hook on the **collection** that should have a two way relationship.
// Make sure to include the field name (first level), the child field name that includes the _term (second level), and the target collection and field to update.
// ================
// export const CraftEssences: CollectionConfig = {
//     slug: "craftEssences",
//     labels: { singular: "CraftEssence", plural: "CraftEssences" },
//     admin: { group: "Custom", useAsTitle: "name" },
// **  hooks: {
//        afterDelete: [Delete_TermRelationsOneDeep(
//           "effect_list", // Origin collection first level field name
//           "effect", // Origin collection second level field name
//           "_craftEssenceTypeSpecifics", // Target collection to update
//           "ceWithEffect" // Target collection field to update
//        )],
//     },
//     access: {
//        create: isStaff, //udpate in future to allow site admins as well
//        read: () => true,
//        update: isStaff, //udpate in future to allow site admins as well
//        delete: isStaff, //udpate in future to allow site admins as well
//     },
//     fields: [
// .....

import type { CollectionAfterDeleteHook } from 'payload/types';

export const Delete_TermRelations = (firstLevel:any, collectionName: any, fieldUpdateName: any): CollectionAfterDeleteHook => async (args) => {
    const {
        id,
        doc,
        req: { payload },
    } = args;

    // Get IDs to be deleted
    // Handle arrays
    var toDelete;
    if (Array.isArray(doc?.[firstLevel])) {
        toDelete = doc?.[firstLevel]?.map((a: any) => a.id).flat();
    }
    else { 
        toDelete = [ doc?.[firstLevel]?.id ];
    }

    // Delete erased array relations
    // ========================
    for (var del in toDelete) {
        var delQuery = await payload.find({
            collection: collectionName,
            where: {
                "id": {
                    equals: toDelete[parseInt(del)],
                },
            },
            depth: 2,
        });
        const delTerm = delQuery.docs[0]?.[fieldUpdateName]?.map((a:any) => a?.id).flat();

        // If the entry is in the delTerm list, remove it!
        // The removed data gets coded as 'undefined', so we can just remove all the undefined options.
        if (delTerm) {
            const delEntries = delTerm.filter((a:any) => a);
            const updateQuery = await payload.update({
                collection: collectionName,
                id: toDelete[parseInt(del)],
                data: {
                    ...delQuery.docs,
                    [fieldUpdateName]: delEntries,
                }
            });
        }
    }
}