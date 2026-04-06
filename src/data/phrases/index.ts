import type { Category } from "../types";
import { greetings } from "./greetings";
import { daily } from "./daily";
import { travel } from "./travel";
import { business } from "./business";
import { restaurant } from "./restaurant";
import { shopping } from "./shopping";
import { phone } from "./phone";
import { presentations } from "./presentations";
import { negotiations } from "./negotiations";
import { healthcare } from "./healthcare";
import { directions } from "./directions";
import { feelings } from "./feelings";

export const phraseCategories: Category[] = [
  greetings,
  daily,
  travel,
  business,
  restaurant,
  shopping,
  phone,
  presentations,
  negotiations,
  healthcare,
  directions,
  feelings,
];
