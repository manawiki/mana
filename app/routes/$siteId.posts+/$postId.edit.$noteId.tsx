import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { getSource } from "~/modules/note/getSource.server";
import NoteEditor from "~/modules/note/components/NoteEditor";
import { assertIsDelete } from "~/utils";

//get notes list from payload
export async function loader({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) {
   const { noteId } = zx.parseParams(params, {
      noteId: z.string(),
   });

   const note = await payload.findByID({
      collection: "notes",
      id: noteId,
      draft: true,
      user,
   });

   // const data = entryLoader({ request, params, context });

   return { note };
}

export default function EditNote() {
   const { note } = useLoaderData<typeof loader>();
   return <NoteEditor note={note} />;
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   if (!user) {
      return redirect("/home");
   }
   const { siteId, postId, noteId } = zx.parseParams(params, {
      noteId: z.string(),
      siteId: z.string(),
      postId: z.string(),
   });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "deleteNote": {
         assertIsDelete(request);

         const post = await payload.findByID({
            collection: "posts",
            id: postId,
            user,
         });

         await payload.delete({
            collection: "notes",
            id: noteId,
            overrideAccess: false,
            user,
         });

         const postCurrentNotes = post?.notes || [];
         //@ts-ignore
         const notes = postCurrentNotes.map(({ id }: { id }) => id);

         //Remove the current note from the posts notes array
         const index = notes.indexOf(noteId);
         if (index > -1) {
            // only splice array when item is found
            notes.splice(index, 1); // 2nd parameter means remove one item only
         }

         return await payload.update({
            collection: "posts",
            id: postId,
            data: { notes },
            overrideAccess: false,
            user,
         });
      }
      case "saveNote": {
         const { mdx, autosave } = await zx.parseForm(request, {
            mdx: z.string(),
            autosave: z.string().optional(),
         });
         const source = await getSource(mdx);
         //Toggle autosave behavior
         if (autosave) {
            let note = await payload.update({
               collection: "notes",
               id: noteId,
               data: {
                  mdx,
                  source,
               },
               overrideAccess: false,
               user,
               autosave: Boolean(autosave),
               draft: Boolean(autosave),
            });

            return json({ note });
         }

         await payload.update({
            collection: "notes",
            id: noteId,
            data: {
               mdx,
               source,
               _status: "published",
            },
            overrideAccess: false,
            user,
         });

         await payload.update({
            collection: "posts",
            id: postId,
            data: {
               updatedAt: new Date().toISOString(),
            },
            overrideAccess: false,
            user,
         });

         return redirect(`/${siteId}/posts/${postId}`);
      }
      default:
         return null;
   }
}
