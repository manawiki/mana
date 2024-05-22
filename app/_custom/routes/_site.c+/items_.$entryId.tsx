// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { Image } from "~/components/Image";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

// Custom Component Imports
export { entryMeta as meta };

// Custom Site / Collection Config Imports
import type { Item as ItemType } from "~/db/payload-custom-types";
import { Items } from "../../collections/items";

// Custom Component Imports
import { Main } from "~/_custom/components/items/Main";
import { Obtain } from "~/_custom/components/items/Obtain";
import { Cooking } from "~/_custom/components/items/Cooking";
import { Synthesis } from "~/_custom/components/items/Synthesis";
//import { ImageGallery } from "~/_custom/components/materials/ImageGallery";

// Loader definition - loads Entry data!
export async function loader({
  context: { payload, user },
  params,
  request,
}: LoaderFunctionArgs) {
  const fetchItemData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: QUERY,
    },
  });

  const fetchCookingData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: COOKING_QUERY,
    },
  });
  const fetchCookingSpecialData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: COOKING_SPECIAL_QUERY,
    },
  });
  const fetchCookingIngredientData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: COOKING_INGREDIENT_QUERY,
    },
  });

  const fetchSynthesisData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: SYNTHESIS_QUERY,
    },
  });
  const fetchSynthesisIngredientData = fetchEntry({
    payload,
    params,
    request,
    user,
    gql: {
      query: SYNTHESIS_INGREDIENT_QUERY,
    },
  });

  const [
    { entry },
    cook,
    cookspecial,
    cookingredient,
    synthesis,
    synthesisingredient,
  ] = await Promise.all([
    fetchItemData,
    fetchCookingData,
    fetchCookingSpecialData,
    fetchCookingIngredientData,
    fetchSynthesisData,
    fetchSynthesisIngredientData,
  ]);

  return json({
    entry,
    cookData: cook?.entry?.data?.CookingRecipes?.docs,
    cookSpecialtyData: cookspecial?.entry?.data?.CookingRecipes?.docs,
    cookIngredientData: cookingredient?.entry?.data?.CookingRecipes?.docs,
    synthesisData: synthesis?.entry?.data?.SynthesisRecipes?.docs,
    synthesisIngredientData:
      synthesisingredient?.entry?.data?.SynthesisRecipes?.docs,
  });
}

const SECTIONS = {
  main: Main,
  // gallery: ImageGallery,
};

export default function EntryPage() {
  const {
    entry,
    cookData,
    cookSpecialtyData,
    cookIngredientData,
    synthesisData,
    synthesisIngredientData,
  } = useLoaderData<typeof loader>();
  var char = {
    Item: entry.data.Item,
    CookRecipes: [...cookData, ...cookSpecialtyData],
    CookIngredient: cookIngredientData,
    Synthesis: synthesisData,
    SynthesisIngredient: synthesisIngredientData,
  };

  return (
    <>
      {/* <Entry customComponents={SECTIONS} customData={char} /> */}
      <Entry>
        <Main data={char} />
        <Obtain data={char} />
        <Cooking data={char} />
        <Synthesis data={char} />
      </Entry>
    </>
  );
}

const QUERY = gql`
  query Item($entryId: String!) {
    Item(id: $entryId) {
      id
      name
      desc
      slug
      rarity {
        id
        color
      }
      bag_slot {
        name
      }
      category {
        name
      }
      obtain_data {
        desc
      }
      icon {
        url
      }
    }
  }
`;

const COOKING_QUERY = gql`
  query CookingRecipes($entryId: JSON!) {
    CookingRecipes(where: { result_item: { equals: $entryId } }) {
      docs {
        id
        recipe_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        result_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        cooking_items {
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
          cnt
        }
        special_dishes {
          resonator {
            id
            name
            icon {
              url
            }
          }
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
        }
      }
    }
  }
`;
const COOKING_SPECIAL_QUERY = gql`
  query CookingRecipes($entryId: JSON!) {
    CookingRecipes(where: { special_dishes__item: { equals: $entryId } }) {
      docs {
        id
        recipe_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        result_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        cooking_items {
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
          cnt
        }
        special_dishes {
          resonator {
            id
            name
            icon {
              url
            }
          }
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
        }
      }
    }
  }
`;
const COOKING_INGREDIENT_QUERY = gql`
  query CookingRecipes($entryId: JSON!) {
    CookingRecipes(where: { cooking_items__item: { equals: $entryId } }) {
      docs {
        id
        recipe_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        result_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        cooking_items {
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
          cnt
        }
        special_dishes {
          resonator {
            id
            name
            icon {
              url
            }
          }
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
        }
      }
    }
  }
`;

const SYNTHESIS_QUERY = gql`
  query SynthesisRecipes($entryId: JSON!) {
    SynthesisRecipes(where: { result_item: { equals: $entryId } }) {
      docs {
        id
        recipe_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        result_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        synthesis_items {
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
          cnt
        }
      }
    }
  }
`;

const SYNTHESIS_INGREDIENT_QUERY = gql`
  query SynthesisRecipes($entryId: JSON!) {
    SynthesisRecipes(where: { synthesis_items__item: { equals: $entryId } }) {
      docs {
        id
        recipe_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        result_item {
          id
          name
          rarity {
            id
            color
          }
          icon {
            url
          }
        }
        synthesis_items {
          item {
            id
            name
            rarity {
              id
              color
            }
            icon {
              url
            }
          }
          cnt
        }
      }
    }
  }
`;
