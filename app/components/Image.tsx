export const Image = ({
   url,
   options,
   alt,
   className,
   width,
   height,
   ...props
}: {
   url?: string;
   options?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
   const searchParams = new URLSearchParams(options);

   return (
      <img
         {...props}
         className={className}
         width={width ?? searchParams.get("width") ?? undefined}
         height={height ?? searchParams.get("height") ?? undefined}
         alt={alt}
         src={`${url}?${options ?? ""}` ?? "/favicon.ico"}
      />
   );
};
