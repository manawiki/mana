import urlSlug from "url-slug";

export function manaSlug(value: string) {
   return urlSlug(value, {
      dictionary: {
         "+": "plus",
         "♂": "male",
         "♀": "female",
      },
   });
}
