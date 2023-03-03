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
         content: "Build Better Wikis",
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
            className="bg-1 relative z-40 border-r border-color
               max-laptop:fixed max-laptop:top-0 max-laptop:w-full
               max-laptop:py-3"
         >
            <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
               <SiteSwitcher />
            </div>
         </section>
         <section>
            <div
               className="bg-1 laptop:bg-2 fixed bottom-0
                        mx-auto w-full px-4 laptop:border-r border-color
                        max-laptop:z-40 max-laptop:flex max-laptop:h-12 max-laptop:border-t
                        laptop:top-0 laptop:h-full laptop:w-[86px]
                        laptop:space-y-1 laptop:overflow-y-auto laptop:py-5 desktop:w-[210px] desktop:px-5"
            >
               <LoggedIn>
                  <Form action="/logout" method="post">
                     <button
                        type="submit"
                        className="bg-3 shadow-1 shadow-sm flex h-12 w-full items-center justify-between gap-3 rounded-lg px-5 text-left"
                     >
                        <span className="font-bold">Logout</span>
                        <LogOut
                           size={18}
                           className="text-red-400 dark:text-red-300"
                        />
                     </button>
                  </Form>
               </LoggedIn>
            </div>
         </section>
      </div>
   );
}
