import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useSearchParams } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { zx } from "zodix";
import { z } from "zod";
import { HelpCircle, Loader2 } from "lucide-react";
import { isAdding } from "~/utils";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });

   const { search } = zx.parseQuery(request, {
      search: z.string().optional(),
   });

   console.log(search);

   const questions = await payload.find({
      collection: "questions",
      user,
      where: {
         title: search ? { contains: search } : {},
         site: {
            equals: siteId,
         },
      },
   });

   return { questions };
}

export default function QuestionsIndex() {
   const { questions } = useLoaderData<typeof loader>();

   const transition = useNavigation();
   const adding = isAdding(transition, "addEntry");
   const fetcher = useFetcher();

   //update search

   const [, setSearchParams] = useSearchParams();

   const searchQuery = (e: React.ChangeEvent<HTMLInputElement>) =>
      setSearchParams(
         { search: e.target.value.toLowerCase() },
         { replace: true, preventScrollReset: true }
      );

   return (
      <div className="mx-auto max-w-[728px] px-3 pt-4 tablet:px-0 laptop:px-3 laptop:pt-8 desktop:px-0">
         <h1 className="border-color mb-5 border-b-2 pb-2.5 text-3xl font-bold">
            Questions
         </h1>

         <div className="mx-auto max-w-[728px] px-3 pt-4 laptop:pt-8">
            <h2 className="pt-6 pb-3 text-2xl font-bold">Q & A</h2>
            <fetcher.Form method="post" className="pb-3.5" replace>
               <div className="flex items-center gap-4">
                  <div className="flex-grow">
                     <input
                        required
                        placeholder="Find or Ask a Question..."
                        autoFocus={true}
                        name="title"
                        type="text"
                        className="input-text mt-0"
                        onChange={searchQuery}
                     />
                  </div>
                  <button
                     name="intent"
                     value="ask"
                     type="submit"
                     className="h-10 w-16 rounded bg-zinc-500 px-4 text-sm font-bold 
                        text-white hover:bg-zinc-600 focus:bg-zinc-400"
                  >
                     {adding ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                     ) : (
                        <HelpCircle className="mx-auto h-5 w-5 text-zinc-300" />
                     )}
                  </button>
               </div>
            </fetcher.Form>
            <div className="border-color bg-1 divide-y overflow-hidden rounded-md border dark:divide-zinc-700">
               {questions?.docs.length === 0 ? (
                  <div className="p-3 text-sm ">No current questions...</div>
               ) : (
                  questions.docs.map((question) => (
                     <Link
                        prefetch="intent"
                        to={question.id}
                        key={question.id}
                        className="flex items-center justify-between gap-2 p-3 hover:underline"
                     >
                        <span className="truncate">{question.title}</span>
                     </Link>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) => {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });

   const { intent, title } = await zx.parseForm(request, {
      intent: z.string(),
      title: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "ask":
         const note = await payload.create({
            collection: "notes",
            data: { mdx: "## ", data: [], ui: "textarea", author: user?.id },
            overrideAccess: false,
            user,
         });

         const question = await payload.create({
            collection: "questions",
            data: {
               title,
               author: user?.id,
               question: note.id,
               site: siteId,
            },
            user,
            overrideAccess: false,
         });

         return redirect(`/${siteId}/questions/${question.id}`);
   }

   return null;
};
