import type { Character } from "payload/generated-custom-types";
import { H2 } from "~/components/H2";

export const Videos = ({ pageData }: { pageData: Character }) => {
   const vids = pageData?.videos;
   return (
      <>
         {vids && vids?.length > 0 ? (
            <>
               <H2 text="Videos" />
               {vids.map((v: any) => {
                  const embedurl = v.url.replace(/.*v=/, "");

                  // console.log(`https://www.youtube.com/embed/${embedurl}`);

                  return (
                     <>
                        <div className="text-center">
                           <div className="text-lg font-bold ">{v.title}</div>

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

                           <div className="inline-block h-64 w-full px-3 laptop:h-80">
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
