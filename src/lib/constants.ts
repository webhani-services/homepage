export const LOCALES = ["ja", "en", "ko"] as const;

export type Locale = (typeof LOCALES)[number];

/** Maps index to reveal-delay class for staggered animations */
const REVEAL_DELAY_CLASSES = [
  "reveal-delay-1",
  "reveal-delay-2",
  "reveal-delay-3",
] as const;

export function getRevealDelayClass(index: number): string {
  return REVEAL_DELAY_CLASSES[index % REVEAL_DELAY_CLASSES.length];
}
