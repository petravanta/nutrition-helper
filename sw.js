// Keeps the app opening without a connection. The page itself is fetched
// network-first, so a new version shows up as soon as the phone is online.
const CACHE='nh-v47';
const SHELL=['./','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET') return;
  const own=u.origin===location.origin;
  const fonts=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  const shared=u.hostname==='petravanta.github.io'&&u.pathname.startsWith('/general/shared/');
  // The barcode and label readers come from jsDelivr at pinned versions, so a cached copy never goes stale
  const lib=u.hostname==='cdn.jsdelivr.net'&&/@\d/.test(u.pathname);
  if(!own&&!fonts&&!shared&&!lib) return;   // food databases, Google sign-in and Drive go straight to the network
  // The build stamp read by the version footer: fresh when online, so it matches the page; cached for offline
  if(own&&u.pathname.endsWith('/version.json')){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone(); caches.open(CACHE).then(k=>k.put(r,c))} return res}).catch(()=>caches.match(r)));
    return;
  }
  if(r.mode==='navigate'){
    // Any URL in scope (including shortcut links like ?do=log) opens the cached page offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone(); caches.open(CACHE).then(k=>k.put('./',c)); return res})
      .catch(()=>caches.match('./')));
    return;
  }
  e.respondWith(caches.open(CACHE).then(async k=>{
    const hit=await k.match(r);
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque') k.put(r,res.clone()); return res});
    if(hit){net.catch(()=>{}); return hit}
    return net;
  }));
});

// Water check notifications: a tap brings the open app forward, or opens it at the water panel
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    const c=cs.find(x=>x.url.startsWith(self.registration.scope));
    return c?c.focus():clients.openWindow(url);
  }));
});
