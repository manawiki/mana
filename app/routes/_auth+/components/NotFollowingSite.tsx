import {
   useRootLoaderData,
   useSiteLoaderData,
} from "~/utils/useSiteLoaderData";

export const NotFollowingSite = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { user, following } = useRootLoaderData();

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = useSiteLoaderData();

   if (!user) return null;
   if (following?.some((e: any) => e.id === site?.id)) return null;
   return <>{children}</>;
};
