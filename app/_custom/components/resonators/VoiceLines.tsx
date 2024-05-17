import { Tab, Disclosure } from "@headlessui/react";

import type { Resonator, Image } from "payload/generated-custom-types";
import { Icon } from "~/components/Icon";
import { H2 } from "~/components/Headers";

export function VoiceLines({ data: full }: { data: any }) {
  const char = full.Resonator;

  const lines = char.quotes;
  return (
    <>
      {lines && lines?.length > 0 ? (
        <>
          <H2 text="Voice Lines" />
          <Disclosure>
            {({ open }) => (
              <>
                {/* Make sure rounded appearance changes depending on accordion collapse state */}
                <Disclosure.Button
                  className={`${
                    open ? "rounded-t-lg" : "rounded-lg"
                  } bg-2-sub border-color-sub shadow-1 my-2 flex w-full items-center border px-4 py-3 font-bold shadow-sm`}
                >
                  {/* Accordion Title */}
                  Voice Lines
                  {/* Render the up/down triangle caret for accordion */}
                  <div
                    className={`${
                      open
                        ? "rotate-180 transform font-bold text-gray-600 "
                        : "text-gray-400"
                    } ml-auto inline-block `}
                  >
                    <Icon
                      name="chevron-down"
                      className="text-zinc-500"
                      size={28}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="mb-3">
                  {/* Accordion Contents */}
                  {lines.map((voice, index) => (
                    <>
                      <div
                        key={index}
                        className="bg-2-sub border border-color-sub rounded-lg shadow-sm shadow-1 mb-3 p-3"
                      >
                        <div className="font-header pb-1">{voice.title}</div>
                        <div
                          className="text-1"
                          dangerouslySetInnerHTML={{
                            __html: voice.content ?? "",
                          }}
                        ></div>
                        {/* Voice line player, if voices available, see AudioPlayer code */}
                        {/* @ts-ignore */}
                        <AudioPlayer voice={voice} />
                      </div>
                    </>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </>
      ) : null}
    </>
  );
}

type VoiceType = {
  title?: string | undefined;
  content?: string | undefined;
  vo_en?: Image | undefined;
  vo_ja?: Image | undefined;
  vo_zh?: Image | undefined;
  vo_ko?: Image | undefined;
  id?: string | undefined;
};

const AudioPlayer = ({ voice }: { voice: VoiceType }) => {
  const lang = ["en", "ja", "zh", "ko"];

  return (
    <>
      <div className="w-full">
        {voice?.vo_ja ? (
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
                  <audio controls src={voice.vo_en?.url} preload="none" />
                </Tab.Panel>
                <Tab.Panel>
                  <audio controls src={voice.vo_ja?.url} preload="none" />
                </Tab.Panel>
                <Tab.Panel>
                  <audio controls src={voice.vo_zh?.url} preload="none" />
                </Tab.Panel>
                <Tab.Panel>
                  <audio controls src={voice.vo_ko?.url} preload="none" />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </>
        ) : null}
      </div>
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
