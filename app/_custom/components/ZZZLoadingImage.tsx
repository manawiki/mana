import { Image } from "~/components";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

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

const ToolTipTest = () => {
  return (
    <Tooltip>
      <TooltipTrigger className={"CLASSES"}>
        <span className="text-1 truncate">BASETEXT</span>
      </TooltipTrigger>
      <TooltipContent>TOOLTIPTEXT</TooltipContent>
    </Tooltip>
  );
};
