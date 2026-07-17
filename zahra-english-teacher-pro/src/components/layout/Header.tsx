"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Moon, Sun, Search, Languages as LangIcon } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { useI18n } from "@/hooks/useI18n";
import { navItems } from "@/lib/nav";
import { Button } from "@/components/ui";

export function Header({ onMenu }: { onMenu: () => void }) {
  const { state, update } = useStore();
  const { t, lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const currentTitle = useMemo(() => {
    const item = [...navItems].reverse().find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));
    return item ? t(item.key) : "";
  }, [pathname, t]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return navItems.filter((n) => t(n.key).toLowerCase().includes(q) || n.label.toLowerCase().includes(q)).slice(0, 6);
  }, [query, t]);

  const toggleTheme = () =>
    update({ settings: { ...state.settings, theme: state.settings.theme === "dark" ? "light" : "dark" } });
  const toggleLang = () =>
    update({ settings: { ...state.settings, language: lang === "ar" ? "en" : "ar" } });

  return (
    <header className="app-header sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <button onClick={onMenu} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="hidden text-lg font-semibold text-neutral-800 dark:text-neutral-100 sm:block">{currentTitle}</h1>

      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder={`${t("search")}…`}
          aria-label={t("search")}
          className="w-full rounded-lg border border-neutral-300 bg-neutral-50 py-2 ps-9 pe-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-800"
        />
        {showResults && results.length > 0 && (
          <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            {results.map((r) => (
              <li key={r.href}>
                <button
                  onMouseDown={() => {
                    router.push(r.href);
                    setQuery("");
                    setShowResults(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <r.icon className="h-4 w-4 text-brand-600" />
                  {t(r.key)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={toggleLang} aria-label="Switch language" title={lang === "ar" ? "English" : "العربية"}>
          <LangIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{lang === "ar" ? "EN" : "AR"}</span>
        </Button>
        <button onClick={toggleTheme} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800" aria-label="Toggle dark mode">
          {state.settings.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
