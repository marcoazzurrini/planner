import { useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";
const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  auto: "light",
  dark: "auto",
  light: "dark",
};
const MODE_NAMES: Record<ThemeMode, string> = {
  auto: "Auto",
  dark: "Dark",
  light: "Light",
};

const listeners = new Set<() => void>();

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "auto";

const readMode = (): ThemeMode => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeMode(stored) ? stored : "auto";
};

const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  let resolved: "light" | "dark" = mode === "dark" ? "dark" : "light";
  if (mode === "auto" && prefersDark()) {
    resolved = "dark";
  }

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  if (mode === "auto") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }
  root.style.colorScheme = resolved;
};

const onSystemChange = () => {
  if (readMode() === "auto") {
    applyThemeMode("auto");
  }
};

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  listeners.add(onChange);
  media.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onSystemChange);
  };
};

const getServerMode = (): ThemeMode => "auto";

const ThemeToggle = () => {
  const mode = useSyncExternalStore(subscribe, readMode, getServerMode);

  const toggleMode = () => {
    const nextMode = NEXT_MODE[mode];
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyThemeMode(nextMode);
    for (const listener of listeners) {
      listener();
    }
  };

  const label =
    mode === "auto"
      ? "Theme mode: auto (system). Click to switch to light mode."
      : `Theme mode: ${mode}. Click to switch mode.`;

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {MODE_NAMES[mode]}
    </button>
  );
};

export default ThemeToggle;
