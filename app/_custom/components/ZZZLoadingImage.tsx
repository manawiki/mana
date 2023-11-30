import { Image } from "~/components";

const image = "https://static.mana.wiki/zzz/Run2_LoadingGIF_Bangboo.gif";

export const ZZZLoadingImage = () => {
  return (
    <Image
      url={image}
      options="height=80"
      className="object-contain h-full"
      alt="Loading..."
    />
  );
};
