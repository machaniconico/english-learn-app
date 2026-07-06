export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export const SHORTCUT_OPTION_KEYS: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  a: 0,
  b: 1,
  c: 2,
  d: 3,
};

export function shouldIgnoreShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"], [contenteditable=""]') !== null
  );
}

export function isSpaceKey(event: KeyboardEvent): boolean {
  return event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar' || event.code === 'Space';
}
