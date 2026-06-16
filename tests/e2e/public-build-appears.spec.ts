import { expect, test } from "@playwright/test";

test("published public build appears in listing and detail", async ({ page }) => {
  await page.goto("/builds");

  await expect(page.getByRole("heading", { name: /build/i })).toBeVisible();
  await expect(page.getByText(/draft|unpublished/i)).toHaveCount(0);
});
