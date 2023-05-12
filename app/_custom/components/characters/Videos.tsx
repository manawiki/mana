import { H2 } from "~/_custom/components/custom";

export const Videos = ({ pageData }: any) => {
   const vids = pageData?.videos;
   return (
      <>
         {vids?.length > 0 ? (
            <>
               <H2 text="Videos" />
               {vids.map((v: any) => {
                  const embedurl = v.url.replace(/.*v=/, "");

                  console.log(`https://www.youtube.com/embed/${embedurl}`);

                  return (
                     <>
                        <div className="text-center">
                           <div className="font-bold text-lg ">{v.title}</div>

                           <div className="hidden">
                              <iframe
                                 width="560"
                                 height="315"
                                 src={`https://www.youtube.com/embed/${embedurl}`}
                                 title="YouTube video player"
                                 frameborder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                 allowfullscreen
                              ></iframe>
                           </div>
                           {/* I have no idea why, but I have to load it at least once first and hide it for the second video player to appear. */}

                           <div className="inline-block px-3 w-full h-64 laptop:h-80">
                              <iframe
                                 width="100%"
                                 height="100%"
                                 src={`https://www.youtube.com/embed/${embedurl}`}
                                 title="YouTube video player"
                                 frameborder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                 allowfullscreen
                              ></iframe>
                           </div>
                        </div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
};
