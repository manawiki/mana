import { Link } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import type {
   PokemonFamily,
   Pokemon as PokemonType,
} from "~/db/payload-custom-types";

export function TypeChart({
   data,
}: {
   data: { pokemon: PokemonType; family: PokemonFamily };
}) {
   const types = data.pokemon.type;

   if (types && types.length == 0) return undefined;

   //-----------------------------------Bug-----------------------------------//

   if (processTypes(types, "Bug")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Bug", "Dark")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: dark, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: psychic, multiplier: 39.1 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Dragon")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Electric")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Fairy")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: flying, multiplier: 256 },
               { type: fairy, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 256 },
               { type: flying, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: bug, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: electric, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 24.4 },
               { type: fighting, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 24.4 },
               { type: normal, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: bug, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 256 },
               { type: flying, multiplier: 256 },
               { type: bug, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 256 },
               { type: rock, multiplier: 256 },
               { type: flying, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: flying, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Steel")) {
      return (
         <TypesTable
            vulnerable={[{ type: fire, multiplier: 256 }]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Bug", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Dark-----------------------------------//

   if (processTypes(types, "Dark")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Dragon")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 256 },
               { type: dragon, multiplier: 160 },
               { type: bug, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Electric")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Fairy")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: ghost, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: flying, multiplier: 160 },
            ]}
            resistant={[
               { type: dark, multiplier: 39.1 },
               { type: ghost, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: ghost, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[{ type: fairy, multiplier: 160 }]}
            resistant={[
               { type: normal, multiplier: 39.1 },
               { type: psychic, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 256 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: bug, multiplier: 160 },
               { type: fairy, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 24.4 },
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Poison")) {
      return (
         <TypesTable
            vulnerable={[{ type: ground, multiplier: 160 }]}
            resistant={[
               { type: dark, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 256 },
               { type: fairy, multiplier: 160 },
            ]}
            resistant={[{ type: psychic, multiplier: 24.4 }]}
         />
      );
   }

   if (processTypes(types, "Dark", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: fairy, multiplier: 160 },
               { type: bug, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 24.4 },
               { type: poison, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dark", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: electric, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
            ]}
            resistant={[
               { type: psychic, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Dragon-----------------------------------//

   if (processTypes(types, "Dragon")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Electric")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Fairy")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 256 },
               { type: dragon, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: bug, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: water, multiplier: 39.1 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 24.4 },
               { type: fire, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 160 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 160 },
               { type: dragon, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Dragon", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dragon, multiplier: 160 },
               { type: fairy, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: water, multiplier: 39.1 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Electric-----------------------------------//

   if (processTypes(types, "Electric")) {
      return (
         <TypesTable
            vulnerable={[{ type: ground, multiplier: 160 }]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Electric", "Fairy")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 260 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: steel, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 24.4 },
               { type: flying, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: flying, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: fighting, multiplier: 160 },
            ]}
            resistant={[
               { type: flying, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: steel, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Electric", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: steel, multiplier: 39.1 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Fairy-----------------------------------//

   if (processTypes(types, "Fairy")) {
      return (
         <TypesTable
            vulnerable={[
               { type: poison, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fairy", "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dark, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fairy", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fairy", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ghost, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: poison, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: steel, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: poison, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: ghost, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dragon, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ghost, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fairy", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: steel, multiplier: 256 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fairy", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fairy", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: dragon, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Fighting-----------------------------------//

   if (processTypes(types, "Fighting")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: flying, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: flying, multiplier: 256 },
               { type: fairy, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: dark, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: rock, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fighting", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: psychic, multiplier: 256 },
               { type: flying, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fairy, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: rock, multiplier: 39.1 },
               { type: dark, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fighting", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fairy, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: dark, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Fire-----------------------------------//

   if (processTypes(types, "Fire")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 256 },
               { type: electric, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: water, multiplier: 256 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: ice, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }
   if (processTypes(types, "Fire", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: psychic, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: fairy, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: water, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: fairy, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: ice, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: steel, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Fire", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: ice, multiplier: 39.1 },
               { type: steel, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Flying-----------------------------------//

   if (processTypes(types, "Flying")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: electric, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 24.4 },
               { type: grass, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: rock, multiplier: 256 },
               { type: electric, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: electric, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: ground, multiplier: 39.1 },
               { type: grass, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fire, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Flying", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 256 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: ground, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Ghost-----------------------------------//

   if (processTypes(types, "Ghost")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Normal")) {
      return (
         <TypesTable
            vulnerable={[{ type: dark, multiplier: 160 }]}
            resistant={[
               { type: normal, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: bug, multiplier: 62.5 },
               { type: ghost, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 256 },
               { type: ghost, multiplier: 256 },
            ]}
            resistant={[
               { type: fighting, multiplier: 24.4 },
               { type: normal, multiplier: 39.1 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: normal, multiplier: 24.4 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: normal, multiplier: 24.4 },
               { type: poison, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ghost", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: electric, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Grass-----------------------------------//

   if (processTypes(types, "Grass")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ice, multiplier: 256 },
               { type: bug, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 24.4 },
               { type: ground, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 256 },
               { type: bug, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 256 },
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: flying, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: poison, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 256 },
               { type: fighting, multiplier: 160 },
            ]}
            resistant={[
               { type: grass, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: electric, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Grass", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: poison, multiplier: 160 },
               { type: flying, multiplier: 160 },
            ]}
            resistant={[
               { type: water, multiplier: 39.1 },
               { type: steel, multiplier: 62.5 },
               { type: ground, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Ground-----------------------------------//

   if (processTypes(types, "Ground")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: ghost, multiplier: 39.1 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: fighting, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 256 },
               { type: water, multiplier: 256 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: ice, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: electric, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 24.4 },
               { type: electric, multiplier: 39.1 },
               { type: rock, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ground", "Water")) {
      return (
         <TypesTable
            vulnerable={[{ type: grass, multiplier: 256 }]}
            resistant={[
               { type: electric, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Ice-----------------------------------//

   if (processTypes(types, "Ice")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[{ type: ice, multiplier: 62.5 }]}
         />
      );
   }

   if (processTypes(types, "Ice", "Normal")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ice", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ice", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: steel, multiplier: 160 },
            ]}
            resistant={[
               { type: ice, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ice", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: steel, multiplier: 256 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: rock, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ice", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: fire, multiplier: 256 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: ice, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Ice", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: rock, multiplier: 160 },
            ]}
            resistant={[
               { type: ice, multiplier: 39.1 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Normal-----------------------------------//

   if (processTypes(types, "Normal")) {
      return (
         <TypesTable
            vulnerable={[{ type: fighting, multiplier: 160 }]}
            resistant={[{ type: ghost, multiplier: 39.1 }]}
         />
      );
   }

   if (processTypes(types, "Normal", "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Normal", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Normal", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Normal", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Normal", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
            ]}
            resistant={[
               { type: ghost, multiplier: 39.1 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Poison-----------------------------------//

   if (processTypes(types, "Poison")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Poison", "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 39.1 },
               { type: fairy, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Poison", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: psychic, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Poison", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: ground, multiplier: 256 },
               { type: fire, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 24.4 },
               { type: bug, multiplier: 39.1 },
               { type: fairy, multiplier: 39.1 },
               { type: grass, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Poison", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: psychic, multiplier: 160 },
            ]}
            resistant={[
               { type: bug, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Psychic-----------------------------------//

   if (processTypes(types, "Psychic")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Psychic", "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Psychic", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: dark, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 39.1 },
               { type: psychic, multiplier: 39.1 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Psychic", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: bug, multiplier: 160 },
               { type: dark, multiplier: 160 },
               { type: electric, multiplier: 160 },
               { type: ghost, multiplier: 160 },
               { type: grass, multiplier: 160 },
            ]}
            resistant={[
               { type: fighting, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Rock-----------------------------------//

   if (processTypes(types, "Rock")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: grass, multiplier: 160 },
               { type: ground, multiplier: 160 },
               { type: steel, multiplier: 160 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: fire, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Rock", "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 256 },
               { type: ground, multiplier: 256 },
               { type: water, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 24.4 },
               { type: flying, multiplier: 39.1 },
               { type: normal, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Rock", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: grass, multiplier: 256 },
               { type: electric, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 39.1 },
               { type: flying, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: poison, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Steel-----------------------------------//

   if (processTypes(types, "Steel")) {
      return (
         <TypesTable
            vulnerable={[
               { type: fighting, multiplier: 160 },
               { type: fire, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: grass, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
            ]}
         />
      );
   }

   if (processTypes(types, "Steel", "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: fighting, multiplier: 160 },
               { type: ground, multiplier: 160 },
            ]}
            resistant={[
               { type: poison, multiplier: 39.1 },
               { type: ice, multiplier: 39.1 },
               { type: steel, multiplier: 39.1 },
               { type: bug, multiplier: 62.5 },
               { type: dragon, multiplier: 62.5 },
               { type: fairy, multiplier: 62.5 },
               { type: flying, multiplier: 62.5 },
               { type: normal, multiplier: 62.5 },
               { type: psychic, multiplier: 62.5 },
               { type: rock, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }

   //-----------------------------------Water-----------------------------------//

   if (processTypes(types, "Water")) {
      return (
         <TypesTable
            vulnerable={[
               { type: electric, multiplier: 160 },
               { type: grass, multiplier: 160 },
            ]}
            resistant={[
               { type: fire, multiplier: 62.5 },
               { type: ice, multiplier: 62.5 },
               { type: steel, multiplier: 62.5 },
               { type: water, multiplier: 62.5 },
            ]}
         />
      );
   }
}

function processTypes(typesAll: PokemonType["type"], ...types: string[]) {
   if (
      typesAll &&
      types?.length == 1 &&
      typesAll?.length == 1 &&
      typesAll?.some((e: any) => e.name === types[0])
   ) {
      return true;
   }

   if (
      typesAll &&
      types?.length == 2 &&
      typesAll?.length == 2 &&
      typesAll?.some((e: any) => e.name === types[0]) &&
      typesAll?.some((e: any) => e.name === types[1])
   ) {
      return true;
   }
}

function TypeRow({
   type,
   multiplier,
   resistance,
}: {
   type: { name: string; icon: string };
   multiplier: number;
   resistance?: boolean;
}) {
   return (
      <Link
         to={`/c/types/${type.name.toLowerCase()}`}
         className="flex items-center justify-between"
      >
         <div className="flex items-center gap-2">
            <Image url={type.icon} width={24} height={24} />
            <span className="font-semibold">{type.name}</span>
         </div>
         <div className="flex items-center gap-2">
            <span
               className={clsx(resistance ? "text-green-500" : "text-red-400 ")}
            >
               {multiplier}%
            </span>
         </div>
      </Link>
   );
}

function TypesTable({
   vulnerable,
   resistant,
}: {
   vulnerable: { type: { name: string; icon: string }; multiplier: number }[];
   resistant: { type: { name: string; icon: string }; multiplier: number }[];
}) {
   return (
      <div className="grid tablet:grid-cols-2 gap-3">
         <Table framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader className="!font-bold flex items-center gap-2 justify-between w-full">
                     <span>Vulnerable</span>
                     <Tooltip placement="left">
                        <TooltipTrigger>
                           <Icon
                              className="text-1"
                              name="swords"
                              title="Vulnerable"
                              size={16}
                           />
                        </TooltipTrigger>
                        <TooltipContent>
                           Takes % more damage from attacks
                        </TooltipContent>
                     </Tooltip>
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {vulnerable.map((v) => (
                  <TableRow key={v.type.name}>
                     <TableCell>
                        <TypeRow type={v.type} multiplier={v.multiplier} />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <Table framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader className="!font-bold flex items-center gap-2 justify-between w-full">
                     <span>Resistant</span>
                     <Tooltip placement="left">
                        <TooltipTrigger>
                           <Icon
                              className="text-1"
                              name="shield"
                              title="Resistant"
                              size={16}
                           />
                        </TooltipTrigger>
                        <TooltipContent>
                           Takes % less damage from attacks
                        </TooltipContent>
                     </Tooltip>
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {resistant.map((r) => (
                  <TableRow key={r.type.name}>
                     <TableCell>
                        <TypeRow
                           type={r.type}
                           multiplier={r.multiplier}
                           resistance
                        />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}

const bug = {
   name: "Bug",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Bug.svg",
};
const dark = {
   name: "Dark",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dark.svg",
};
const dragon = {
   name: "Dragon",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dragon.svg",
};
const electric = {
   name: "Electric",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Electric.svg",
};
const fairy = {
   name: "Fairy",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fairy.svg",
};
const fighting = {
   name: "Fighting",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fighting.svg",
};
const fire = {
   name: "Fire",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fire.svg",
};
const flying = {
   name: "Flying",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Flying.svg",
};
const ghost = {
   name: "Ghost",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ghost.svg",
};
const grass = {
   name: "Grass",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Grass.svg",
};
const ground = {
   name: "Ground",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ground.svg",
};
const ice = {
   name: "Ice",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ice.svg",
};
const normal = {
   name: "Normal",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Normal.svg",
};
const poison = {
   name: "Poison",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Poison.svg",
};
const psychic = {
   name: "Psychic",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Psychic.svg",
};
const rock = {
   name: "Rock",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Rock.svg",
};
const steel = {
   name: "Steel",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Steel.svg",
};
const water = {
   name: "Water",
   icon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Water.svg",
};
