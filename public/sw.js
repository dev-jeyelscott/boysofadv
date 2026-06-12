if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + ".js", c).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[n]) return;
    let i = {};
    const r = (e) => s(e, n),
      d = { module: { uri: n }, exports: i, require: r };
    a[n] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (t(...e), i));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  (importScripts("/push-worker.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/-0ZED437UxccPd_V-h97d/_buildManifest.js",
          revision: "098482c69d0e291d08c5641b906f8dcf",
        },
        {
          url: "/_next/static/-0ZED437UxccPd_V-h97d/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1031-fa7c010bcb151a88.js",
          revision: "fa7c010bcb151a88",
        },
        {
          url: "/_next/static/chunks/1212-9f72ab40763b41f0.js",
          revision: "9f72ab40763b41f0",
        },
        {
          url: "/_next/static/chunks/1819-819484dff7218027.js",
          revision: "819484dff7218027",
        },
        {
          url: "/_next/static/chunks/2487-3c2b2595d821a8b9.js",
          revision: "3c2b2595d821a8b9",
        },
        {
          url: "/_next/static/chunks/2963-a9ec12f41c0d21ac.js",
          revision: "a9ec12f41c0d21ac",
        },
        {
          url: "/_next/static/chunks/3008-83fddc5450e3024c.js",
          revision: "83fddc5450e3024c",
        },
        {
          url: "/_next/static/chunks/3031-e7bb7396bd926b82.js",
          revision: "e7bb7396bd926b82",
        },
        {
          url: "/_next/static/chunks/3214-74d5dca432ec8366.js",
          revision: "74d5dca432ec8366",
        },
        {
          url: "/_next/static/chunks/3761-5452c77fc5522848.js",
          revision: "5452c77fc5522848",
        },
        {
          url: "/_next/static/chunks/4380-7d2c3f548e6015a1.js",
          revision: "7d2c3f548e6015a1",
        },
        {
          url: "/_next/static/chunks/455-8bdc5729b59b7ce1.js",
          revision: "8bdc5729b59b7ce1",
        },
        {
          url: "/_next/static/chunks/6034.03199ed8239d23e4.js",
          revision: "03199ed8239d23e4",
        },
        {
          url: "/_next/static/chunks/6385-f6badd470caeccae.js",
          revision: "f6badd470caeccae",
        },
        {
          url: "/_next/static/chunks/6750-05c63393764d0da3.js",
          revision: "05c63393764d0da3",
        },
        {
          url: "/_next/static/chunks/7004.4d7493f8e80c85e4.js",
          revision: "4d7493f8e80c85e4",
        },
        {
          url: "/_next/static/chunks/7037.5711a9009ac347ff.js",
          revision: "5711a9009ac347ff",
        },
        {
          url: "/_next/static/chunks/7184-3261d8a29bb25498.js",
          revision: "3261d8a29bb25498",
        },
        {
          url: "/_next/static/chunks/7328-813993ccd62df8c5.js",
          revision: "813993ccd62df8c5",
        },
        {
          url: "/_next/static/chunks/9015-b13cf8cd499d115b.js",
          revision: "b13cf8cd499d115b",
        },
        {
          url: "/_next/static/chunks/9085-95eb1da6c95f48e5.js",
          revision: "95eb1da6c95f48e5",
        },
        {
          url: "/_next/static/chunks/9270-5ab3462c180c0b76.js",
          revision: "5ab3462c180c0b76",
        },
        {
          url: "/_next/static/chunks/9293-3cb278d896a73f5a.js",
          revision: "3cb278d896a73f5a",
        },
        {
          url: "/_next/static/chunks/9781-52e777d1c9fc7f17.js",
          revision: "52e777d1c9fc7f17",
        },
        {
          url: "/_next/static/chunks/9935.3955ddc4d3ccca1e.js",
          revision: "3955ddc4d3ccca1e",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/builds/page-2d6532492149722c.js",
          revision: "2d6532492149722c",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/dashboard/page-b6ecbe5c83693d37.js",
          revision: "b6ecbe5c83693d37",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/events/%5BeventId%5D/attendance/page-fe0e72780fa894bb.js",
          revision: "fe0e72780fa894bb",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/events/%5BeventId%5D/page-9148655eb09112f5.js",
          revision: "9148655eb09112f5",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/events/page-e47c6872d84c14c0.js",
          revision: "e47c6872d84c14c0",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/layout-1265b7978aeb4b5f.js",
          revision: "1265b7978aeb4b5f",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/members/page-1ecaca59b40f608d.js",
          revision: "1ecaca59b40f608d",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/memberships/page-e1670a8c4dd12984.js",
          revision: "e1670a8c4dd12984",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/partners/page-b321535e29a416ec.js",
          revision: "b321535e29a416ec",
        },
        {
          url: "/_next/static/chunks/app/(protected)/admin/partnerships/page-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/(protected)/layout-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/(protected)/member/layout-4f821cc4f91a1f1e.js",
          revision: "4f821cc4f91a1f1e",
        },
        {
          url: "/_next/static/chunks/app/(protected)/member/my-build/page-0881b64b81ae4a39.js",
          revision: "0881b64b81ae4a39",
        },
        {
          url: "/_next/static/chunks/app/(protected)/member/profile/page-f05468c580fe01a3.js",
          revision: "f05468c580fe01a3",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-b643fe7f894f14b5.js",
          revision: "b643fe7f894f14b5",
        },
        {
          url: "/_next/static/chunks/app/about/page-329cdb6c638b6563.js",
          revision: "329cdb6c638b6563",
        },
        {
          url: "/_next/static/chunks/app/api/admin/events/%5BeventId%5D/attendance/qr/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/events/%5BeventId%5D/attendance/check-in/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/me/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/push/status/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/push/subscribe/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/push/unsubscribe/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/uploadthing/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/api/webhooks/clerk/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/be-a-partner/page-ed360b68942ed04f.js",
          revision: "ed360b68942ed04f",
        },
        {
          url: "/_next/static/chunks/app/builds/%5BbuildId%5D/page-34c87283a9c14b15.js",
          revision: "34c87283a9c14b15",
        },
        {
          url: "/_next/static/chunks/app/builds/page-2e59cccb7b5e71a3.js",
          revision: "2e59cccb7b5e71a3",
        },
        {
          url: "/_next/static/chunks/app/events/%5BeventId%5D/check-in/page-b6a79a12b3c3e06e.js",
          revision: "b6a79a12b3c3e06e",
        },
        {
          url: "/_next/static/chunks/app/events/%5BeventId%5D/page-18e5f6c2768a9207.js",
          revision: "18e5f6c2768a9207",
        },
        {
          url: "/_next/static/chunks/app/events/page-8b7354ee4569d577.js",
          revision: "8b7354ee4569d577",
        },
        {
          url: "/_next/static/chunks/app/layout-81786daba0ef1382.js",
          revision: "81786daba0ef1382",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/page-1dc2dfc651df36fb.js",
          revision: "1dc2dfc651df36fb",
        },
        {
          url: "/_next/static/chunks/app/partners/page-efa35f9e1b71647b.js",
          revision: "efa35f9e1b71647b",
        },
        {
          url: "/_next/static/chunks/app/pending-approval/page-d4d48251d3bf97a7.js",
          revision: "d4d48251d3bf97a7",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/app/sign-in/%5B%5B...sign-in%5D%5D/page-fec6eaa243f6ce1b.js",
          revision: "fec6eaa243f6ce1b",
        },
        {
          url: "/_next/static/chunks/app/sign-up/%5B%5B...sign-up%5D%5D/page-fec6eaa243f6ce1b.js",
          revision: "fec6eaa243f6ce1b",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/cafc6113-a7c7e45657bca314.js",
          revision: "a7c7e45657bca314",
        },
        {
          url: "/_next/static/chunks/framework-2c89ab1a61bdfcc0.js",
          revision: "2c89ab1a61bdfcc0",
        },
        {
          url: "/_next/static/chunks/main-app-b132b8b73e9bf300.js",
          revision: "b132b8b73e9bf300",
        },
        {
          url: "/_next/static/chunks/main-f5f55c6d8865fe70.js",
          revision: "f5f55c6d8865fe70",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-21094c73624e1c25.js",
          revision: "21094c73624e1c25",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-d2841ad77c36a87f.js",
          revision: "d2841ad77c36a87f",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-378eaba50fb1e1be.js",
          revision: "378eaba50fb1e1be",
        },
        {
          url: "/_next/static/css/96792836b085a4db.css",
          revision: "96792836b085a4db",
        },
        {
          url: "/_next/static/css/b496025c9cd768cc.css",
          revision: "b496025c9cd768cc",
        },
        {
          url: "/_next/static/media/013b72fa676f92e0-s.woff2",
          revision: "bc06a1ea50382b6956e53aeb91c889c1",
        },
        {
          url: "/_next/static/media/22a5144ee8d83bca-s.p.woff2",
          revision: "f4634c3bc1fa7cb53247e1f2872adb5a",
        },
        {
          url: "/_next/static/media/2b5b02fc7e511755-s.woff2",
          revision: "a27466d069120e75e25b4fd06edd5be2",
        },
        {
          url: "/_next/static/media/65f03d54ccadf4a8-s.woff2",
          revision: "58bcf4f276e0844890901b91c411447c",
        },
        {
          url: "/_next/static/media/7d4881bb7e1bf84d-s.p.woff2",
          revision: "cd5b25781181c5c03d99ac2cbf88016a",
        },
        {
          url: "/_next/static/media/9766a7e9e2e0ad5a-s.woff2",
          revision: "9a45f5a5937490fac6d4f5043a36c125",
        },
        {
          url: "/_next/static/media/aa016aab0e6d1295-s.woff2",
          revision: "49215a3bccaeb5d483f4cf8fceb24776",
        },
        {
          url: "/_next/static/media/b66cf8e69499582a-s.woff2",
          revision: "dea7cff2e11a000dc4e0e913992f9c21",
        },
        {
          url: "/_next/static/media/b9408752a0c24fb9-s.woff2",
          revision: "c10faa6c8fbd7a47d8f00e75e82935cb",
        },
        {
          url: "/_next/static/media/e038a29029a234f2-s.woff2",
          revision: "42a21c981b367f31bd04683072dae1c1",
        },
        {
          url: "/_next/static/media/f639721981034f88-s.woff2",
          revision: "f4a75186954722ca80df35984adf581d",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        {
          url: "/fonts/RushZone.otf",
          revision: "3790115a7b291726bb9edd525004e618",
        },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icons/icon-192.png",
          revision: "04b25da4f60c1f4e6d09a9c844abc1c9",
        },
        {
          url: "/icons/icon-512.png",
          revision: "c3670aa641a3831629d255f4b29cbae3",
        },
        {
          url: "/images/about/about-hero.webp",
          revision: "f26595c660ef947025e12b8cb7fa0091",
        },
        {
          url: "/images/adv.png",
          revision: "d93d645914af770aef7fbb6749dcabc0",
        },
        {
          url: "/images/background.png",
          revision: "6c6997dcb095ad508b284eebef64902e",
        },
        {
          url: "/images/boysofadv.png",
          revision: "087eaa7c8ff216e56b718276a0362195",
        },
        {
          url: "/images/cta-partner.webp",
          revision: "86351910586bac033af36ea3b419f18d",
        },
        {
          url: "/images/cta-riders.webp",
          revision: "43138962cbfd086d7e95a73807105dcd",
        },
        {
          url: "/images/featured-machine.png",
          revision: "bccf544ecce751f113e37f46a081adb1",
        },
        {
          url: "/images/hero-bg.webp",
          revision: "1be11871b02794a06eb9c767370b8af4",
        },
        {
          url: "/images/not-your-ordinary-adv.png",
          revision: "fdc95f4ea6f24fd2d9b67f1baf333b95",
        },
        {
          url: "/images/og-image.webp",
          revision: "54c566fb20e92dc86439c3284f6f03ac",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/push-worker.js",
          revision: "2642b12a44e514a4d7f58e4e3db9fe0c",
        },
        { url: "/robots.txt", revision: "e6cc718d6cf747c5b81a744e73b779d1" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: s,
              state: c,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith("/api/auth/") && !!a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
