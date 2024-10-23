import { Link } from "@remix-run/react";

import { DarkModeToggle } from "~/routes/_site+/action+/theme-toggle";

export function Footer() {
   return (
      <footer
         className="max-laptop:px-5 bg-zinc-50/50 dark:bg-zinc-800/20 pt-10 pb-12 w-full 
         flex items-center border-t border-zinc-100 dark:border-zinc-700/50"
      >
         <div className="max-w-5xl w-full mx-auto space-y-3">
            <div className="flex items-center justify-between">
               <Link to="/">
                  <svg
                     width="78"
                     height="17"
                     viewBox="0 0 78 17"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M0 16.3V7C0 4.8 0.566666 3.1 1.7 1.9C2.83333 0.633333 4.4 0 6.4 0C8.46667 0 10.0333 0.666667 11.1 2C12.1 0.666667 13.6667 0 15.8 0C17.8 0 19.3667 0.633333 20.5 1.9C21.6333 3.1 22.2 4.8 22.2 7V16.3H17.5V6.8C17.5 6.06667 17.3 5.5 16.9 5.1C16.5667 4.63333 16.1 4.4 15.5 4.4C14.9 4.4 14.4 4.63333 14 5.1C13.6667 5.5 13.5 6.06667 13.5 6.8V16.3H8.7V6.8C8.7 6.06667 8.53333 5.5 8.2 5.1C7.86667 4.63333 7.36667 4.4 6.7 4.4C6.1 4.4 5.63333 4.63333 5.3 5.1C4.9 5.5 4.7 6.06667 4.7 6.8V16.3H0ZM32.6 16.6C30.4 16.6 28.5333 15.8333 27 14.3C25.4667 12.7667 24.7 10.8 24.7 8.4C24.7 6 25.4667 4.03333 27 2.5C28.5333 0.9 30.4 0.1 32.6 0.1C34.5333 0.1 36.0667 0.7 37.2 1.9V0.4H41.4V16.3H37.2V14.9C36.0667 16.0333 34.5333 16.6 32.6 16.6ZM30.5 5.5C29.7667 6.23333 29.4 7.2 29.4 8.4C29.4 9.53333 29.7667 10.4667 30.5 11.2C31.1667 11.9333 32.0667 12.3 33.2 12.3C34.3333 12.3 35.2333 11.9333 35.9 11.2C36.6333 10.4667 37 9.53333 37 8.4C37 7.2 36.6333 6.23333 35.9 5.5C35.2333 4.76667 34.3333 4.4 33.2 4.4C32.0667 4.4 31.1667 4.76667 30.5 5.5ZM44.5 16.3V6.9C44.5 4.76667 45.1333 3.1 46.4 1.9C47.6 0.633333 49.3 0 51.5 0C53.6333 0 55.3333 0.633333 56.6 1.9C57.8 3.1 58.4 4.76667 58.4 6.9V16.3H53.7V7.1C53.7 6.23333 53.5 5.56667 53.1 5.1C52.7 4.63333 52.1667 4.4 51.5 4.4C50.7667 4.4 50.2 4.63333 49.8 5.1C49.4667 5.56667 49.3 6.23333 49.3 7.1V16.3H44.5ZM68.8 16.6C66.6 16.6 64.7333 15.8333 63.2 14.3C61.6667 12.7667 60.9 10.8 60.9 8.4C60.9 6 61.6667 4.03333 63.2 2.5C64.7333 0.9 66.6 0.1 68.8 0.1C70.7333 0.1 72.2667 0.7 73.4 1.9V0.4H77.6V16.3H73.4V14.9C72.2667 16.0333 70.7333 16.6 68.8 16.6ZM66.7 5.5C65.9667 6.23333 65.6 7.2 65.6 8.4C65.6 9.53333 65.9667 10.4667 66.7 11.2C67.3667 11.9333 68.2667 12.3 69.4 12.3C70.5333 12.3 71.4333 11.9333 72.1 11.2C72.8333 10.4667 73.2 9.53333 73.2 8.4C73.2 7.2 72.8333 6.23333 72.1 5.5C71.4333 4.76667 70.5333 4.4 69.4 4.4C68.2667 4.4 67.3667 4.76667 66.7 5.5Z"
                        fill="currentColor"
                     />
                  </svg>
               </Link>
               <DarkModeToggle className="!size-10 !justify-end" />
            </div>
            <div className="text-xs text-1 flex items-center gap-3 justify-between border-t border-zinc-200/50 dark:border-zinc-700/80 pt-5">
               <span>© Mana</span>
               <div className="flex items-center gap-2">
                  <Link
                     target="_blank"
                     className="hover:underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-500"
                     to="https://discord.com/invite/nRNM35ytD7"
                  >
                     Discord
                  </Link>
                  <span className="mx-1 text-zinc-300 dark:text-zinc-600">
                     •
                  </span>
                  <Link
                     target="_blank"
                     className="hover:underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-500"
                     to="https://github.com/manawiki"
                  >
                     Github
                  </Link>
                  <span className="mx-1 text-zinc-300 dark:text-zinc-600">
                     •
                  </span>
                  <Link
                     className="hover:underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-500"
                     to="/privacy"
                  >
                     Privacy Policy
                  </Link>
               </div>
            </div>
         </div>
      </footer>
   );
}
