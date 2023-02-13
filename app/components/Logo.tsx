export const Logo = ({
   options,
   className,
}: {
   options?: string;
   className?: string;
}) => {
   return (
      <img
         className={className}
         alt="Logo"
         src={`https://mana.wiki/cdn-cgi/image/${
            options ?? "width=60,height=60"
         }/https:/static.mana.wiki/file/mana-core/mana-logo.webp`}
      />
   );
};
