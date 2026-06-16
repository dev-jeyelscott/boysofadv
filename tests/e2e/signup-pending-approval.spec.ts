import { expect, test } from "@playwright/test";

test("signup pending approval flow", async ({ page }) => {
  await page.goto("/pending-approval");

  await expect(page.getByText(/pending approval/i)).toBeVisible();
  await page.goto("/member/profile");
  await expect(page).not.toHaveURL(/\/admin\//);
});
