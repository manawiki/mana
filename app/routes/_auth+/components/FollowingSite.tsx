import {
   useRootLoaderData,
   useSiteLoaderData,
} from "~/utils/useSiteLoaderData";

export const FollowingSite = ({ children }: { children: React.ReactNode }) => {
   const { following } = useRootLoaderData();

   const { site } = useSiteLoaderData();

   if (site && following?.some((e: any) => e.id === site?.id))
      return <>{children}</>;
   return null;
};
