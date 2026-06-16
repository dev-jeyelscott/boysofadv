export function createPushSubscription(overrides = {}) {
  return {
    endpoint: "https://push.example.com/subscription/1",
    keys: {
      p256dh: "test-p256dh",
      auth: "test-auth",
    },
    ...overrides,
  };
}
