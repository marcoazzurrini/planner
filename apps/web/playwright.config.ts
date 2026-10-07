import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  reporter: "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    // Serves the production build in the Workers runtime. A separate port
    // lets tests run while the dev server is open.
    command: "bunx vite preview --host 127.0.0.1 --port 4173 --strictPort",
    reuseExistingServer: false,
    timeout: 60_000,
    url: "http://127.0.0.1:4173",
  },
  workers: process.env.CI ? 4 : undefined,
});
