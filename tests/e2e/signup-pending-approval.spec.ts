import { expect, test } from "@playwright/test";

test.use({ storageState: process.env.E2E_PENDING_MEMBER_STORAGE_STATE });

test("signup pending approval flow", async ({ page }) => {
  test.skip(
    !process.env.E2E_PENDING_MEMBER_STORAGE_STATE,
    "Pending member auth state is required.",
  );

  await page.goto("/pending-approval");

  await expect(
    page.getByRole("heading", { name: /waiting for approval/i }),
  ).toBeVisible();
  await page.goto("/member/profile");
  await expect(page).toHaveURL(/\/pending-approval/);
});
