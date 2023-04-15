import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import type { LoaderArgs, V2_MetaFunction, ActionArgs } from "@remix-run/node";
import { Edit2, Plus } from "lucide-react";
import { Suspense } from "react";
import { NoteViewer } from "~/modules/note/components/NoteViewer";
import { formatDistanceStrict } from "date-fns";

import type { Note } from "payload-types";

export async function loader({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) {
   const { questionId } = zx.parseParams(params, {
      questionId: z.string(),
   });
   const question = await payload.findByID({
      collection: "questions",
      id: questionId,
   });
   return json({ question });
}

export const meta: V2_MetaFunction = ({ matches, data }) => {
   const siteName = matches.find(({ id }) => id === "routes/$siteId")?.data
      ?.site.name;
   return [
      {
         title: `${siteName} Q&A - ${data.question.title}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function Question() {
   const { question } = useLoaderData<typeof loader>();

   return (
      <div
         className="post-content relative mx-auto min-h-screen max-w-[728px] 
      max-laptop:pb-20 max-laptop:pt-24  laptop:py-12 desktop:px-0"
      >
         <h1 className="pb-3 font-mono text-3xl font-semibold laptop:text-4xl">
            {question?.title}
         </h1>
         <time
            className="block pb-5 text-sm dark:text-zinc-400"
            dateTime={question?.updatedAt}
         >
            {formatDistanceStrict(
               new Date(question?.updatedAt as string),
               new Date(),
               {
                  addSuffix: true,
               }
            )}
         </time>
         <Suspense fallback={<div>Loading...</div>}>
            {typeof question.question === "object" && (
               //question container
               <div key="question" className="group">
                  <div
                     className="hidden group-hover:flex max-desktop:justify-end max-desktop:pb-2
                                          desktop:absolute desktop:right-0 desktop:mr-2 "
                  >
                     <Link
                        to={`edit/${question.question}`}
                        prefetch="intent"
                        className="flex h-8 w-8 items-center justify-center rounded-full
                                              border border-blue-300 bg-blue-50 text-blue-500 
                                              dark:border-blue-600 dark:bg-blue-900 dark:text-white"
                     >
                        <Edit2 className="h-3.5 w-3.5 text-blue-500 dark:text-white" />
                     </Link>
                  </div>
                  <NoteViewer
                     className="border-color post-content mb-4 min-h-[50px] border-b"
                     note={question.question}
                     //insert custom components here
                     components={
                        {
                           // h2: (props) => <h2 className="text-2xl" {...props} />,
                        }
                     }
                  />
               </div>
            )}
            <div
               // answers container, should be indented
               className="pl-4"
            >
               {(question?.answers as Note[])?.map((note) => (
                  <div key={note.id} className="group">
                     <div
                        className="hidden group-hover:flex max-desktop:justify-end max-desktop:pb-2
                                          desktop:absolute desktop:right-0 desktop:mr-2 "
                     >
                        <Link
                           to={`edit/${note.id}`}
                           prefetch="intent"
                           className="flex h-8 w-8 items-center justify-center rounded-full
                                              border border-blue-300 bg-blue-50 text-blue-500 
                                              dark:border-blue-600 dark:bg-blue-900 dark:text-white"
                        >
                           <Edit2 className="h-3.5 w-3.5 text-blue-500 dark:text-white" />
                        </Link>
                     </div>
                     <NoteViewer
                        className="border-color post-content mb-4 min-h-[50px] border-b"
                        note={note}
                        //insert custom components here
                        components={
                           {
                              // h2: (props) => <h2 className="text-2xl" {...props} />,
                           }
                        }
                     />
                  </div>
               ))}
            </div>
         </Suspense>
         <div
            className="border-color bg-2 laptop:bg-1 sticky bottom-12 z-20 flex h-20 
                    items-center justify-between 
                    border-t px-3 shadow laptop:bottom-0 laptop:h-14"
         >
            <div className="mx-auto -mt-14 laptop:-mt-8">
               <Form method="post">
                  <button type="submit" name="intent" value="answer">
                     <div
                        className="mx-auto flex h-11 w-11 items-center justify-center
                    rounded-full border border-blue-300
                   bg-blue-500 font-semibold text-white dark:border-blue-700 
                   dark:bg-blue-800 "
                     >
                        <Plus className="h-6 w-6" />
                     </div>
                     <div className="pt-1 text-sm font-semibold">Answer</div>
                  </button>
               </Form>
            </div>
         </div>
         <Outlet />
      </div>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { siteId, questionId } = zx.parseParams(params, {
      siteId: z.string(),
      questionId: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   const note = await payload.create({
      collection: "notes",
      data: {
         ui: "textarea",
         mdx: "## ",
         data: [],
         author: user?.id,
      },
      overrideAccess: false,
      user,
   });

   const question = await payload.findByID({
      collection: "questions",
      id: questionId,
      user,
      overrideAccess: false,
      depth: 2,
   });

   await payload.update({
      collection: "questions",
      id: questionId,
      data: {
         answers: question.answers
            ? [
                 ...question.answers.map((note) =>
                    typeof note === "string" ? note : note.id
                 ),
                 note.id,
              ]
            : [note.id],
      },
      overrideAccess: false,
      user,
   });

   return redirect(`/${siteId}/questions/${questionId}/edit/${note.id}`);
}
