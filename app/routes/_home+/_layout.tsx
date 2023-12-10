import { Link, Outlet, useLocation } from "@remix-run/react";

import { LogoFull } from "~/components";

import { LoggedIn, LoggedOut } from "../_auth+/src/components";

export default function IndexLayout() {
   return (
      <div className="">
         <main className="flex min-h-screen flex-col overflow-hidden">
            <div className="grow">
               <Header />
               <Outlet />
            </div>
         </main>
         <div
            className="pattern-dots absolute left-0
            top-0 h-full  w-full
            pb-6 pattern-bg-white pattern-zinc-400 pattern-opacity-10 pattern-size-4 
            dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
         ></div>
         <Footer />
      </div>
   );
}

const Header = () => {
   const location = useLocation();

   return (
      <header className="absolute z-30 w-full">
         <div className="mx-auto max-w-6xl px-4">
            <div className="flex h-16 items-center justify-between">
               <LoggedIn>
                  <Link className="block" to="/">
                     <LogoFull />
                  </Link>
               </LoggedIn>
               <LoggedOut>
                  <Link className="block text-white" to="/">
                     <LogoFull />
                  </Link>
               </LoggedOut>
               <nav className="flex items-center gap-4">
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
                              to={`/login?redirectTo=${location.pathname}`}
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
   );
};

const Footer = () => {
   return (
      <footer className="border-color border-t py-4">
         <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-center gap-4">
            <a
               href="https://discord.com/invite/nRNM35ytD7"
               rel="noreferrer"
               target="_blank"
               className="border-1 bg-2 border-color shadow-1 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 16 16"
               >
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
               </svg>
            </a>
            <a
               href="https://github.com/manawiki"
               rel="noreferrer"
               target="_blank"
               className="border-1 bg-2 border-color shadow-1 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm"
            >
               <svg
                  className="h-9 w-9 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
               </svg>
            </a>
            <a
               href="https://twitter.com/mana_wiki"
               rel="noreferrer"
               target="_blank"
               className="border-1 bg-2 border-color shadow-1 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm"
            >
               <svg
                  className="h-8 w-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
               </svg>
            </a>
         </div>
      </footer>
   );
};
