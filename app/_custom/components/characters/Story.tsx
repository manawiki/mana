import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

import type { Character } from "payload/generated-custom-types";
import { H2Default } from "~/components/H2";

export const Story = ({ pageData }: { pageData: Character }) => {
   const stories = pageData.story;
   return (
      <>
         {stories && stories?.length > 0 ? (
            <>
               <H2Default text="Story" />
               {stories?.map((story, index) => (
                  <div key={index}>
                     <Disclosure>
                        {({ open }) => (
                           <>
                              {/* Make sure rounded appearance changes depending on accordion collapse state */}
                              <Disclosure.Button
                                 className={`${
                                    open ? "rounded-t-lg" : "rounded-lg"
                                 } bg-2-sub border-color-sub shadow-1 mt-2 flex w-full items-center border px-4 py-3 font-bold shadow-sm`}
                              >
                                 {/* Title of story here */}
                                 {story.title}

                                 {/* Render the up/down triangle caret for accordion */}
                                 <div
                                    className={`${
                                       open
                                          ? "rotate-180 transform font-bold text-gray-600 "
                                          : "text-gray-400"
                                    } ml-auto inline-block `}
                                 >
                                    <ChevronDown
                                       className="text-zinc-500"
                                       size={28}
                                    />
                                 </div>
                              </Disclosure.Button>
                              <Disclosure.Panel className="mb-3">
                                 {/* Show unlock conditions if relevant */}
                                 {story.unlock ? (
                                    <div
                                       className="bg-2-sub border-color-sub text-1 border-x p-3 text-sm font-bold italic"
                                       dangerouslySetInnerHTML={{
                                          __html: story.unlock,
                                       }}
                                    ></div>
                                 ) : null}

                                 {/* Story Text */}
                                 <div
                                    className="bg-3-sub border-color-sub rounded-b-lg border-t-0 border p-3 text-base"
                                    dangerouslySetInnerHTML={{
                                       __html: story.text ?? "",
                                    }}
                                 ></div>
                              </Disclosure.Panel>
                           </>
                        )}
                     </Disclosure>
                  </div>
               ))}
            </>
         ) : null}
      </>
   );
};

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);
