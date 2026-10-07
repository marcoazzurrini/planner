export type ThemeMode = "light" | "dark" | "auto";

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  auto: "light",
  dark: "auto",
  light: "dark",
};

export const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "auto";

export const nextThemeMode = (mode: ThemeMode): ThemeMode => NEXT_MODE[mode];

export const resolveThemeMode = (
  mode: ThemeMode,
  systemPrefersDark: boolean
): "light" | "dark" => {
  if (mode === "auto") {
    return systemPrefersDark ? "dark" : "light";
  }
  return mode;
};
