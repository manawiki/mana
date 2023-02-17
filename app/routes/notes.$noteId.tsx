import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { useMemo, useState } from "react";

import * as runtime from "react/jsx-dev-runtime";
import { MDXProvider, useMDXComponents  } from "@mdx-js/react";
import type { CompileOptions} from "@mdx-js/mdx";
import { compile, evaluateSync, runSync } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";

// import { lazily } from "react-lazily";
// import { loader as entryLoader } from "~/routes/toweroffantasy.c.simulacra.$entryId";
// const { Header } = lazily(
//    () => import("~/routes/toweroffantasy.c.simulacra.$entryId")
// );

const mdxOptions = {
   outputFormat: "function-body",
   useDynamicImport: true,
   development: true,
   providerImportSource: "@mdx-js/react",
} satisfies CompileOptions;

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
      overrideAccess: false,
      user,
   });

   const source = String(await compile(note?.mdx, mdxOptions));

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
      source,
      //  ...data
   });
}

//This is a test note editor
export default function EditNote() {
   const {
      note,
      source,
      // ...data
   } = useLoaderData<typeof loader>();

   const [mdx, setMDX] = useState(note?.mdx ?? "");

   return (
      <div className="grid grid-cols-2 space-x-2">
         <Form method="post">
            <input type="submit" className="bg-blue-500" />
            <textarea
               defaultValue={note?.mdx}
               name="mdx"
               className="w-full h-full"
               onChange={(e) => setMDX(e.target.value)}
            />
         </Form>
            <MDXProvider components={{ Test: () => <div>Test</div> }}>
         <div>
               {/* <NoteView source={source} /> */}
               <NoteLive mdx={mdx} />
         </div>
            </MDXProvider>
      </div>
   );
}

function NoteView({
   source,
   components,
}: {
   source: string;
   components?: MDXComponents;
}) {
   const { default: Content } = useMemo(
      () => runSync(source, {...runtime, useMDXComponents}),
      [source]
   );

   return (
      <Content />
   );
}

function NoteLive({
   mdx,
   components,
}: {
   mdx: string;
   components?: MDXComponents;
}) {
   const { default: Content } = useMemo(
      () => evaluateSync(mdx, { ...mdxOptions, useMDXComponents, ...runtime }),
      [mdx]
   );

   return (
      <div className="mdx-content">
         <Content components={components} />
      </div>
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

   const note = await payload.update({
      collection: "notes",
      id: noteId,
      data: {
         mdx,
      },
      overrideAccess: false,
      user,
      autosave: Boolean(autosave),
      draft: true,
   });

   // console.log(note);
   return json({ note });
}
