// Сначала сеть (чтобы обновления приходили сразу), при отсутствии интернета — кэш.
var CACHE = "tk412-v2";
var API = "https://tk412.amogusovick.workers.dev";
var FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("./"); }); })
  );
});

// Уведомления о заменах: сервер присылает пустой сигнал, текст берём у него же
self.addEventListener("push", function (e) {
  e.waitUntil((async function () {
    var title = "Замена в расписании", body = "Откройте приложение, чтобы посмотреть";
    try {
      var r = await fetch(API + "/push/last", { cache: "no-store" });
      var j = await r.json();
      if (j.title) { title = j.title; body = j.body || body; }
    } catch (x) {}
    await self.registration.showNotification(title, { body: body, icon: "icon-192.png", badge: "icon-192.png", tag: "tk412-subs", renotify: true });
  })());
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ("focus" in list[i]) return list[i].focus();
    return clients.openWindow("./");
  }));
});
