import type { Category } from "../types";
import { businessIdioms } from "./business-idioms";
import { collocations } from "./collocations";
import { phrasalVerbs } from "./phrasal-verbs";

export const idiomCategories: Category[] = [
  businessIdioms,
  collocations,
  phrasalVerbs,
];
