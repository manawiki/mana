import { Link, Outlet, useLocation } from "@remix-run/react";
import clsx from "clsx";

import { LogoFull } from "~/components/Logo";

import { Footer } from "./components/Footer";

export default function IndexLayout() {
   return (
      <div className="relative min-h-screen flex flex-col">
         <Header />
         <div className="flex flex-col flex-grow">
            <Outlet />
         </div>
         <Footer />
      </div>
   );
}

function Header() {
   const { pathname } = useLocation();
   return (
      <header
         className={clsx(
            pathname === "/" ? "bg-transparent" : " bg-zinc-900",
            "z-50 w-full absolute",
         )}
      >
         <div className="mx-auto max-w-6xl p-4 flex items-center justify-between w-full">
            <Link className="block text-white" to="/" aria-label="Mana Wiki">
               <LogoFull />
            </Link>
            <nav className="flex items-center gap-4">
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
            </nav>
         </div>
      </header>
   );
}
