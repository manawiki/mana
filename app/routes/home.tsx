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
                className="border-color max-laptop:py-4 max-laptop:bg-gradient-to-b max-laptop:w-full  
                    max-laptop:dark:from-zinc-900 max-laptop:from-zinc-100 max-laptop:dark:to-zinc-800
                    max-laptop:to-zinc-50 max-laptop:fixed max-laptop:h-20 max-laptop:top-0 laptop:bg-1
                    relative laptop:border-r"
            >
                <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
                    <SiteSwitcher />
                </div>
            </section>
        </div>
    );
}
