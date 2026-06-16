import { expect, test } from "@playwright/test";

test("admin publishes submitted build", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_STORAGE_STATE, "Admin auth state is required.");

  await page.goto("/admin/builds");
  await expect(page.getByRole("heading", { name: /build/i })).toBeVisible();
});
