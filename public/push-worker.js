const DEFAULT_NOTIFICATION = {
  title: "Boys of ADV",
  body: "You have a new notification.",
  url: "/",
  icon: "/icons/icon-192.png",
  badge: "/icons/icon-192.png",
};

function parsePushPayload(event) {
  if (!event.data) {
    return DEFAULT_NOTIFICATION;
  }

  try {
    const payload = event.data.json();

    return {
      title: payload.title || DEFAULT_NOTIFICATION.title,
      body: payload.body || DEFAULT_NOTIFICATION.body,
      url: payload.url || DEFAULT_NOTIFICATION.url,
      icon: payload.icon || DEFAULT_NOTIFICATION.icon,
      badge: payload.badge || DEFAULT_NOTIFICATION.badge,
    };
  } catch {
    return DEFAULT_NOTIFICATION;
  }
}

function getSafeNotificationUrl(url) {
  try {
    const targetUrl = new URL(
      url || DEFAULT_NOTIFICATION.url,
      self.location.origin,
    );

    if (targetUrl.origin !== self.location.origin) {
      return new URL(DEFAULT_NOTIFICATION.url, self.location.origin);
    }

    return targetUrl;
  } catch {
    return new URL(DEFAULT_NOTIFICATION.url, self.location.origin);
  }
}

self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: {
        url: payload.url,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = getSafeNotificationUrl(event.notification.data?.url);

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (clientList) => {
        for (const client of clientList) {
          const clientUrl = new URL(client.url);

          if (clientUrl.origin === self.location.origin) {
            if ("navigate" in client) {
              await client.navigate(targetUrl.href);
            }

            return client.focus();
          }
        }

        return self.clients.openWindow(targetUrl.href);
      }),
  );
});
