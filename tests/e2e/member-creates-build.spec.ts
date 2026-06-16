import { expect, test } from "@playwright/test";

test.use({ storageState: process.env.E2E_MEMBER_STORAGE_STATE });

test("approved member creates and submits a build", async ({ page }) => {
  test.skip(!process.env.E2E_MEMBER_STORAGE_STATE, "Member auth state is required.");

  await page.goto("/member/my-build");
  await expect(page.getByRole("heading", { name: /build/i })).toBeVisible();
});
