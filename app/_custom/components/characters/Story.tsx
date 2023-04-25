import { Disclosure } from "@headlessui/react";

export const Story = ({ pageData }: any) => {
   const stories = pageData.story;
   return (
      <>
         <h2>Story</h2>
         {stories.map((story: any, index: any) => {
            return (
               <>
                  <div key={index}>
                     <Disclosure>
                        {({ open }) => (
                           <>
                              {/* Make sure rounded appearance changes depending on accordion collapse state */}
                              <Disclosure.Button
                                 className={`${
                                    open ? "rounded-t-md" : "rounded-md"
                                 } font-bold bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700
                flex items-center mt-2 w-full border px-3 py-2`}
                              >
                                 {/* Title of story here */}
                                 {story.title}

                                 {/* Render the up/down triangle caret for accordion */}
                                 <div
                                    className={`${
                                       open
                                          ? "transform rotate-180 text-gray-600 font-bold "
                                          : "text-gray-400"
                                    } inline-block ml-auto `}
                                 >
                                    <CaretDownIcon
                                       class="text-brand_1"
                                       w={28}
                                       h={28}
                                    />
                                 </div>
                              </Disclosure.Button>
                              <Disclosure.Panel className="mb-3">
                                 {/* Show unlock conditions if relevant */}
                                 {story.unlock ? (
                                    <div
                                       className="italic text-base bg-gray-100 border-l border-r
              dark:bg-neutral-800 dark:border-neutral-700 py-1 px-3"
                                       dangerouslySetInnerHTML={{
                                          __html: story.unlock,
                                       }}
                                    ></div>
                                 ) : null}

                                 {/* Story Text */}
                                 <div
                                    className="text-base bg-gray-50 border rounded-b dark:bg-neutral-900 dark:border-neutral-700 p-3"
                                    dangerouslySetInnerHTML={{
                                       __html: story.text,
                                    }}
                                 ></div>
                              </Disclosure.Panel>
                           </>
                        )}
                     </Disclosure>
                  </div>
               </>
            );
         })}
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
