export function Image({
   url,
   options,
   alt,
   className,
   width,
   height,
   ...props
}: {
   url?: string | null | undefined;
   options?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
   const searchParams = new URLSearchParams(options);

   // If width is not provided, but it is in the options, insert it to hint the browser and reduce CLS
   if (!width && searchParams.get("width"))
      width = parseInt(searchParams.get("width")!);

   if (!height && searchParams.get("height"))
      height = parseInt(searchParams.get("height")!);

   if (searchParams.get("aspect_ratio")) {
      // retrieve aspect ratio from options as calculate it as a decimal
      // aspect ratio should be in the shape of "width:height"
      let aspectRatio = searchParams
         .get("aspect_ratio")!
         .split(":")
         .map(Number)
         .reduce((a, b) => a / b);

      if (!width && height) width = parseInt(height.toString()) * aspectRatio;
      if (!height && width) height = parseInt(width.toString()) / aspectRatio;
   }

   // insert it back into the options
   if (!searchParams.get("width") && width)
      searchParams.set("width", width.toString());
   if (!searchParams.get("height") && height)
      searchParams.set("height", height.toString());

   return (
      <img
         {...props}
         className={className}
         width={width ?? searchParams.get("width") ?? undefined}
         height={height ?? searchParams.get("height") ?? undefined}
         alt={alt}
         src={`${url}?${searchParams.toString()}` ?? "/favicon.ico"}
      />
   );
}
