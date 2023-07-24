import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";
import { LogoFull } from "~/components/LogoFull";
import { LoggedOut, LoggedOutDropDown } from "~/modules/auth";

export default function IndexLayout() {
   return (
      <div className="bg-zinc-900">
         <main className="flex min-h-screen flex-col overflow-hidden">
            <div className="grow">
               <Header />
               <Outlet />
            </div>
         </main>
      </div>
   );
}

const Header = () => {
   const { isMobileApp } = useRouteLoaderData("root") as {
      isMobileApp: Boolean;
   };
   return (
      <>
         {!isMobileApp && (
            <header className="absolute z-30 w-full">
               <div className="mx-auto max-w-6xl px-4">
                  <div className="flex h-16 items-center justify-between">
                     <div className="text-dark">
                        <Link className="block" to="/">
                           <LogoFull />
                        </Link>
                     </div>
                     <nav className="">
                        <LoggedOutDropDown />
                        <LoggedOut>
                           <ul className="flex items-center justify-end gap-3">
                              <li>
                                 <Link
                                    to="/join"
                                    className="group relative inline-flex h-8 items-center justify-center overflow-hidden 
                  rounded-lg px-3 py-2  text-indigo-600 shadow shadow-zinc-950 transition duration-300 ease-out"
                                 >
                                    <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                                    <span
                                       className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                     rotate-45 transform rounded-lg bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                                    ></span>
                                    <span className="relative text-xs font-extrabold uppercase text-white">
                                       Sign Up
                                    </span>
                                 </Link>
                              </li>
                              <li>
                                 <Link
                                    className="flex h-[34px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-center 
                  text-xs font-extrabold uppercase text-white shadow-sm shadow-zinc-950"
                                    to="/login"
                                 >
                                    Login
                                 </Link>
                              </li>
                           </ul>
                        </LoggedOut>
                     </nav>
                  </div>
               </div>
            </header>
         )}
      </>
   );
};
