// Pure spelling check for the typing-practice mode. Forgiving on case, outer
// whitespace, and a trailing sentence punctuation mark, but otherwise requires
// the exact spelling (the point of the exercise).

export function normalizeSpelling(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?;:]+$/, '');
}

export function checkSpelling(target: string, typed: string): boolean {
  const t = normalizeSpelling(typed);
  return t.length > 0 && t === normalizeSpelling(target);
}
