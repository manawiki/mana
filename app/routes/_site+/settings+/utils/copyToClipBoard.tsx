import { Icon } from "~/components/Icon";
import { delay } from "~/utils/delay";

export async function copyToClipBoard(copyMe: string, setCopySuccess: any) {
   try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess(
         <Icon name="copy-check" className="text-green-500" size={14} />,
      );
      await delay(2000);
      setCopySuccess(<Icon name="copy" size={14} />);
   } catch (err) {
      setCopySuccess(<Icon name="copy-x" size={14} />);
   }
}
