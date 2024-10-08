import css from "@mountainpass/react-pokemon-cards/dist/css/cards.css";
import { Link } from "@remix-run/react";

import { Image } from "~/components/Image";

import { ShinyCardRotate } from "./components/ShinyCard";
import { useEntryLoaderData } from "../_site.c.cards+/$entryId";

export const links = () => [{ rel: "stylesheet", href: css }];

export default function Holocard() {
   const data = useEntryLoaderData();
   console.log("Data: ", data);

   const card = data?.entry?.data.card as Card;

   // get card rarity type data from data
   const rarity = "rare secret";

   return (
      <Link
         // make this a modal
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
         to=".."
      >
         <ShinyCardRotate
            rarity={rarity}
            style={{ width: "367px", height: "512px" }}
         >
            <Image
               className="rounded-lg overflow-hidden mx-auto max-tablet:mb-4"
               url={card.image?.url}
               alt={card.name ?? "Card Image"}
            />
         </ShinyCardRotate>
      </Link>
   );
}
