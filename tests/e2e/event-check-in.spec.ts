import { expect, test } from "@playwright/test";

test.use({ storageState: process.env.E2E_MEMBER_STORAGE_STATE });

test("member event check-in flow", async ({ context, page }) => {
  test.skip(!process.env.E2E_MEMBER_STORAGE_STATE, "Member auth state is required.");

  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 14.5995, longitude: 120.9842 });
  await page.goto(process.env.E2E_EVENT_CHECK_IN_PATH ?? "/events/test-event/check-in");

  await expect(page.getByText(/check.?in/i)).toBeVisible();
});
