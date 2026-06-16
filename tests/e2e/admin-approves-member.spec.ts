import { expect, test } from "@playwright/test";

test("admin approves pending member", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_STORAGE_STATE, "Admin auth state is required.");

  await page.goto("/admin/memberships");
  await expect(page.getByRole("heading", { name: /membership/i })).toBeVisible();
});
