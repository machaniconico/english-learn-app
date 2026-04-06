import type { Category } from "../types";
import { beginnerDailyWords } from "./beginner-daily-words";
import { beginnerPeopleLife } from "./beginner-people-life";
import { beginnerNature } from "./beginner-nature";
import { intermediateAcademic } from "./intermediate-academic";
import { intermediateSocial } from "./intermediate-social";
import { intermediateAbstract } from "./intermediate-abstract";
import { businessBasics } from "./business-basics";
import { finance } from "./finance";
import { marketing } from "./marketing";
import { hr } from "./hr";
import { manufacturing } from "./manufacturing";

export const vocabularyCategories: Category[] = [
  beginnerDailyWords,
  beginnerPeopleLife,
  beginnerNature,
  intermediateAcademic,
  intermediateSocial,
  intermediateAbstract,
  businessBasics,
  finance,
  marketing,
  hr,
  manufacturing,
];
