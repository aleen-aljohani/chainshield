"use client";

import { useMemo } from "react";
import { useStore } from "@/context/StoreProvider";
import { seedVocabulary, VocabItem } from "@/data/vocabulary";

/** Combined seed + custom vocabulary with the teacher's mastery overrides applied. */
export function useVocab(): VocabItem[] {
  const { state } = useStore();
  return useMemo(() => {
    const all = [...seedVocabulary, ...state.customVocab];
    return all.map((v) => ({ ...v, mastery: state.vocabMastery[v.id] ?? v.mastery }));
  }, [state.customVocab, state.vocabMastery]);
}
