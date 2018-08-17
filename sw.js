var staticCacheName = 'restaurant-reviews-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'restaurant.html',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        ]);
    })
  );
});

self.addEventListener('activate', function (event){
     console.log("Service worker activated successfully");
}
self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname === '/restaurant.html') {
    console.log(requestUrl);
    event.respondWith(caches.match('/restaurant.html'));
    return;
  }

  if (requestUrl.pathname.startsWith('/data')) {
    event.respondWith(
      caches.open(staticCacheName).then((cache) => {
        return cache.match(event.request.url).then((cacheResponse) => {
          var netFetch = fetch(event.request).then((netResponse) => {
            cache.put(event.request.url, netResponse.clone());
            return netResponse;
          });
          
          return cacheResponse || netFetch;
        })
      })
    );
    return;
  }
  event.respondWith(
    caches.open(staticCacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request);
      });
    }) 
  );
});
