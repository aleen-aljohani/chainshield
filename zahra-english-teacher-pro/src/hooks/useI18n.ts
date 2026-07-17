"use client";

import { useStore } from "@/context/StoreProvider";
import { t as translate, Lang } from "@/lib/i18n";

export function useI18n() {
  const { state } = useStore();
  const lang: Lang = state.settings.language;
  const t = (key: string) => translate(key, lang);
  const isRTL = lang === "ar";
  return { t, lang, isRTL };
}
