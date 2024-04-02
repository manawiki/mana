import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import type { Pokemon as PokemonType } from "~/db/payload-custom-types";

export function TypeChart({ data: pokemon }: { data: PokemonType }) {
   const types = pokemon.type;
   return (
      <>
         <div className="grid laptop:grid-cols-2 gap-3">
            <Table framed dense>
               <TableHead>
                  <TableRow>
                     <TableHeader className="text-red-400">
                        Vulnerable
                     </TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  <TableRow>
                     <TableCell>asdasd</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Another</TableCell>
                  </TableRow>
               </TableBody>
            </Table>
            <Table framed dense>
               <TableHead>
                  <TableRow>
                     <TableHeader className="text-green-500">
                        Resistant
                     </TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  <TableRow>
                     <TableCell>sup</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Another</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>zxc</TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </div>
      </>
   );
}
