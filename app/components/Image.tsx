interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   url?: string | null | undefined;
   options?: string;
}

export function Image({
   url,
   options,
   alt,
   className,
   width,
   height,
   ...props
}: ImageProps) {
   const searchParams = new URLSearchParams(options);

   // If width is not provided, but it is in the options, insert it to hint the browser and reduce CLS
   if (!width && searchParams.get("width"))
      width = parseInt(searchParams.get("width")!);

   if (!height && searchParams.get("height"))
      height = parseInt(searchParams.get("height")!);

   // If crop is used, then we'll use that as width and height
   if (searchParams.get("crop")) {
      const [cropWidth, cropHeight] = searchParams
         .get("crop")!
         .split("x")
         .map(Number);
      if (!width) width = cropWidth;
      if (!height) height = cropHeight;
   }

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

   // For large images, we'll set breakpoints to provide responsive image sets
   const breakpoints = [430, 640, 728, 1000] as const;

   const maxWidth = typeof width === "string" ? parseInt(width) : width;

   // set srcSet responsive images, do not go over maxWidth
   const srcSet =
      maxWidth && maxWidth > breakpoints[0]
         ? breakpoints
              .map((bp) => (bp < maxWidth ? `${url}?width=${bp} ${bp}w` : null))
              .filter(Boolean)
              .join(", ") + `, ${url}?${searchParams.toString()} ${maxWidth}w`
         : undefined;

   return (
      <img
         {...props}
         className={className}
         width={width ?? searchParams.get("width") ?? undefined}
         height={height ?? searchParams.get("height") ?? undefined}
         alt={alt}
         sizes={srcSet ? `(min-width: 1200px) 728px, 100vw` : undefined}
         srcSet={srcSet}
         src={`${url}?${searchParams.toString()}` ?? "/favicon.ico"}
      />
   );
}
