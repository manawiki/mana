const capitalizeFirstLetter = (string: string): string =>
   string.charAt(0).toUpperCase() + string.slice(1);

//We need to construct the Graphql label the same way payload does from the slug
//Following functions are copied over from payload core
export function toWords(inputString: string, joinWords = false): string {
   const notNullString = inputString || "";
   const trimmedString = notNullString.trim();
   const arrayOfStrings = trimmedString.split(/[\s-]/);
   const splitStringsArray = [] as any;
   arrayOfStrings.forEach((tempString) => {
      if (tempString !== "") {
         const splitWords = tempString.split(/(?=[A-Z])/).join(" ");
         splitStringsArray.push(capitalizeFirstLetter(splitWords));
      }
   });

   return joinWords
      ? splitStringsArray.join("").replace(/\s/gi, "")
      : splitStringsArray.join(" ");
}
