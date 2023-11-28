import { useState, useEffect } from "react";
import { Image } from "~/components";

const imageList = [
  "https://static.mana.wiki/zzz/Run2_00000.png",
  "https://static.mana.wiki/zzz/Run2_00001.png",
  "https://static.mana.wiki/zzz/Run2_00002.png",
  "https://static.mana.wiki/zzz/Run2_00003.png",
  "https://static.mana.wiki/zzz/Run2_00004.png",
  "https://static.mana.wiki/zzz/Run2_00005.png",
  "https://static.mana.wiki/zzz/Run2_00006.png",
  "https://static.mana.wiki/zzz/Run2_00007.png",
  "https://static.mana.wiki/zzz/Run2_00008.png",
  "https://static.mana.wiki/zzz/Run2_00009.png",
  "https://static.mana.wiki/zzz/Run2_00010.png",
  "https://static.mana.wiki/zzz/Run2_00011.png",
  "https://static.mana.wiki/zzz/Run2_00012.png",
  "https://static.mana.wiki/zzz/Run2_00013.png",
  "https://static.mana.wiki/zzz/Run2_00014.png",
  "https://static.mana.wiki/zzz/Run2_00015.png",
  "https://static.mana.wiki/zzz/Run2_00016.png",
  "https://static.mana.wiki/zzz/Run2_00017.png",
  "https://static.mana.wiki/zzz/Run2_00018.png",
  "https://static.mana.wiki/zzz/Run2_00019.png",
  "https://static.mana.wiki/zzz/Run2_00020.png",
  "https://static.mana.wiki/zzz/Run2_00021.png",
  "https://static.mana.wiki/zzz/Run2_00022.png",
  "https://static.mana.wiki/zzz/Run2_00023.png",
  "https://static.mana.wiki/zzz/Run2_00024.png",
  "https://static.mana.wiki/zzz/Run2_00025.png",
  "https://static.mana.wiki/zzz/Run2_00026.png",
  "https://static.mana.wiki/zzz/Run2_00027.png",
  "https://static.mana.wiki/zzz/Run2_00028.png",
  "https://static.mana.wiki/zzz/Run2_00029.png",
];

export const ZZZLoadingImage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => {
      let index = currentImage + 1;
      if (index >= imageList.length) {
        index = 0;
      }
      setCurrentImage(index);
    }, 20); // milliseconds for loop of animation

    return () => {
      clearTimeout(timeout);
    };
  }, [currentImage]);

  return (
    <Image
      url={imageList[currentImage]}
      options="height=80"
      className="object-contain"
      alt="Loading..."
    />
  );
};
