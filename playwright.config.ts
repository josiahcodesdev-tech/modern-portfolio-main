import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  use: { baseURL: "http://localhost:3100", headless: true, trace: "retain-on-failure" },
  webServer: {
    command: `node node_modules/next/dist/bin/next ${process.env.PLAYWRIGHT_USE_PRODUCTION ? "start" : "dev"} -p 3100`,
    url: "http://localhost:3100/admin",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
