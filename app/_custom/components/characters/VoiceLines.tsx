import { Tab } from "@headlessui/react";

import type { Character, Image } from "payload/generated-custom-types";

export const VoiceLines = ({
   data,
}: {
   data: {
      character: Character;
   };
}) => {
   const { character } = data;

   const lines = character.voice_lines;
   return (
      <>
         {lines && lines?.length > 0
            ? lines.map((voice, index) => (
                 <div
                    key={index}
                    className="bg-2-sub border border-color-sub rounded-lg shadow-sm shadow-1 mb-3 p-3"
                 >
                    <div className="font-header pb-1">{voice.title}</div>
                    <div
                       className="text-1"
                       dangerouslySetInnerHTML={{
                          __html: voice.text ?? "",
                       }}
                    ></div>
                    {/* Voice line player, if voices available, see AudioPlayer code */}
                    {/* @ts-ignore */}
                    <AudioPlayer voice={voice} />
                 </div>
              ))
            : null}
      </>
   );
};

type VoiceType = {
   title?: string | undefined;
   text?: string | undefined;
   voice_en?: Image | undefined;
   voice_jp?: Image | undefined;
   voice_cn?: Image | undefined;
   voice_kr?: Image | undefined;
   id?: string | undefined;
};

const AudioPlayer = ({ voice }: { voice: VoiceType }) => {
   const lang = ["en", "jp", "cn", "kr"];

   return (
      <>
         <div className="w-full">
            {voice?.voice_jp ? (
               <>
                  <Tab.Group>
                     {/* Create one tab per language of EN, JP, CN, KR */}
                     <Tab.List className="grid grid-cols-4 gap-3 rounded-lg py-3">
                        {lang.map((l) => (
                           <Tab className="focus:outline-none" key={l}>
                              {({ selected }) => (
                                 <div
                                    className={`${
                                       selected
                                          ? "bg-zinc-200 border-zinc-300 dark:bg-dark500 dark:border-zinc-500"
                                          : "bg-3-sub"
                                    } shadow-1 border-color flex h-6 w-full text-sm items-center justify-center rounded-full border px-3 shadow-sm`}
                                 >
                                    {l.toUpperCase()}
                                 </div>
                              )}
                           </Tab>
                        ))}
                     </Tab.List>
                     <Tab.Panels>
                        <Tab.Panel>
                           <audio
                              controls
                              src={voice.voice_en?.url}
                              preload="none"
                           />
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              controls
                              src={voice.voice_jp?.url}
                              preload="none"
                           />
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              controls
                              src={voice.voice_cn?.url}
                              preload="none"
                           />
                        </Tab.Panel>
                        <Tab.Panel>
                           <audio
                              controls
                              src={voice.voice_kr?.url}
                              preload="none"
                           />
                        </Tab.Panel>
                     </Tab.Panels>
                  </Tab.Group>
               </>
            ) : null}
         </div>
      </>
   );
};
