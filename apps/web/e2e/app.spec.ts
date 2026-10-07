import { expect, test } from "@playwright/test";

test("renders the home page on the server", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("<title>Planner</title>");
});

test("navigates from home to about", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { exact: true, name: "About" }).first().click();
  await expect(page).toHaveURL("/about");
  await expect(
    page.getByRole("heading", { name: "A small starter with room to grow." })
  ).toBeVisible();
});

test("theme toggle cycles and persists the mode", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Theme mode/u });
  await expect(toggle).toHaveText("Auto");

  await toggle.click();
  await expect(toggle).toHaveText("Light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await toggle.click();
  await expect(toggle).toHaveText("Dark");
  await expect(page.locator("html")).toHaveClass(/dark/u);

  await page.reload();
  await expect(toggle).toHaveText("Dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
