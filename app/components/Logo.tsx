export const Logo = ({
   options,
   className,
   width,
   height,
}: {
   options?: string;
   className?: string;
   width?: number;
   height?: number;
}) => {
   return (
      <img
         className={className}
         alt="Logo"
         width={width}
         height={height}
         src={`https://mana.wiki/cdn-cgi/image/${
            options ?? "width=60,height=60"
         }/https:/static.mana.wiki/file/mana-core/logo.png`}
      />
   );
};
