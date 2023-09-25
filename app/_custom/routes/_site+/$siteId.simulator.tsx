/**
  Summon Simulator page
  implementation notes:
    1. switching banners will reset the guaranteed rateup counter
    2. switching banners will reset the epitomized weapon thing (nonTargetWeaponPulled counter)

  TODO:
    1. Implement select for switching banners in a better way
*/

import { useRef, useEffect, useState } from "react";

import { Disclosure, Combobox } from "@headlessui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { settings } from "mana-config";
import { Image } from "~/components";
import { H2 } from "~/components/H2";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderFunctionArgs) {
   let url = `https://${settings.siteId}-db.${settings.domain}/api/banners?limit=500&sort=id`;
   const bannerRaw = await fetchWithCache(url);
   const banners = bannerRaw.docs;

   url = `https://${settings.siteId}-db.${settings.domain}/api/characters?limit=500`;
   const characterRaw = await fetchWithCache(url);
   const characters = characterRaw.docs;

   url = `https://${settings.siteId}-db.${settings.domain}/api/lightCones?limit=500`;
   const lightConeRaw = await fetchWithCache(url);
   const lightCones = lightConeRaw.docs;

   // Get the image URL reference for the Stellar Jade icon lol.
   url = `https://${settings.siteId}-db.${settings.domain}/api/images/ItemIcon_900001`;
   const sjRaw = await fetchWithCache(url);
   const stellarJadeURL = sjRaw?.url;

   return json({ banners, characters, lightCones, stellarJadeURL });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Warp Simulator - Honkai: Star Rail",
      },
      {
         name: "description",
         content: "A new kind of wiki",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const SummonSimulator = (data: any) => {
   //need banners, weapons, characters
   const { banners, characters, lightCones, stellarJadeURL } =
      useLoaderData<typeof loader>();

   // Resort banner by ID numeric
   banners.sort((a: any, b: any) =>
      parseInt(a.banner_id) > parseInt(b.banner_id)
         ? 1
         : parseInt(b.banner_id) > parseInt(a.banner_id)
         ? -1
         : 0,
   );
   /*
      ========================================================================
      STATE VARIABLES
      ========================================================================
    */
   // TODO maybe use useReducer?
   const [beginnerPulls, setBeginnerPulls] = useState(0); //only 5 pulls allowed on beginner pull
   const [isBeginner, setIsBeginner] = useState(false); //only 5 pulls allowed on beginner pull
   const [currentBanner, setCurrentBanner] = useState(banners?.slice(-2)?.[0]); // take the latest banner
   useEffect(() => {
      buildRatesDict(currentBanner);
   }, []);
   const [pulls, setPulls]: any = useState([]); //the latest 10 pulls
   const [goodPulls, setGoodPulls]: any = useState({
      SSR: { characters: {}, weapons: {} },
      SR: { characters: {}, weapons: {} },
   }); //the SSR characters and weapons they've pulled since last reset
   //pity counters for the different banner types
   const [pityCounters, setPityCounters] = useState({
      SSR: {
         characters: 0,
         weapons: 0,
         standard: 0,
         beginner: 0,
      },
      SR: {
         characters: 0,
         weapons: 0,
         standard: 0,
         beginner: 0,
      },
   });

   //weapon banner-specific
   const [targetWeaponId, setTargetWeaponId] = useState(null); //for weapon banners, they select a target weapon
   const [nonTargetWeaponPulled, setNonTargetWeaponPulled] = useState(0); //if they pull 2 non-target weapons, the 3rd is guaranteed to be the target weapon
   const [targetWeaponPulled, setTargetWeaponPulled] = useState(false);

   const [guaranteedRateup, setGuaranteedRateup] = useState({
      SSR: false,
      SR: false,
   });
   const [receivedGuaranteedRateup, setReceivedGuaranteedRateup] = useState({
      SSR: false,
      SR: false,
   });
   const [moneySpent, setMoneySpent] = useState(0);
   const [acquaintFateSpent, setAcquaintFateSpent] = useState(0);
   const [currencySpent, setCurrencySpent] = useState(0);

   /*
      ========================================================================
      INSTANCE VARIABLES
      ========================================================================
    */
   // TODO some states could possibly be turned into instance variables
   // if we don't care to show certain mechanics (pity counter, whether they're guaranteed a rateup, etc.)
   let currRatesDict: any = useRef({
      SSR: {
         featured: {
            weapons: [],
            characters: [],
         },
         nonfeatured: {
            weapons: [],
            characters: [],
         },
      },
      SR: {
         featured: {
            weapons: [],
            characters: [],
         },
         nonfeatured: {
            weapons: [],
            characters: [],
         },
      },
      R: {
         featured: {
            weapons: [],
            characters: [],
         },
         nonfeatured: {
            weapons: [],
            characters: [],
         },
      },
   });
   //re-declaring certain state variables as instance variables to prevent issues with delayed state changes
   // TODO if a state-change change gets pushed mid-roll, this might cause bugs, may need to switch to useRef
   let currGuaranteedRateup: any = guaranteedRateup;
   let currReceivedGuaranteedRateup: any = receivedGuaranteedRateup;
   let currTargetWeaponPulled: any = targetWeaponPulled;
   let currGoodPulls: any = goodPulls;

   /*
      ========================================================================
      CONSTANTS
      ========================================================================
    */
   const rarityMap = {
      QUALITY_PURPLE: 4,
   };
   const costPerPullCurrency = 160; //Oneiric Shards (genesis crystals?) per roll
   const costPerPullMoney = 1.98; //usd per roll based on most efficient, permanent package, no first-time bonus
   const selectedBG =
      "bg-blue-800 dark:bg-blue-200 text-blue-200 dark:text-blue-800 font-bold"; //placeholder styling, just to let them know which weapon is selected
   const unselectedBG = "bg-gray-100 dark:bg-gray-800";
   const rates = {
      //base rates
      characters: {
         SSR: 0.6,
         SR: 5.1,
         R: 94.3,
      },
      weapons: {
         SSR: 0.7,
         SR: 6,
         R: 93.3,
      },
      standard: {
         SSR: 0.6,
         SR: 5.1,
         R: 94.3,
      },
      beginner: {
         SSR: 0.6,
         SR: 5.1,
         R: 94.3,
      },
   };
   const rollOrder = ["SSR", "SR", "R"]; //roll priority
   const simulate = (numPerPull: any) => {
      let currRates: any = null;
      let pityFunctionSSR = null,
         pityFunctionSR = null;
      let rateupChance = 50;
      let bannerType = "";
      let pulls = [];

      //local variables for this set of pulls
      const currPityCounters: any = pityCounters;
      let currNonTargetWeaponPulled: any = nonTargetWeaponPulled;
      let currCurrencySpent: number = currencySpent;
      let currMoneySpent: number = moneySpent;
      currGuaranteedRateup = guaranteedRateup;
      //decide what banner type it is (weapon, character, standard, beginner) based on if there's featured stuff
      if (isBeginner) {
         currRates = Object.assign({}, rates.beginner);
         pityFunctionSSR = calculateSSRRateCharacter;
         pityFunctionSR = calculateSRRateCharacter;
         bannerType = "beginner";
      } else if (currRatesDict.current.SSR.featured.weapons.length > 0) {
         currRates = Object.assign({}, rates.weapons);
         pityFunctionSSR = calculateSSRRateWeapon;
         pityFunctionSR = calculateSRRateWeapon;
         rateupChance = 75;
         bannerType = "weapons";
      } else if (currRatesDict.current.SSR.featured.characters.length > 0) {
         currRates = Object.assign({}, rates.characters);
         pityFunctionSSR = calculateSSRRateCharacter;
         pityFunctionSR = calculateSRRateCharacter;
         bannerType = "characters";
      } else {
         currRates = Object.assign({}, rates.standard);
         pityFunctionSSR = calculateSSRRateCharacter;
         pityFunctionSR = calculateSRRateCharacter;
         bannerType = "standard";
         //use standard banner variables and rates
      }
      for (let pullIdx = 0; pullIdx < numPerPull; pullIdx++) {
         currPityCounters.SSR[bannerType]++;
         currPityCounters.SR[bannerType]++;
         currCurrencySpent += costPerPullCurrency;
         currMoneySpent += costPerPullMoney;
         const pullChance = Math.random() * 100;

         currRates.SSR = pityFunctionSSR(currPityCounters.SSR[bannerType]);
         currRates.SR = pityFunctionSR(currPityCounters.SR[bannerType]);

         let currChance = 0;
         for (
            let priorityIdx = 0;
            priorityIdx < rollOrder.length;
            priorityIdx++
         ) {
            const currPriority = rollOrder[priorityIdx];
            currChance += currRates[currPriority];
            if (pullChance < currChance) {
               //currPriority = the rarity of the character they just pulled
               const pool = currRatesDict.current[currPriority];
               //each banner type is handled differently enough that we may as well just make 3 separate cases here

               switch (bannerType) {
                  case "weapons":
                     {
                        let featuredKey = rollForRateup(
                           pool,
                           currPriority,
                           bannerType,
                           rateupChance,
                        );
                        let finalPool = pool[featuredKey].weapons;
                        let poolIdx = Math.floor(
                           Math.random() * finalPool.length,
                        );
                        let currPull = finalPool[poolIdx];
                        if (
                           featuredKey === "featured" &&
                           currPriority === "SSR" &&
                           targetWeaponId &&
                           currPull.lightcone_id !== targetWeaponId &&
                           !currTargetWeaponPulled
                        ) {
                           if (currNonTargetWeaponPulled === 2) {
                              //give them their target weapon if they pulled two non-target featured weapons
                              //and only do so once
                              console.log(
                                 "you pulled two non-target featured weapons. here's your target weapon.",
                              );
                              const targetWeapon =
                                 getWeaponById(targetWeaponId);
                              currPull = targetWeapon;
                           } else if (currNonTargetWeaponPulled < 3) {
                              currNonTargetWeaponPulled++;
                           }
                        }
                        if (currPull.lightcone_id === targetWeaponId) {
                           currTargetWeaponPulled = true;
                        }
                        if (currPriority === "SSR" || currPriority === "SR") {
                           addOrIncrementPulls(
                              currGoodPulls[currPriority].weapons,
                              currPull,
                           );
                        }
                        pulls.push(currPull);
                     }
                     break;
                  case "characters":
                     {
                        //now need to decide whether it was a character or a weapon
                        let pullType = "weapons"; //3* only has weapons
                        switch (currPriority) {
                           case "SSR":
                              pullType = "characters";
                              break;
                           case "SR":
                              //50/50 chance
                              const pullTypeRoll = Math.floor(
                                 Math.random() * 2,
                              );
                              pullType = pullTypeRoll
                                 ? "weapons"
                                 : "characters";
                              break;
                        }
                        let featuredKey = rollForRateup(
                           pool,
                           currPriority,
                           pullType,
                           rateupChance,
                        );
                        let finalPool = pool[featuredKey][pullType];
                        let poolIdx = Math.floor(
                           Math.random() * finalPool.length,
                        );
                        if (currPriority === "SSR" || currPriority === "SR") {
                           addOrIncrementPulls(
                              currGoodPulls[currPriority][pullType],
                              finalPool[poolIdx],
                           );
                        }
                        pulls.push(finalPool[poolIdx]);
                     }
                     break;

                  case "standard":
                     {
                        let pullType = "weapons";
                        if (currPriority !== "R") {
                           const pullTypeRoll = Math.floor(Math.random() * 2);
                           pullType = pullTypeRoll ? "weapons" : "characters";
                        }
                        let finalPool = pool.nonfeatured[pullType];
                        let poolIdx = Math.floor(
                           Math.random() * finalPool.length,
                        );
                        if (currPriority === "SSR" || currPriority === "SR") {
                           addOrIncrementPulls(
                              currGoodPulls[currPriority][pullType],
                              finalPool[poolIdx],
                           );
                        }
                        pulls.push(finalPool[poolIdx]);
                     }
                     break;

                  case "beginner":
                     if (pullIdx === 9 && beginnerPulls === 4) {
                        //guaranteed SSR
                        let pullType = "characters";
                        let finalPool =
                           currRatesDict.current["SSR"].nonfeatured[pullType];
                        let poolIdx = Math.floor(
                           Math.random() * finalPool.length,
                        );
                        addOrIncrementPulls(
                           currGoodPulls["SSR"][pullType],
                           finalPool[poolIdx],
                        );
                        pulls.push(finalPool[poolIdx]);
                     } else {
                        let pullType = "characters";
                        if (currPriority === "R") {
                           pullType = "weapons";
                        }
                        let finalPool = pool.nonfeatured[pullType];
                        let poolIdx = Math.floor(
                           Math.random() * finalPool.length,
                        );
                        if (currPriority === "SSR" || currPriority === "SR") {
                           addOrIncrementPulls(
                              currGoodPulls[currPriority][pullType],
                              finalPool[poolIdx],
                           );
                        }
                        pulls.push(finalPool[poolIdx]);
                     }
                     break;
               }
               //reset pity counter for this rarity and banner type, if applicable
               if (currPityCounters[currPriority]) {
                  currPityCounters[currPriority][bannerType] = 0;
               }
               break;
            }
         }
      }
      //updating state and display
      if (bannerType == "beginner") {
         setAcquaintFateSpent(acquaintFateSpent + 8);
         setBeginnerPulls(beginnerPulls + 1);
      } else {
         setCurrencySpent(currCurrencySpent);
         setMoneySpent(currMoneySpent);
      }
      setPityCounters(currPityCounters);
      setPulls(pulls);
      setNonTargetWeaponPulled(currNonTargetWeaponPulled);
      setGuaranteedRateup(currGuaranteedRateup);
      setReceivedGuaranteedRateup(currReceivedGuaranteedRateup);
      setTargetWeaponPulled(currTargetWeaponPulled);
   };

   /**
      @function reset
      @description completely resets the simulator state
    */
   const reset = () => {
      setPityCounters({
         SSR: {
            characters: 0,
            weapons: 0,
            standard: 0,
            beginner: 0,
         },
         SR: {
            characters: 0,
            weapons: 0,
            standard: 0,
            beginner: 0,
         },
      });
      setGuaranteedRateup({ SSR: false, SR: false });
      setReceivedGuaranteedRateup({ SSR: false, SR: false });
      setGoodPulls({
         SSR: { characters: {}, weapons: {} },
         SR: { characters: {}, weapons: {} },
      });
      setPulls([]);
      setMoneySpent(0);
      setCurrencySpent(0);

      //for weapon banners
      setNonTargetWeaponPulled(0);
      setTargetWeaponPulled(false);

      //for beginner banner
      setBeginnerPulls(0);
      setAcquaintFateSpent(0);
   };

   const simChanged = (banner: any) => {
      buildRatesDict(banner);
      setCurrentBanner(banner);
      setPulls([]);
   };

   /*
      ==================================================================================
      COMPONENTS
      ==================================================================================
    */
   const BannerCombobox = () => {
      const [bannerQuery, setBannerQuery] = useState("");
      const filteredBanners =
         bannerQuery === ""
            ? banners
            : banners.filter((banner: any) => {
                 return banner.name
                    .toLowerCase()
                    .includes(bannerQuery.toLowerCase());
              });
      return (
         <Combobox value={currentBanner} onChange={simChanged}>
            <div className="relative mt-1">
               <div className="sm:text-sm relative w-full cursor-default overflow-hidden rounded-lg border border-gray-200 bg-white text-left dark:border-gray-700 dark:bg-neutral-800">
                  <Combobox.Input
                     className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 dark:bg-neutral-800"
                     onChange={(event) => setBannerQuery(event.target.value)}
                     displayValue={(banner: any) => banner.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                     <CaretDownIcon class="h-3 w-3" />
                  </Combobox.Button>
               </div>
               <Combobox.Options className="sm:text-sm absolute z-20 max-h-60 w-full list-none overflow-auto rounded-md bg-white text-base shadow-lg focus:outline-none dark:bg-neutral-700">
                  {filteredBanners.map((banner: any) => (
                     <Combobox.Option
                        key={banner.id}
                        value={banner}
                        className={({ active }) =>
                           `relative m-0 cursor-default select-none px-3 py-1 ${
                              active ? "bg-gray-300 dark:bg-gray-700" : ""
                           }`
                        }
                     >
                        {({ selected, active }) => (
                           <>
                              <span
                                 className={`block truncate ${
                                    selected ? "font-bold" : "font-normal"
                                 }`}
                              >
                                 {banner.name}
                              </span>
                              {selected ? (
                                 <span
                                    className={`absolute inset-y-0 left-0 -ml-5 flex -rotate-90 transform items-center ${
                                       active ? "text-white" : "text-teal-600"
                                    }`}
                                 >
                                    {/* <BsFillCaretDownFill className="h-2.5 w-2.5" /> */}
                                 </span>
                              ) : null}
                           </>
                        )}
                     </Combobox.Option>
                  ))}
               </Combobox.Options>
            </div>
         </Combobox>
      );
   };
   const PullsTable = ({ pullsArray, header }: any) => {
      return (
         <>
            <h3>{header}</h3>
            <table className="w-full">
               <thead>
                  <tr>
                     <th className="w-1/2">Character</th>
                     <th className="w-1/2">Weapon</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        {Object.entries(pullsArray.characters).map(
                           (character) => {
                              const charObj = getCharacterById(character[0]);
                              return (
                                 <GoodPull
                                    pull={charObj}
                                    number={character[1]}
                                 />
                              );
                           },
                        )}
                     </td>
                     <td>
                        {Object.entries(pullsArray.weapons).map((weapon) => {
                           const weaponObj = getWeaponById(weapon[0]);
                           return (
                              <GoodPull pull={weaponObj} number={weapon[1]} />
                           );
                        })}
                     </td>
                  </tr>
               </tbody>
            </table>
         </>
      );
   };
   // Displayed Pull Result Items

   function Pull({ pull, index }: any) {
      const resulttype = pull.character_id ? "characters" : "lightCones";
      var customcolor = "";
      switch (pull?.rarity?.name) {
         case "5":
            customcolor = "bg-orange-500 bg-opacity-5 font-bold";
            break;
         case "4":
            customcolor = "bg-purple-500 bg-opacity-5 font-bold";
            break;
         default:
      }

      return (
         <a href={`/collections/${resulttype}/${pull.id}`}>
            <div
               className={`border-color m-0.5 inline-block w-full rounded-md border text-left laptop:w-5/12 ${customcolor}`}
               key={pull.id + "-" + index}
            >
               <div
                  className={`color-rarity-${
                     pull.rarity ? pull.rarity.name : "1"
                  } inline-block h-12 w-12 rounded-md align-middle`}
               >
                  <Image
                     alt="Icon"
                     url={pull.icon ? pull.icon.url : "no_image_42df124128"}
                     className="h-12 w-12 object-contain"
                  />
               </div>
               <div className="ml-2 inline-block align-middle">{pull.name}</div>
            </div>
         </a>
      );
   }

   function GoodPull({ pull, number }: any) {
      const resulttype = pull.character_id ? "characters" : "lightCones";
      var customcolor = "";
      switch (pull?.rarity?.name) {
         case "5":
            customcolor = "bg-orange-500 bg-opacity-5 font-bold";
            break;
         case "4":
            customcolor = "bg-purple-500 bg-opacity-5 font-bold";
            break;
         default:
      }
      return (
         <a href={`/collections/${resulttype}/${pull.id}`}>
            <div
               className={`border-color m-0.5 rounded-md border text-left ${customcolor}`}
               key={pull.id + "-" + number}
            >
               <div
                  className={`color-rarity-${
                     pull.rarity ? pull.rarity.name : "1"
                  } inline-block h-12 w-12 rounded-md align-middle`}
               >
                  <Image
                     alt="Icon"
                     url={pull.icon.url}
                     className="h-12 w-12 object-contain"
                  />
               </div>
               <div className="ml-2 inline-block align-middle">
                  {pull.name} x {number}
               </div>
            </div>
         </a>
      );
   }

   // Epitomized Path Weapon Selection

   function TargetWeaponButton({ weapon }: any) {
      return (
         <div
            className={`${
               targetWeaponId === weapon.lightcone_id
                  ? "bg-yellow-900  text-gray-100 dark:bg-blue-700"
                  : "bg-yellow-50 dark:bg-gray-800"
            } m-0.5 mx-2 rounded-md border py-1 text-center`}
            onClick={() => {
               setTargetWeaponId(weapon.lightcone_id);
            }}
         >
            <div className="inline-block h-12 w-12 align-middle">
               <Image alt="Icon" url={weapon.icon.url} width={50} height={50} />
            </div>
            <div className="inline-block align-middle">{weapon.name}</div>
         </div>
      );
   }

   function BannerRateDetailDropDown() {
      return (
         <>
            <Disclosure>
               {({ open }) => {
                  return (
                     <>
                        <Disclosure.Button
                           className="border-color mb-1 mt-2 flex
               w-full items-center rounded-md border bg-gray-50 px-3 py-2 font-bold shadow-sm dark:bg-neutral-800"
                        >
                           Banner Rate Details
                           <div
                              className={`${
                                 open
                                    ? "rotate-180 transform font-bold text-gray-600 "
                                    : "text-gray-400"
                              } ml-auto inline-block `}
                           >
                              <CaretDownIcon class="h-2.5 w-2.5" />
                           </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-5">
                           <div className="border-color rounded-md border bg-gray-50 px-4 py-3 text-center text-sm dark:bg-neutral-900">
                              <div
                                 className="break-words px-2"
                                 dangerouslySetInnerHTML={{
                                    __html: `Banner Rate Details:
<br> * Note: The simulator currently assumes the pity works similarly to Genshin impact
<br>---------------------------------------------
<br>For LIMITED Banners with a Rate-Up Character:
<br>---------------------------------------------
<br>
<br>BASE RATES:
<br>5* Character Rate: 0.6% (Pulls 1~73, inclusive)
<br>4* Item Rate: 5.1% (Pulls 1~8, inclusive)
<br>3* Light Cone Rate: 94.3% (Remaining chance after subtracting 4 and 5* rates)
<br>
<br>5* Pulls:
<br>- 100% chance of obtaining a character (no 5* light cones on limited character banners)
<br>- 50% Chance of Rate-Up character, 50% Chance of character in Standard Pool.
<br>- IF previous 5* character rolled was not the Rate-up, the next 5* is 100% guaranteed to be the Rate-up character.
<br>- Hard pity at 90 Pulls (Guaranteed 5*).
<br>
<br>4* Pulls:
<br>- 50% chance of Character
<br>- 50% chance of Light Cone
<br>- Within Character or Light Cone, 50% Chance of Rate-Up Item (evenly distributed among all rate-ups), 50% Chance of Item in Standard Pool
<br>- IF previous 4* Item rolled was not the Rate-up, the next 4* is guaranted to be one of the Rate-up Items.
<br>- Hard pity at 10 Pulls (Guaranteed 4*).
<br>
<br>3* Pulls:
<br>- Always will be a 3* Light Cone.
<br>
<br>[Soft Pity Rates:]
<br>------------------
<br>
<br>5* Soft Pity (effective when at pulls 74 ~ 90, inclusive):
<br>Rate = 0.6% + ((99.4% / 17)*(PULL# - 73))
<br>- Explanation: The rate of a 5* will increase linearly starting from 0.6% at pull 74 up to 100% at pull 90.
<br>
<br>4* Soft Pity (effective when at pulls 9 ~ 10, inclusive):
<br>Rate = 5.1% + ((94.9% / 2)*(PULL# - 8))
<br>- Explanation: The rate of a 4* will increase linearly starting from 5.1% at pull 8 up to 100% at pull 10. (Aka chance of a 4* at pull 9 is 52.55%, at pull 10 is 100%).
<br>
<br>[Special Rules:]
<br>----------------
<br>- 5* items are rolled FIRST, then 4* items, then 3* items.
<br>- This means if a 5 star roll is successful (such as during Soft Pity), then even if 4* Pity was at 100% it will be DELAYED until the next roll.
<br>
<br>================
<br>
<br>---------------------------------------------
<br>For Light Cone Banners:
<br>---------------------------------------------
<br>
<br>BASE RATES:
<br>5* Light Cone Rate: 0.7% (Pulls 1~62, inclusive)
<br>4* Light Cone Rate: 6.0% (Pulls 1~7, inclusive)
<br>3* Light Cone Rate: 93.3% (Remaining chance after subtracting 4 and 5* rates)
<br>
<br>5* Pulls:
<br>- 100% chance of obtaining a Light Cone (no 5* characters on Light Cone banners)
<br>- 75% Chance of Rate-Up Light Cone (evenly distributed among all rate-ups), 25% Chance of Light Cone in Standard Pool
<br>- IF previous 5* rolled was not Rate-Up, the next 5* is guaranteed to be one of the Rate-up Light Cones.
<br>- Epitomized Path: If the non-selected 5* Light Cone was rolled twice, the next 5* Light Cone is guaranteed to be the selected Light Cone.
<br>- Hard pity at 77 Pulls (Guaranteed 5*).
<br>
<br>4* Pulls:
<br>- 100% chance of Light Cone
<br>- 75% chance of rate-up Light Cone, 25% chance of standard pool Light Cone.
<br>- IF previous 4* rolled was not Rate-Up, the next 4* is guaranteed to be one of the Rate-up Light Cones.
<br>- Hard pity at 9 Pulls (Guaranteed 4*).
<br>
<br>3* Pulls:
<br>- Always will be a 3* Light Cone.
<br>
<br>[Soft Pity Rates:]
<br>------------------
<br>
<br>5* Soft Pity (effective when at pulls 63 ~ 77, inclusive):
<br>Rate = 0.7% + ((99.3% / 15)*(PULL# - 62))
<br>- Explanation: The rate of a 5* will increase linearly starting from 0.7% at pull 62 up to 100% at pull 77.
<br>
<br>4* Soft Pity (effective when at pulls 8 ~ 9, inclusive):
<br>Rate = 6.0% + ((94% / 2)*(PULL# - 7))
<br>- Explanation: The rate of a 4* will increase linearly starting from 6.0% at pull 7 up to 100% at pull 9. (Aka chance of a 4* at pull 8 is 53%, at pull 9 is 100%).
<br>
<br>[Special Rules:]
<br>----------------
<br>- 5* items are rolled FIRST, then 4* items, then 3* items.
<br>- This means if a 5 star roll is successful (such as during Soft Pity), then even if 4* Pity was at 100% it will be DELAYED until the next roll.
<br>EPITOMIZED PATH
<br>* Generally, Light Cone banners has one Light Cone featured.
<br>
<br>================
<br>
<br>---------------------------------------------
<br>For Standard Banner:
<br>* NOTE: The Standard banner, rate-wise, is very similar to the LIMITED banner, although 5*s come only from the Standard Pool.
<br>---------------------------------------------
<br>
<br>BASE RATES:
<br>5* Character Rate: 0.6% (Pulls 1~73, inclusive)
<br>4* Item Rate: 5.1% (Pulls 1~8, inclusive)
<br>3* Light Cone Rate: 94.3% (Remaining chance after subtracting 4 and 5* rates)
<br>
<br>5* Pulls:
<br>- Hard pity at 90 Pulls (Guaranteed 5*).
<br>- Character of Choice at 300 Pulls.
<br>
<br>4* Pulls:
<br>- 50% chance of Character
<br>- 50% chance of Light Cone
<br>- Hard pity at 10 Pulls (Guaranteed 4*).
<br>
<br>3* Pulls:
<br>- Always will be a 3* Light Cone.
<br>
<br>[Soft Pity Rates:]
<br>------------------
<br>
<br>5* Soft Pity (effective when at pulls 74 ~ 90, inclusive):
<br>Rate = 0.6% + ((99.4% / 17)*(PULL# - 73))
<br>- Explanation: The rate of a 5* will increase linearly starting from 0.6% at pull 74 up to 100% at pull 90.
<br>
<br>4* Soft Pity (effective when at pulls 9 ~ 10, inclusive):
<br>Rate = 5.1% + ((94.9% / 2)*(PULL# - 8))
<br>- Explanation: The rate of a 4* will increase linearly starting from 5.1% at pull 8 up to 100% at pull 10. (Aka chance of a 4* at pull 9 is 52.55%, at pull 10 is 100%).
<br>
<br>[Special Rules:]
<br>----------------
<br>- 5* items are rolled FIRST, then 4* items, then 3* items.
<br>- This means if a 5 star roll is successful (such as during Soft Pity), then even if 4* Pity was at 100% it will be DELAYED until the next roll.
<br>
<br>================
<br>
<br>Source of wish pity mechanic details:
<br>https://www.reddit.com/r/Genshin_Impact/comments/o9v0c0/soft_and_hard_pity_explained_based_on_24m_wishes/`,
                                 }}
                              ></div>
                           </div>
                        </Disclosure.Panel>
                     </>
                  );
               }}
            </Disclosure>
         </>
      );
   }

   /*
      ==================================================================================
      DEFAULT RENDER
      ==================================================================================
    */
   const tableStyle = "p-1";
   return (
      <>
         <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
            <h2>Select Banner</h2>
            <BannerCombobox />

            <H2 text="Banner Info" />
            <h3 className="text-center">{currentBanner.name}</h3>
            <div className="display-contents relative inline-block h-32 w-full px-2 text-center laptop:h-40 ">
               {currentBanner.icon?.url && (
                  <Image
                     alt={currentBanner?.name}
                     className="inline-block h-32 object-contain laptop:h-40"
                     url={currentBanner.icon?.url}
                  />
               )}
            </div>
            <div
               className="my-1 h-min w-full rounded-md p-1 px-2 text-center"
               dangerouslySetInnerHTML={{ __html: currentBanner.description }}
            ></div>

            <div>
               {/* <h3>Guaranteed Rateup</h3>
          <table>
            <tr>
              <th>SSR</th>
              <td>{guaranteedRateup.SSR ? "Yes" : "No"}</td>
              <th>SR</th>
              <td>{guaranteedRateup.SR ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th>SSR Received</th>
              <td>{receivedGuaranteedRateup.SSR ? "Yes" : "No"}</td>
              <th>SR Received</th>
              <td>{receivedGuaranteedRateup.SR ? "Yes" : "No"}</td>
            </tr>
          </table> */}

               <div className="grid laptop:grid-cols-2">
                  <div className="text-center">
                     <h3>Money Spent</h3>
                     <table className="inline-block">
                        <thead></thead>
                        <tbody>
                           <tr>
                              <th className={tableStyle}>
                                 <div>
                                    <div className="relative inline-block h-6 w-6 align-middle">
                                       <Image alt="Icon" url={stellarJadeURL} />
                                    </div>
                                    <div className="inline-block align-middle">
                                       Stellar Jade
                                    </div>
                                 </div>
                              </th>
                              <td className={tableStyle}>{currencySpent}</td>
                           </tr>
                           <tr>
                              <th className={tableStyle}>USD</th>
                              <td className={tableStyle}>
                                 ${moneySpent.toFixed(2)}
                              </td>
                           </tr>
                           <tr>
                              <th className={tableStyle}>Tickets</th>
                              <td className={tableStyle}>
                                 {acquaintFateSpent}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <div className="text-center">
                     <h3>Pity Counters</h3>
                     <table className="inline-block">
                        <thead>
                           <tr>
                              <th className={tableStyle}>Rarity</th>
                              <th className={tableStyle}>Character</th>
                              <th className={tableStyle}>Weapon</th>
                              <th className={tableStyle}>Standard</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <th className={tableStyle}>SSR</th>
                              <td className={tableStyle}>
                                 {pityCounters.SSR.characters}
                              </td>
                              <td className={tableStyle}>
                                 {pityCounters.SSR.weapons}
                              </td>
                              <td className={tableStyle}>
                                 {pityCounters.SSR.standard}
                              </td>
                           </tr>
                           <tr>
                              <th className={tableStyle}>SR</th>
                              <td className={tableStyle}>
                                 {pityCounters.SR.characters}
                              </td>
                              <td className={tableStyle}>
                                 {pityCounters.SR.weapons}
                              </td>
                              <td className={tableStyle}>
                                 {pityCounters.SR.standard}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            <div>
               <div className="flex justify-between">
                  <button
                     className={`m-1 w-full rounded-full
                         border border-gray-400 px-2 py-1 dark:border-gray-600 ${
                            isBeginner
                               ? "opacity-50"
                               : "hover:bg-blue-700 hover:bg-opacity-10"
                         }`}
                     onClick={() => {
                        simulate(1);
                     }}
                     disabled={isBeginner}
                  >
                     Warp x1
                  </button>
                  <button
                     className={`m-1 w-full rounded-full
                     border border-gray-400 px-2 py-1 dark:border-gray-600 ${
                        isBeginner && beginnerPulls >= 5
                           ? "opacity-50"
                           : "hover:bg-blue-700 hover:bg-opacity-10"
                     }`}
                     onClick={() => {
                        simulate(10);
                     }}
                  >
                     Warp x10
                  </button>
               </div>
            </div>
            <button
               className="my-2 w-full rounded-full border border-gray-400 bg-gray-200 px-2 py-1 hover:bg-red-900 hover:bg-opacity-10 dark:border-gray-600 dark:bg-gray-800"
               onClick={() => {
                  reset();
               }}
            >
               Reset
            </button>

            <div>
               {/* <H2 text="Results" /> */}
               <div className="text-center">
                  {pulls.map((pull: any, index: any) => (
                     <Pull pull={pull} index={index} />
                  ))}
               </div>
            </div>
            <div>
               <PullsTable header="SSR" pullsArray={goodPulls.SSR} />
               <PullsTable header="SR" pullsArray={goodPulls.SR} />
            </div>

            {/* Description Drop Down Accordion for how Rates work */}
            <BannerRateDetailDropDown />
         </div>
      </>
   );

   /*
      COMPONENTS
    */

   /*
      ===========================================================================
      HELPER FUNCTIONS
      ===========================================================================
    */
   function getCharacterById(id: string) {
      return characters.find((character: any) => character.character_id == id);
   }

   function getWeaponById(id: string) {
      return lightCones.find((weapon: any) => weapon.lightcone_id == id);
   }

   // For Epitomized Path, only 5 star weapons can be selected
   // Returns true if 5 star
   function is5StarWeapon(id: string) {
      return (
         lightCones.find((weapon: any) => weapon.lightcone_id == id).rarity
            .display_name == "5"
      );
   }

   function setTargetWeapon(id: any) {
      setTargetWeaponId(id);
      setNonTargetWeaponPulled(0);
   }

   /**
      @function addOrIncrementPulls
      @description updates the good pulls array with a new pull (set to 1 if it's not in, increment by one if it is in)
      @param pullsArray - the local (not state) good pulls array to modify
      @param pullItem - the item to add
    */
   function addOrIncrementPulls(pullsArray: any, pullItem: any) {
      const idKey = pullItem?.lightcone_id ? "lightcone_id" : "character_id";
      if (pullsArray[pullItem[idKey]]) {
         pullsArray[pullItem[idKey]] = pullsArray[pullItem[idKey]] + 1;
      } else {
         pullsArray[pullItem[idKey]] = 1;
      }
   }

   /**
      @function buildRatesDict
      @description (re)builds the current rates dictionary for the simulator to base its pulls off of
      @param banner - the banner object from the graphql query results array
    */
   function buildRatesDict(banner: any) {
      const toReturn = {};
      const characterIds = banner.banner_characters
            ? banner.banner_characters.map((a) => a.character_id)
            : [],
         weaponIds = banner.banner_light_cones
            ? banner.banner_light_cones.map((a) => a.lightcone_id)
            : [],
         featuredCharacterIds = banner.featured_characters
            ? banner.featured_characters.map((a) => a.character_id)
            : [],
         featuredWeaponIds = banner.featured_light_cones
            ? banner.featured_light_cones.map((a) => a.lightcone_id)
            : [];
      const characters = characterIds.map((characterId) =>
            getCharacterById(characterId),
         ),
         weapons = weaponIds.map((weaponId) => getWeaponById(weaponId)),
         featuredCharacters = featuredCharacterIds.map((characterId) =>
            getCharacterById(characterId),
         ),
         featuredWeapons = featuredWeaponIds.map((weaponId) =>
            getWeaponById(weaponId),
         );
      currRatesDict.current = {
         SSR: {
            featured: {
               weapons: extractRarity(featuredWeapons, "5"),
               characters: Array.prototype.concat(
                  extractRarity(featuredCharacters, "5"),
               ),
            },
            nonfeatured: {
               weapons: extractRarity(weapons, "5"),
               characters: Array.prototype.concat(
                  extractRarity(characters, "5"),
               ),
            },
         },
         SR: {
            featured: {
               weapons: extractRarity(featuredWeapons, "4"),
               characters: extractRarity(featuredCharacters, "4"),
            },
            nonfeatured: {
               weapons: extractRarity(weapons, "4"),
               characters: extractRarity(characters, "4"),
            },
         },
         R: {
            featured: {
               weapons: extractRarity(featuredWeapons, "3"),
               characters: extractRarity(featuredCharacters, "3"),
            },
            nonfeatured: {
               weapons: extractRarity(weapons, "3"),
               characters: extractRarity(characters, "3"),
            },
         },
      };
      if (banner.id == 1) {
         setIsBeginner(true);
      } else if (isBeginner) {
         setIsBeginner(false);
      }
   }

   /**
      @function extractRarity
      @description given an array and a rarity, extracts all items that have that rarity
      @param array - the array to search
      @param rarity - the rarity to search the array for
      @return - the array of items from the array that match the rarity
    */
   function extractRarity(array: any, rarity: string) {
      return array.filter((item: any) => {
         if (!item.rarity.display_number) {
            return false;
         }
         return item.rarity.display_number == rarity;
      });
   }

   /**
      @function rollForRateup
      @description determines whether they roll a rateup or nonrateup character. also handles the guaranteed rateup feature.
      @param pool - the pool of characters being rolled for, mainly to check if there's even any featured characters of that rarity
      @param rarity - what rarity to check for featured characters
      @param key - whether it's a weapon or character
      @param chance - the rateup chance (50 for characters, 75 for weapons currently)
    */
   function rollForRateup(pool, rarity, key, chance) {
      if (pool.featured[key].length > 0) {
         const featuredRoll = Math.random() * 100;
         if (featuredRoll < chance) {
            //they rolled a featured item
            currGuaranteedRateup[rarity] = false;
            currReceivedGuaranteedRateup[rarity] = true;
            console.log("naturally rolled the rate-up");
            return "featured";
         } else {
            if (
               currGuaranteedRateup[rarity] &&
               !currReceivedGuaranteedRateup[rarity]
            ) {
               //roll failed but they were guaranteed one already, so give it to them
               currReceivedGuaranteedRateup[rarity] = true;
               console.log(
                  "failed rate-up roll, but you were guaranteed one so here you go",
               );
               return "featured";
            } else if (!currReceivedGuaranteedRateup[rarity]) {
               //roll failed, so guarantee the next one is a rateup
               currGuaranteedRateup[rarity] = true;
               console.log(
                  "failed rate-up roll for the first time, next one is guaranteed rate-up",
               );
            }
         }
      }
      return "nonfeatured";
   }

   function calculateSSRRateCharacter(pulls) {
      //0.6% + ((99.4% / 17)*(PULL# - 73))
      if (pulls < 74) {
         return 0.6;
      }
      return 0.6 + (99.4 / 17) * (pulls - 73);
   }
   function calculateSRRateCharacter(pulls) {
      if (pulls < 8) {
         return 5.1;
      }
      return 5.1 + (94.9 / 2) * (pulls - 8);
   }

   function calculateSSRRateWeapon(pulls) {
      if (pulls < 63) {
         return 0.7;
      }
      return 0.7 + (99.3 / 15) * (pulls - 62);
   }
   function calculateSRRateWeapon(pulls) {
      if (pulls < 8) {
         return 6;
      }
      const rate = 6.0 + (94 / 2) * (pulls - 7);
      return rate;
   }
};

// =====================================
// For rendering Down Icon
// =====================================
export const CaretDownIcon = (props: any) => (
   <svg
      className={props.class}
      width={props.w}
      height={props.h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path fill="currentColor" d="M20 8H4L12 16L20 8Z"></path>
   </svg>
);

export default SummonSimulator;
