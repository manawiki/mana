import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { zx } from "zodix";
import { z } from "zod";
import { Plus } from "lucide-react";

export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });
   const posts = await payload.find({
      collection: "posts",
      user,
      where: {
         site: {
            equals: siteId,
         },
      },
   });

   return { posts };
}

export default function PostsIndex() {
   const { posts } = useLoaderData<typeof loader>();
   return (
      <div className="mx-auto max-w-[728px] px-3 pt-4 tablet:px-0 laptop:px-3 laptop:pt-8 desktop:px-0">
         <h1 className="border-color mb-5 border-b-2 pb-2.5 text-3xl font-bold">
            Posts
         </h1>
         <section className="mb-7 grid grid-cols-2 gap-4 laptop:grid-cols-5">
            <Form method="post" className="overflow-hidden">
               <button
                  className="border-color bg-1 mb-1.5 flex h-40 w-full
                   items-center justify-center rounded-md border hover:border-blue-200 dark:hover:border-blue-900"
                  name="intent"
                  value="createPost"
                  type="submit"
               >
                  <Plus className="h-7 w-7 text-blue-500" />
               </button>
               <div className="text-1 pl-1 text-sm font-bold">Blank post</div>
            </Form>
         </section>
         <h2 className="pb-2 pl-1 text-lg font-bold">My Posts</h2>
         <div className="border-color bg-1 divide-y overflow-hidden rounded-md border dark:divide-zinc-700">
            {posts?.docs.length === 0 ? (
               <div className="p-3 text-sm ">You have no posts...</div>
            ) : (
               posts.docs.map((posts) => (
                  <Link
                     prefetch="intent"
                     to={posts.id}
                     key={posts.id}
                     className="flex items-center justify-between gap-2 p-3 hover:underline"
                  >
                     <span className="truncate">{posts.title}</span>
                     {posts.isPublished ? (
                        <span className="rounded bg-green-500 py-1 px-2 text-xs text-white">
                           Published
                        </span>
                     ) : (
                        <span className="rounded bg-zinc-500 py-1 px-2 text-xs text-white">
                           Draft
                        </span>
                     )}
                  </Link>
               ))
            )}
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

   if (!user || !user.id) return redirect("/login", { status: 302 });

   const note = await payload.create({
      collection: "notes",
      data: { mdx: "", data: [], ui: "textarea", author: user?.id },
      user,
      overrideAccess: false,
      draft: true,
   });

   const post = await payload.create({
      collection: "posts",
      data: {
         title: "Untitled",
         author: user?.id,
         notes: [note.id],
         site: siteId,
      },
      user,
      overrideAccess: false,
   });

   return redirect(`/${siteId}/posts/${post.id}/edit/${note.id}`);
};

// //Don't revalidate when editing notes
// export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
//    //don't revalidate if formAction is a string that has $noteId
//    if (formAction?.includes("$noteId")) return false;

//    return true;
// };
