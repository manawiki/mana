import { ZZZLoadingImage } from "~/_custom/components/ZZZLoadingImage";

export const ZZZUnderConstruction = () => {
  return (
    <>
      <div className="my-4 dark:invert-0 invert h-28 w-full flex items-center justify-center">
        <ZZZLoadingImage />
      </div>
      <div className="text-center w-full text-2xl">Under Construction!</div>
    </>
  );
};
