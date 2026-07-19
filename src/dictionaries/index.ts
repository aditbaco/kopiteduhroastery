// Two fixed locales, so no i18n library — a typed dictionary plus a `[lang]`
// route segment covers it without the bundle cost or config surface.

// Dictionary Imports
import type id from './id'

export const LANGS = ['id', 'en'] as const

export type Lang = (typeof LANGS)[number]

export const DEFAULT_LANG: Lang = 'id'

// The Indonesian dictionary defines the contract; en.ts is checked against it.
// `as const` gives every value a literal type, which would force en.ts to repeat
// the Indonesian strings verbatim — so widen leaves back to `string` while
// keeping the key structure exact. Missing or misspelled keys still error.
// The string check must come before the object check, since string has keys.
type Widen<T> = T extends string
  ? string
  : T extends object
    ? { -readonly [K in keyof T]: Widen<T[K]> }
    : T

export type Dictionary = Widen<typeof id>

export const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value)

// Dynamic import keeps the unused locale out of the server bundle for a request.
const dictionaries: Record<Lang, () => Promise<{ default: Dictionary }>> = {
  id: () => import('./id').then(m => ({ default: m.default as Dictionary })),
  en: () => import('./en')
}

export const getDictionary = async (lang: Lang): Promise<Dictionary> => {
  const load = dictionaries[lang] ?? dictionaries[DEFAULT_LANG]

  return (await load()).default
}

// Falls back to the Indonesian value when a translation is missing or blank —
// this is what lets the client add English gradually instead of all at once.
export const pickLocalized = (lang: Lang, base: string, translated?: string | null): string =>
  lang === 'en' && translated?.trim() ? translated : base
