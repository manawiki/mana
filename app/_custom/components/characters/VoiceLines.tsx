import { Tab } from "@headlessui/react";
import { H2 } from "../custom";

export const VoiceLines = ({ pageData }: any) => {
   const lines = pageData.voice_lines;
   return (
      <>
         {lines?.length > 0 ? (
            <>
               <H2 text="Voice Lines" />
               <table className="mb-3 w-full">
                  <thead></thead>
                  <tbody>
                     {/* One row per voice line */}
                     {lines.map((voice: any, index: any) => {
                        return (
                           <>
                              {/* Column 1: Voice Line Title + Unlock Cond if applicable */}
                              <tr key={index}>
                                 <th className="px-3 py-2 text-sm">
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
                                 </th>
                                 {/* Column 2: Voice Line Text + Playback */}
                                 <td className="talent-text px-3 py-4 text-sm">
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
                     <Tab.List className="grid grid-cols-4 gap-3 rounded-lg py-3">
                        {lang.map((l: any) => {
                           return (
                              <>
                                 <Tab className="focus:outline-none">
                                    {({ selected }) => (
                                       <div
                                          className={`${
                                             selected
                                                ? "bg-yellow-50 dark:bg-yellow-500/10"
                                                : "bg-white dark:bg-bg2Dark"
                                          } shadow-1 border-color flex h-6 w-full items-center justify-center rounded-full border px-3 shadow-sm`}
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
                              className="mt-1 h-6 w-full"
                              controls
                              src={voice.voice_en?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="mt-1 h-6 w-full"
                              controls
                              src={voice.voice_jp?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="mt-1 h-6 w-full"
                              controls
                              src={voice.voice_cn?.url}
                           ></audio>
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              className="mt-1 h-6 w-full"
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
