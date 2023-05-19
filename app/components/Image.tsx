export const Image = ({
   url,
   options,
   alt,
   className,
   width,
   height,
}: {
   url: string;
   options?: string;
   alt: string;
   className?: string;
   width?: number;
   height?: number;
}) => {
   return (
      <img
         className={className}
         width={width}
         height={height}
         alt={alt}
         src={`https://mana.wiki/cdn-cgi/image/${options ?? ""}/${url}`}
      />
   );
};
