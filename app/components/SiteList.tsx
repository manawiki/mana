import type { Site, User } from "payload-types";
import { useRouteLoaderData } from "@remix-run/react";
import { NewSiteModal } from "~/routes/action+/new-site-modal";
import { SiteNavLink } from "~/components/SiteNavLink";

export const SiteList = () => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const sites = user?.sites as Site[];
   return (
      <>
         <ul
            className="text-center max-laptop:grid max-laptop:grid-cols-5
                max-laptop:gap-3 max-tablet:grid-cols-5 max-tablet:gap-2 laptop:mb-4 laptop:space-y-3"
         >
            {sites?.map((item) => (
               <li
                  className="relative flex items-center justify-center"
                  key={item.id}
               >
                  <SiteNavLink site={item} />
               </li>
            ))}
            <div className="laptop:hidden">
               <NewSiteModal />
            </div>
         </ul>
      </>
   );
};
