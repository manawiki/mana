import { Form, Outlet } from "@remix-run/react";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import { LogOut } from "lucide-react";
import { LoggedIn } from "~/modules/auth";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (!user) {
      return redirect("/");
   }
   return null;
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "User - Mana",
      },
      {
         name: "description",
         content: "A wiki of your own",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function UserIndex() {
   return (
      <div
         className="laptop:grid laptop:min-h-screen 
        laptop:auto-cols-[86px_86px_1fr_334px] laptop:grid-flow-col
        desktop:auto-cols-[86px_210px_1fr_334px]"
      >
         <section
            className="border-color laptop:bg-1 relative max-laptop:fixed  
                    max-laptop:top-0 max-laptop:h-20 max-laptop:w-full
                    max-laptop:bg-gradient-to-b max-laptop:from-zinc-100 max-laptop:to-zinc-50 max-laptop:py-4 max-laptop:dark:from-zinc-900
                    max-laptop:dark:to-zinc-800 laptop:border-r"
         >
            <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
               <SiteSwitcher />
            </div>
         </section>
         <section>
            <div
               className="border-color bg-1 fixed bottom-0 mx-auto
                        w-full max-laptop:z-20 max-laptop:flex max-laptop:h-12 max-laptop:border-t laptop:top-0 laptop:h-full laptop:w-[86px] 
                        laptop:space-y-4 laptop:overflow-y-auto laptop:border-r laptop:py-6
                        desktop:w-[210px] desktop:space-y-1"
            >
               <LoggedIn>
                  <Form className="px-4" action="/logout" method="post">
                     <button
                        type="submit"
                        className="bg-2 flex h-12 w-full items-center justify-between gap-3 rounded-lg px-5 text-left"
                     >
                        <span className="font-bold">Logout</span>
                        <LogOut className="h-4 w-4 text-red-400 dark:text-red-300" />
                     </button>
                  </Form>
               </LoggedIn>
            </div>
         </section>
      </div>
   );
}
