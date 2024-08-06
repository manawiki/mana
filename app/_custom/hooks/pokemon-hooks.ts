import type { CollectionAfterChangeHook } from "payload/types";

export const pokemonAfterChangeHook: CollectionAfterChangeHook = async ({
   req: { payload },
   doc,
}) => {
   try {
      const fastMoves = doc.fastMoves.map(
         (move: { move: string }) => move.move,
      );
      const chargeMoves = doc.chargeMoves.map(
         (move: { move: string }) => move.move,
      );

      const allMoves = [...fastMoves, ...chargeMoves];

      //Update the moves collection with Pokemon who have this move
      for (const result of allMoves) {
         const existingMove = await payload.findByID({
            //@ts-ignore
            collection: "moves",
            id: result,
            depth: 0,
         });
         //@ts-ignore
         let pokemonWithMove = existingMove?.pokemonWithMove || [];
         const combinePokemonWithMove = [...pokemonWithMove, doc.id];
         const finalPokemonWithMove = Array.from(
            new Set(combinePokemonWithMove),
         );
         // @ts-ignore
         await payload.update({
            collection: "moves",
            id: result,
            data: {
               pokemonWithMove: finalPokemonWithMove,
            },
         });
      }
      return doc;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
