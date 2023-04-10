import { Tab } from "@headlessui/react";

export const VoiceLines = ({ pageData }: any) => {
   const lines = pageData.voice_lines;
   return (
      <>
         {lines?.length > 0 ? (
            <>
               <h2>Voice Lines</h2>
               <table className="mb-3 w-full">
                  <thead></thead>
                  <tbody>
                     {/* One row per voice line */}
                     {lines.map((voice: any, index: any) => {
                        return (
                           <>
                              {/* Column 1: Voice Line Title + Unlock Cond if applicable */}
                              <tr key={index}>
                                 <td className="bg-gray-50 dark:bg-dark_200 text-sm px-3 py-2">
                                    <div className="font-bold">
                                       {voice.title}
                                    </div>
                                    {/* {voice.voice_unlock ? (
                                          <div
                                            className="italic text-xs bg-gray-100 border rounded 
                                    dark:bg-dark_100 dark:border-dark_50 py-1 px-2  mt-2"
                                            dangerouslySetInnerHTML={{
                                              __html: voice.voice_unlock,
                                            }}
                                          ></div>
                                        ) : null} */}
                                 </td>
                                 {/* Column 2: Voice Line Text + Playback */}
                                 <td className="talent-text text-sm px-3 py-2">
                                    <div
                                       dangerouslySetInnerHTML={{
                                          __html: voice.text,
                                       }}
                                    ></div>
                                    {/* Voice line player, if voices available, see AudioPlayer code */}
                                    <AudioPlayer voice={voice} />
                                 </td>
                              </tr>
                           </>
                        );
                     })}
                  </tbody>
               </table>
            </>
         ) : null}
      </>
   );
};

const AudioPlayer = ({ voice }: any) => {
   const lang = ["en", "jp", "cn", "kr"];

   return (
      <>
         <div className="w-full">
            {voice.voice_jp ? (
               <>
                  <Tab.Group>
                     {/* Create one tab per language of EN, JP, CN, KR */}
                     <Tab.List className="grid grid-cols-4 gap-3 bg-gray-100 dark:bg-dark_100 p-1 rounded-b-lg border border-t-0 border-gray-100 dark:border-dark_50">
                        {lang.map((l: any) => {
                           return (
                              <>
                                 <Tab className="focus:outline-none">
                                    {({ selected }) => (
                                       <div
                                          className={`${
                                             selected
                                                ? "text-blue-500 drop-shadow bg-blue-50 dark:bg-gray-800 font-bold"
                                                : "bg-white dark:bg-dark_50 font-semibold"
                                          } h-6 w-full flex justify-center items-center rounded px-3`}
                                       >
                                          {l.toUpperCase()}
                                       </div>
                                    )}
                                 </Tab>
                              </>
                           );
                        })}
                     </Tab.List>
                     <Tab.Panels>
                        <Tab.Panel>
                           <audio
                              className="w-full h-6 mt-1"
                              controls
                              src={voice.voice_en?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="w-full h-6 mt-1"
                              controls
                              src={voice.voice_jp?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="w-full h-6 mt-1"
                              controls
                              src={voice.voice_cn?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="w-full h-6 mt-1"
                              controls
                              src={voice.voice_kr?.url}
                           ></audio>
                        </Tab.Panel>
                     </Tab.Panels>
                  </Tab.Group>
               </>
            ) : null}
         </div>
      </>
   );
};
