import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { getSource } from "~/modules/note/getSource.server";
import NoteEditor from "~/modules/note/components/NoteEditor";

// import { lazily } from "react-lazily";
// import { loader as entryLoader } from "~/routes/toweroffantasy.c.simulacra.$entryId";
// const { Header } = lazily(
//    () => import("~/routes/toweroffantasy.c.simulacra.$entryId")
// );

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

   // // How we can convert keys into defered data promises
   // const data = Object.fromEntries(
   //    note?.data?.map((key, int) => [
   //       key?.endpoints,
   //       entryLoader({ params: { entryId: (int + 1).toString() } }),
   //    ])
   // );

   //    const keys = ["meryl", "nemesis", "echo", "bai ling"];

   //    const data = {
   //       meryl: entryLoader({ params: { entryId: "1" } }),
   //       nemesis: entryLoader({ params: { entryId: "2" } }),
   //       echo: entryLoader({ params: { entryId: "3" } }),
   //       "bai ling": entryLoader({ params: { entryId: "4" } }),
   //    };

   return defer({
      note,
      //  ...data
   });
}

//This is a test note editor
export default function EditNote() {
   const {
      note,
      // ...data
   } = useLoaderData<typeof loader>();
   return (
      <NoteEditor
         note={note}
         // scope={data} components={{ Header }}
      />
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { noteId } = zx.parseParams(params, {
      noteId: z.string(),
   });
   const { mdx, autosave } = await zx.parseForm(request, {
      mdx: z.string(),
      autosave: z.string().optional(),
   });

   if (!user) {
      return redirect("/home");
   }

   const source = await getSource(mdx);

   const note = await payload.update({
      collection: "notes",
      id: noteId,
      data: {
         mdx,
         source,
      },
      overrideAccess: false,
      user,
      autosave: Boolean(autosave),
      draft: true,
   });

   // console.log(note);
   return json({ note });
}
