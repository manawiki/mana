import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";
import { SidebarItem } from "./SidebarItem";

export function FollowingListMobile({ setMenuOpen }: { setMenuOpen?: any }) {
   const { following } = useRootLoaderData();

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="grid justify-items-center grid-cols-5 mobile:grid-cols-5 tablet:grid-cols-9 laptop:grid-cols-10 gap-4">
                  {following?.map((item) => (
                     <SidebarItem key={item.slug} site={item} />
                  ))}
               </div>
            )}
         </LoggedIn>
      </>
   );
}
