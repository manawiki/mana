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
   const searchParams = new URLSearchParams(options);

   return (
      <img
         className={className}
         width={width ?? searchParams.get("width") ?? undefined}
         height={height ?? searchParams.get("height") ?? undefined}
         alt={alt}
         src={`${url}?${options ?? ""}`}
      />
   );
};
