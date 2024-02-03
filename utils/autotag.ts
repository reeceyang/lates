// Categorize food in a tree hierarchy.

const MEATS = {
  chicken: {},
  pork: {},
  bacon: {},
  lamb: {},
  ribs: {},
  beef: {},
  turkey: {},
  steak: {},
  fish: {},
  tilapia: {},
  salmon: {},
  flounder: {},
  shrimp: {},
  squid: {},
};

const VEGAN_PROTEIN = {
  tofu: {},
  bean: {},
  chickpea: {},
  lentil: {},
  seitan: {},
  tempeh: {},
  edamame: {},
};

const PROTEIN = {
  meat: MEATS,
  protein: {},
  egg: {},
  sausage: {},
  meatball: {},
  ...VEGAN_PROTEIN,
};

const DAIRY = {
  milk: {},
  egg: {},
  cheese: {},
  butter: {},
  cream: {},
  yogurt: {},
};

const STARCH = {
  rice: {},
  pasta: {},
  mac: {},
  macaroni: {},
  spaghetti: {},
  gnocchi: {},
  penne: {},
  ziti: {},
  ravioli: {},
  risotto: {},
  couscous: {},
  rotini: {},
  lasagna: {},
  bread: {},
  roll: {},
  potato: {},
  quinoa: {},
  noodle: {},
  ramen: {},
};

const FOOD: Tree = {
  protein: PROTEIN,
  dairy: DAIRY,
  vegan: {},
  starch: STARCH,
};

type Tree = { [key: string]: Tree };

/**
 * A list of tags that should be added for a given string.
 * For example, if `chicken` is in a dish name, the tags `chicken`, `meat`, and `protein` should all be added
 */
const STRING_TO_TAG = (() => {
  /**
   * Nodes of the tree should include themselves and their parents as tags.
   * Traverse the root tree recursively to build the object.
   */
  const getLeavesToParent = (tree: Tree): Record<string, string[]> => {
    let leavesToParent: Record<string, string[]> = {};
    for (const [key, subtree] of Object.entries(tree)) {
      leavesToParent[key] = [key];
      const leaves = getLeavesToParent(subtree);
      for (const [leaf, leafTags] of Object.entries(leaves)) {
        leavesToParent[leaf] = [...leafTags, key];
      }
    }
    return leavesToParent;
  };
  return getLeavesToParent(FOOD);
})();

/**
 * @param dishName the name of a dish
 * @returns a list of all tags automatically inferred from the dish name
 */
export const getAutoTags = (dishName: string) => {
  const allTags = new Set<string>([]);

  for (const [token, tags] of Object.entries(STRING_TO_TAG)) {
    if (dishName.includes(token)) {
      for (const tag of tags) {
        allTags.add(tag);
      }
    }
  }

  return Array.from(allTags);
};
