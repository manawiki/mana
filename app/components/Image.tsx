export const Image = ({
   url,
   options,
   alt,
   className,
}: {
   url: string;
   options?: string;
   alt: string;
   className?: string;
}) => {
   return (
      <img
         alt={alt}
         src={`https://mana.wiki/cdn-cgi/image/${options}/${url}`}
      />
   );
};
