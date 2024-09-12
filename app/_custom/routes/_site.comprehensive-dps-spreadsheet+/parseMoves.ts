import type { Move } from "payload/generated-custom-types";

export function parseMoves(moves: { docs: Move[] }) {
   return moves?.docs
      ?.map((move: Move) => parseMove(move))
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
}

export type DPSMove = {
   name: string;
   pokeType: keyof typeof moveTypeIcons;
   label: string;
   link: string;
   icon: string;
   power: number;
   dws: number;
   duration: number;
   energyDelta: number;
   effect:
      | string
      | {
           activation_chance: number;
           self_attack_stage_delta: number;
           self_defense_stage_delta: number;
           target_attack_stage_delta: number;
           target_defense_stage_delta: number;
        };
   regular: {
      power: number;
      dws: number;
      duration: number;
      energyDelta: number;
   };
   combat: {
      power: number;
      dws: number;
      duration: number;
      energyDelta: number;
   };
   moveType: "fast" | "charged";
};

export function parseMove(move: Move) {
   let pokeType = move.type as any as keyof typeof moveTypeIcons; //ugly but it works

   let name = move.id,
      label = move.name ?? move.slug ?? move.id,
      link = `/c/moves/${move.slug}`,
      icon = moveTypeIcons[pokeType],
      moveType: "fast" | "charged" =
         move.category === "fast" ? "fast" : "charged";

   // this is set elsewhere with GM.mode move[a] = "pvp" ? move.combat[a] : move.regular[a]
   let power = 0,
      dws = 0,
      duration = 0,
      energyDelta = 0;

   let effect = parseMoveEffect(move);

   let regular = { power: 0, dws: 0, duration: 0, energyDelta: 0 },
      combat = { power: 0, dws: 0, duration: 0, energyDelta: 0 };

   if (move.pve) {
      if (move.pve.power) regular.power = move.pve.power;
      if (move.pve.damageWindowStart)
         regular.dws = move.pve.damageWindowStart * 1000;
      if (move.pve.duration) regular.duration = move.pve.duration * 1000;
      if (moveType === "fast" && move.pve.energyDeltaFast)
         regular.energyDelta = move.pve.energyDeltaFast;
      if (moveType === "charged" && move.pve.energyDeltaCharge)
         regular.energyDelta = -1 * parseInt(move.pve.energyDeltaCharge);
   }

   if (move.pvp && moveType === "fast") {
      if (move.pvp.power) combat.power = move.pvp.power;
      combat.dws = 0;
      combat.duration = move.pvp.turnDurationFast
         ? move.pvp.turnDurationFast + 1
         : 1;
      if (move.pvp.energyDeltaFast)
         combat.energyDelta = move.pvp.energyDeltaFast;
   }

   if (move.pvp && moveType === "charged") {
      if (move.pvp.power) combat.power = move.pvp.power;
      combat.dws = 0;
      combat.duration = 0;
      if (move.pvp.energyDeltaCharge)
         combat.energyDelta = move.pvp.energyDeltaCharge;
   }

   // let's assume pve by default, this might need to be fixed later
   power = regular.power;
   dws = regular.dws;
   duration = regular.duration;
   energyDelta = regular.energyDelta;

   return {
      name,
      pokeType,
      label,
      link,
      icon,
      power,
      dws,
      duration,
      energyDelta,
      effect,
      regular,
      combat,
      moveType,
   };
}

function parseMoveEffect(move: Move) {
   if (move.subject) {
      let stage_delta = move.stageDelta ?? 0;
      let subj_self = move.subject.includes("self");
      let subj_targ = move.subject.includes("opponent");
      let stat_atk = move.stat?.includes("atk");
      let stat_def = move.stat?.includes("def");
      return {
         activation_chance: move.probability ?? 0,
         self_attack_stage_delta: subj_self && stat_atk ? stage_delta : 0,
         self_defense_stage_delta: subj_self && stat_def ? stage_delta : 0,
         target_attack_stage_delta: subj_targ && stat_atk ? stage_delta : 0,
         target_defense_stage_delta: subj_targ && stat_def ? stage_delta : 0,
      };
   }
   return "";
}

// hardcode this because I'm lazy
const moveTypeIcons = {
   bug: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Bug.svg",
   dark: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dark.svg",
   dragon: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Dragon.svg",
   electric:
      "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Electric.svg",
   fairy: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fairy.svg",
   fighting:
      "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fighting.svg",
   fire: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Fire.svg",
   flying: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Flying.svg",
   ghost: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ghost.svg",
   grass: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Grass.svg",
   ground: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ground.svg",
   ice: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Ice.svg",
   normal: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Normal.svg",
   poison: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Poison.svg",
   psychic: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Psychic.svg",
   rock: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Rock.svg",
   steel: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Steel.svg",
   water: "https://static.mana.wiki/pokemongo/Pokemon_Type_Icon_Water.svg",
};
