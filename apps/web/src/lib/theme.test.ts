import { describe, expect, test } from "bun:test";

import { isThemeMode, nextThemeMode, resolveThemeMode } from "./theme";

describe("isThemeMode", () => {
  test("accepts the three modes", () => {
    expect(isThemeMode("light")).toBe(true);
    expect(isThemeMode("dark")).toBe(true);
    expect(isThemeMode("auto")).toBe(true);
  });

  test("rejects other stored values", () => {
    expect(isThemeMode(null)).toBe(false);
    expect(isThemeMode("")).toBe(false);
    expect(isThemeMode("Dark")).toBe(false);
  });
});

describe("nextThemeMode", () => {
  test("cycles light, dark, auto", () => {
    expect(nextThemeMode("light")).toBe("dark");
    expect(nextThemeMode("dark")).toBe("auto");
    expect(nextThemeMode("auto")).toBe("light");
  });
});

describe("resolveThemeMode", () => {
  test("follows the system only in auto mode", () => {
    expect(resolveThemeMode("auto", true)).toBe("dark");
    expect(resolveThemeMode("auto", false)).toBe("light");
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
  });
});
