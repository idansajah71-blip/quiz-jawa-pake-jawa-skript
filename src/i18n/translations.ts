import "../engine/translations.jawa"
import type { Language, LocalizedText } from "../types"

export type TranslationKey = keyof typeof window.__jawaI18n & string

const dict = window.__jawaI18n as Record<TranslationKey, LocalizedText>

const translations: Record<Language, Record<TranslationKey, string>> = {
  id: Object.fromEntries(
    Object.entries(dict).map(([k, v]) => [k, v.id]),
  ) as Record<TranslationKey, string>,
  jawa: Object.fromEntries(
    Object.entries(dict).map(([k, v]) => [k, v.jawa]),
  ) as Record<TranslationKey, string>,
}

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key]
}

export function localize(lang: Language, text: LocalizedText): string {
  return lang === "jawa" ? text.jawa : text.id
}