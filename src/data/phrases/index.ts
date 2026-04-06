import type { Category } from "../types";
import { greetings } from "./greetings";
import { daily } from "./daily";
import { travel } from "./travel";
import { business } from "./business";
import { restaurant } from "./restaurant";
import { shopping } from "./shopping";

export const phraseCategories: Category[] = [
  greetings,
  daily,
  travel,
  business,
  restaurant,
  shopping,
];
