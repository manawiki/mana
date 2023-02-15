import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { getSource } from "~/modules/note/getSource.server";
import NoteEditor from "~/modules/note/components/NoteEditor";

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
   const { siteId, postId, noteId } = zx.parseParams(params, {
      noteId: z.string(),
      siteId: z.string(),
      postId: z.string(),
   });
   const { mdx, autosave } = await zx.parseForm(request, {
      mdx: z.string(),
      autosave: z.string().optional(),
   });

   if (!user) {
      return redirect("/home");
   }

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
