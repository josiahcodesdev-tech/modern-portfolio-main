import { test, expect, type Page } from "@playwright/test"

async function openAdmin(page: Page) {
  await page.goto("/admin", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { name: "Content studio" })).toBeVisible()
}
async function section(page: Page, name: string) {
  await page.getByRole("navigation", { name: "Content sections" }).getByRole("button", { name, exact: true }).click()
}
async function save(page: Page) {
  await page.getByRole("button", { name: "Save changes", exact: true }).click()
  await expect(page.getByText("Saved in this browser. Your portfolio now uses these changes.")).toBeVisible()
}
test.beforeEach(async ({ context }) => {
  // Embedded project previews are unrelated to the local editor and need no external network.
  await context.route("**/*", route => {
    const url = new URL(route.request().url())
    return url.hostname === "localhost" || url.protocol === "data:" ? route.continue() : route.abort()
  })
})

test("edits profile, persists after reload, synchronizes another tab, and exports a backup", async ({ page, context }) => {
  await openAdmin(page)
  const preview = await context.newPage()
  await preview.goto("/", { waitUntil: "domcontentloaded" })
  await section(page, "Profile & contact")
  await page.getByLabel("Full name", { exact: true }).fill("Portfolio Test Owner")
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com")
  await save(page)
  await expect(preview.getByRole("heading", { name: "Portfolio Test Owner", exact: true })).toBeVisible()
  await page.reload({ waitUntil: "domcontentloaded" })
  await section(page, "Profile & contact")
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Portfolio Test Owner")
  const download = page.waitForEvent("download")
  await page.getByRole("button", { name: "Export", exact: true }).click()
  expect((await download).suggestedFilename()).toMatch(/^portfolio-backup-.*\.json$/)
  await page.screenshot({ path: "test-results/admin-desktop.png" })
})

test("adds a project, validates unique URLs, renders its direct route, reorders and removes it", async ({ page }) => {
  await openAdmin(page)
  await page.getByRole("button", { name: "Add project", exact: true }).click()
  const project = page.locator("details").last()
  await project.getByLabel("Project name", { exact: true }).fill("Test Case Study")
  await project.getByLabel("Project URL", { exact: true }).fill("mycareercraft")
  await project.getByLabel("Short description", { exact: true }).fill("An added project.")
  await project.getByLabel("Full case study", { exact: true }).fill("This case study was added from the local editor.")
  await page.getByRole("button", { name: "Save changes", exact: true }).click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Project URLs must be unique")
  await project.getByLabel("Project URL", { exact: true }).fill("test-case-study")
  await save(page)
  await page.goto("/projects/test-case-study", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { name: "Test Case Study", exact: true })).toBeVisible()
  await page.reload({ waitUntil: "domcontentloaded" })
  await expect(page.getByText("This case study was added from the local editor.")).toBeVisible()
  await openAdmin(page)
  await page.getByRole("button", { name: "Move entry 5 up", exact: true }).click()
  await expect(page.locator("details").nth(3).getByLabel("Project name", { exact: true })).toHaveValue("Test Case Study")
  page.once("dialog", dialog => dialog.accept())
  await page.locator("details").nth(3).getByRole("button", { name: "Remove", exact: true }).click()
  await save(page)
  await page.goto("/projects/test-case-study", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible()
})

test("rejects unsafe imports and leaves the last saved content intact when storage is full", async ({ page }) => {
  await openAdmin(page)
  await page.getByLabel("Import portfolio backup").setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from('{"version":1,"content":{}}') })
  await expect(page.getByRole("main").getByRole("alert")).toContainText("not a valid")
  await section(page, "Profile & contact")
  await page.getByLabel("Full name", { exact: true }).fill("Do not persist")
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError") } })
  await page.getByRole("button", { name: "Save changes", exact: true }).click()
  await expect(page.getByRole("main").getByRole("alert")).toContainText("previous saved content is unchanged")
  expect(await page.evaluate(() => localStorage.getItem("portfolio-content-v1"))).toBeNull()
})

test("works on mobile and reports damaged storage without deleting it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem("portfolio-content-v1", "broken-json"))
  await openAdmin(page)
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not be read")
  expect(await page.evaluate(() => localStorage.getItem("portfolio-content-v1"))).toBe("broken-json")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: "test-results/admin-mobile.png" })
})

test("imports a backup for review and saves an uploaded image", async ({ page }) => {
  await openAdmin(page)
  await section(page, "Profile & contact")
  await page.getByLabel("Full name", { exact: true }).fill("Backup Owner")
  await save(page)
  const backup = await page.evaluate(() => localStorage.getItem("portfolio-content-v1")!)
  await page.getByLabel("Full name", { exact: true }).fill("Changed Owner")
  await save(page)
  page.once("dialog", dialog => dialog.accept())
  await page.getByLabel("Import portfolio backup").setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(backup) })
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Backup Owner")
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem("portfolio-content-v1")))!).content.site.name).toBe("Changed Owner")
  await page.getByLabel("Upload image").setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZlVQAAAAASUVORK5CYII=", "base64") })
  await expect(page.getByAltText("Profile photo preview")).toHaveAttribute("src", /^data:image\/png;base64,/)
  await save(page)
  await page.reload({ waitUntil: "domcontentloaded" })
  await section(page, "Profile & contact")
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Backup Owner")
  await expect(page.getByAltText("Profile photo preview")).toHaveAttribute("src", /^data:image\/png;base64,/)
})
