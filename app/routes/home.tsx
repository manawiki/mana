import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { SiteSwitcher } from "~/components/SiteSwitcher";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (!user) {
      return redirect("/");
   }
   return null;
}

export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Home - Mana",
      },
      {
         name: "description",
         content: "A wiki of your own",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export default function HomePage() {
   return (
      <div
         className="laptop:grid laptop:min-h-screen 
            laptop:auto-cols-[86px_86px_1fr_334px] laptop:grid-flow-col
            desktop:auto-cols-[86px_210px_1fr_334px]"
      >
         <section
            className="laptop:bg-1 relative z-40  border-r border-zinc-200 shadow-zinc-500 dark:border-zinc-800
             dark:shadow-black/60 max-laptop:fixed max-laptop:top-0 max-laptop:h-20  max-laptop:w-full
             max-laptop:bg-gradient-to-b max-laptop:py-4
             laptop:shadow-lg laptop:shadow-zinc-100"
         >
            <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
               <SiteSwitcher />
            </div>
         </section>
      </div>
   );
}
