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

      if (!width && height)
         width = Math.round(parseInt(height.toString()) * aspectRatio);
      if (!height && width)
         height = Math.round(parseInt(width.toString()) / aspectRatio);
   }

   // insert it back into the options
   if (!searchParams.get("width") && width)
      searchParams.set("width", width.toString());
   if (!searchParams.get("height") && height)
      searchParams.set("height", height.toString());

   // For large images, we'll set breakpoints to provide responsive image sets
   const breakpoints = [430, 640, 728, 1000] as const;

   // provide for an early return for small images to save on processing
   const maxWidth = typeof width === "string" ? parseInt(width) : width;

   if (maxWidth && maxWidth <= breakpoints[0])
      return (
         <img
            {...props}
            className={className}
            width={width ?? searchParams.get("width") ?? undefined}
            height={height ?? searchParams.get("height") ?? undefined}
            alt={alt}
            src={url ? `${url}?${searchParams.toString()}` : "/favicon.ico"}
         />
      );

   // otherwise, we'll create a responsive image source set
   const breakpointh = breakpoints.map((bp) => {
      return height && width
         ? Math.round(
              (bp * parseInt(height.toString())) / parseInt(width.toString()),
           )
         : undefined;
   });

   function setWH(
      w: string | number | undefined,
      h: string | number | undefined,
   ) {
      if (w) searchParams.set("width", w.toString());
      if (h) searchParams.set("height", h.toString());
      return searchParams;
   }

   // set srcSet responsive images, do not go over maxWidth
   const srcSet =
      maxWidth && maxWidth > breakpoints[0]
         ? breakpoints
              .map((bp, i) =>
                 bp < maxWidth
                    ? `${url}?${setWH(bp, breakpointh[i]).toString()} ${bp}w`
                    : null,
              )
              .filter(Boolean)
              .join(", ") +
           `, ${url}?${setWH(width, height).toString()} ${maxWidth}w`
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
         src={url ? `${url}?${searchParams.toString()}` : "/favicon.ico"}
      />
   );
}
