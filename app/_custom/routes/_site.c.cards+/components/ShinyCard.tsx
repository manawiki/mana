import React from "react";
// import { Rarity, Supertype, Subtype } from './types/Types'
// import { useSpringRotator, useSpringBackground, useSpringGlare } from './hooks/useCssSprings

import { useSpring } from "@react-spring/web";
const SPRING_CONFIG = {
   mass: 1,
   tension: 170,
   friction: 18,
   velocity: 0,
   precision: 0.01,
};

export const ShinyCard = ({
   supertype = "pokémon",
   subtype = "basic",
   rarity = "common",
   image,
   dataGallery = "false",
   children = undefined,
   ...props
}: {
   supertype: Supertype;
   subtype: Subtype;
   rarity: Rarity;
   image?: string;
   dataGallery: "true" | "false";
   children: any;
}) => {
   const rotatorRef = React.useRef<HTMLDivElement>(null);
   const { setSpringBackground } = useSpringBackground(rotatorRef);
   const { setSpringRotate } = useSpringRotator(rotatorRef);
   const { setSpringGlare } = useSpringGlare(rotatorRef);
   const handleMouseIn = () => {
      if (
         rarity === "custom" &&
         typeof image === "string" &&
         rotatorRef.current
      ) {
         rotatorRef.current.style.setProperty("--customimage", `url(${image})`);
      }
   };
   // update spring positions on mouse movement...
   const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLButtonElement;
      const rect = target.getBoundingClientRect();
      // get mouse position from left / top
      const absolute = {
         x: e.clientX - rect.left,
         y: e.clientY - rect.top,
      };
      // get mouse position from left / top in percent
      const percent = {
         x: Math.floor((100 / rect.width) * absolute.x),
         y: Math.floor((100 / rect.height) * absolute.y),
      };
      // get mouse position from center
      const center = {
         x: percent.x - 50,
         y: percent.y - 50,
      };
      // set the constants... this is redundant but meh
      if (rotatorRef.current) {
         rotatorRef.current.style.setProperty("--s", "1");
         rotatorRef.current.style.setProperty("--tx", "0px");
         rotatorRef.current.style.setProperty("--ty", "0px");
      }
      setSpringBackground({
         x: Math.round(50 + percent.x / 4 - 12.5),
         y: Math.round(50 + percent.y / 3 - 16.67),
      });
      //   setSpringRotate({
      //      x: Math.floor(-(center.x / 3.5)),
      //      y: Math.floor(center.y / 2),
      //   });
      setSpringGlare({
         x: Math.round(percent.x),
         y: Math.round(percent.y),
         o: 1,
      });
   };
   // reset springs, when mouse exits...
   const handleMouseOut = () => {
      setTimeout(() => {
         //  setSpringRotate({ x: 0, y: 0 });
         setSpringGlare({ x: 50, y: 50, o: 0 });
         setSpringBackground({ x: 50, y: 50 });
      }, 100);
   };
   return (
      <React.Fragment>
         <div
            className="card"
            data-supertype={supertype}
            data-subtypes={subtype}
            data-rarity={rarity}
            data-gallery={dataGallery}
         >
            <div className="card__translater">
               <div
                  ref={rotatorRef}
                  className="card__rotator"
                  onMouseEnter={handleMouseIn}
                  onMouseMove={handleMouseOver}
                  onMouseLeave={handleMouseOut}
               >
                  <div className="card__front">
                     <div {...props}>{children}</div>
                     <div className={`card__shine ${subtype} ${supertype}`} />
                     <div className={`card__glare ${subtype} ${rarity}`} />
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
};

export const ShinyCardRotate = ({
   supertype = "pokémon",
   subtype = "basic",
   rarity = "common",
   image,
   dataGallery = "false",
   children = undefined,
   ...props
}: {
   supertype: Supertype;
   subtype: Subtype;
   rarity: Rarity;
   image?: string;
   dataGallery: "true" | "false";
   children: any;
}) => {
   const rotatorRef = React.useRef<HTMLDivElement>(null);
   const { setSpringBackground } = useSpringBackground(rotatorRef);
   const { setSpringRotate } = useSpringRotator(rotatorRef);
   const { setSpringGlare } = useSpringGlare(rotatorRef);
   const handleMouseIn = () => {
      if (
         rarity === "custom" &&
         typeof image === "string" &&
         rotatorRef.current
      ) {
         rotatorRef.current.style.setProperty("--customimage", `url(${image})`);
      }
   };
   // update spring positions on mouse movement...
   const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLButtonElement;
      const rect = target.getBoundingClientRect();
      // get mouse position from left / top
      const absolute = {
         x: e.clientX - rect.left,
         y: e.clientY - rect.top,
      };
      // get mouse position from left / top in percent
      const percent = {
         x: Math.floor((100 / rect.width) * absolute.x),
         y: Math.floor((100 / rect.height) * absolute.y),
      };
      // get mouse position from center
      const center = {
         x: percent.x - 50,
         y: percent.y - 50,
      };
      // set the constants... this is redundant but meh
      if (rotatorRef.current) {
         rotatorRef.current.style.setProperty("--s", "1");
         rotatorRef.current.style.setProperty("--tx", "0px");
         rotatorRef.current.style.setProperty("--ty", "0px");
      }
      setSpringBackground({
         x: Math.round(50 + percent.x / 4 - 12.5),
         y: Math.round(50 + percent.y / 3 - 16.67),
      });
      setSpringRotate({
         x: Math.floor(-(center.x / 3.5)),
         y: Math.floor(center.y / 2),
      });
      setSpringGlare({
         x: Math.round(percent.x),
         y: Math.round(percent.y),
         o: 1,
      });
   };
   // reset springs, when mouse exits...
   const handleMouseOut = () => {
      setTimeout(() => {
         setSpringRotate({ x: 0, y: 0 });
         setSpringGlare({ x: 50, y: 50, o: 0 });
         setSpringBackground({ x: 50, y: 50 });
      }, 100);
   };
   return (
      <React.Fragment>
         <div
            className="card"
            data-supertype={supertype}
            data-subtypes={subtype}
            data-rarity={rarity}
            data-gallery={dataGallery}
         >
            <div className="card__translater">
               <div
                  ref={rotatorRef}
                  className="card__rotator"
                  onMouseEnter={handleMouseIn}
                  onMouseMove={handleMouseOver}
                  onMouseLeave={handleMouseOut}
               >
                  <div className="card__front">
                     <div {...props}>{children}</div>
                     <div className={`card__shine ${subtype} ${supertype}`} />
                     <div className={`card__glare ${subtype} ${rarity}`} />
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
};

/**
 * Sets the rx and ry css variables on the provided element, based on the x and y values of the spring.
 * @param rotatorRef
 * @returns
 */
const useSpringRotator = (rotatorRef: React.RefObject<HTMLElement>) => {
   const [, setSpringRotate] = useSpring(
      () => ({
         from: { x: 0, y: 0 },
         to: { x: 0, y: 0 },
         config: SPRING_CONFIG,
         onChange(result) {
            const { x, y } = result.value;
            const styling = {
               rx: x + "deg",
               ry: y + "deg",
            };
            if (rotatorRef.current) {
               rotatorRef.current.style.setProperty("--rx", styling.rx);
               rotatorRef.current.style.setProperty("--ry", styling.ry);
            }
         },
      }),
      [],
   );
   return { setSpringRotate };
};
/**
 * Sets the pos, posx, and posy css variables on the provided element, based on the x and y values of the spring.
 * @param rotatorRef
 * @returns
 */
const useSpringBackground = (rotatorRef: React.RefObject<HTMLElement>) => {
   const [, setSpringBackground] = useSpring(
      () => ({
         from: { x: 0, y: 0 },
         to: { x: 0, y: 0 },
         config: SPRING_CONFIG,
         onChange(result) {
            const { x, y } = result.value;
            const styling = {
               pos: x + "% " + y + "%",
               posx: x + "%",
               posy: y + "%",
            };
            if (rotatorRef.current) {
               rotatorRef.current.style.setProperty("--pos", styling.pos);
               rotatorRef.current.style.setProperty("--posx", styling.posx);
               rotatorRef.current.style.setProperty("--posy", styling.posy);
            }
         },
      }),
      [],
   );
   return { setSpringBackground };
};
const clamp = (value: number, min: number, max: number) => {
   return Math.min(Math.max(value, min), max);
};
/**
 * Sets the mx, my, o, hyp css variables on the provided element, based on the x, y and o values of the spring.
 * @param rotatorRef
 * @returns
 */
const useSpringGlare = (rotatorRef: React.RefObject<HTMLElement>) => {
   const [, setSpringGlare] = useSpring(
      () => ({
         from: { x: 0, y: 0, o: 1 },
         to: { x: 0, y: 0, o: 1 },
         config: SPRING_CONFIG,
         onChange(result) {
            const { x, y, o } = result.value;
            const styling = {
               mx: x + "%",
               my: y + "%",
               o: o + "",
               hyp:
                  clamp(
                     Math.sqrt((y - 50) * (y - 50) + (x - 50) * (x - 50)) / 50,
                     0,
                     1,
                  ) + "",
            };
            if (rotatorRef.current) {
               rotatorRef.current.style.setProperty("--mx", styling.mx);
               rotatorRef.current.style.setProperty("--my", styling.my);
               rotatorRef.current.style.setProperty("--o", styling.o);
               rotatorRef.current.style.setProperty("--hyp", styling.hyp);
            }
         },
      }),
      [],
   );
   return { setSpringGlare };
};

declare type Rarity =
   | "custom"
   | "common"
   | "radiant rare"
   | "rare holo"
   | "rare holo galaxy"
   | "rare holo v"
   | "rare holo vmax"
   | "rare holo vstar"
   | "rare rainbow"
   | "rare rainbow alt"
   | "rare secret"
   | "rare ultra"
   | "uncommon";
declare type Subtype =
   | "basic"
   | "basic v"
   | "basic v fusion strike"
   | "basic v rapid strike"
   | "basic v single strike"
   | "item"
   | "pokémon tool"
   | "stadium"
   | "stage 1"
   | "stage 2"
   | "stage 2 rapid strike"
   | "supporter"
   | "vmax"
   | "vmax rapid strike"
   | "vmax single strike"
   | "vstar";
declare type Supertype = "pokémon" | "trainer";
