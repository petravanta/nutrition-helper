// Keeps the app opening without a connection. The page itself is fetched
// network-first, so a new version shows up as soon as the phone is online.
const CACHE='nh-v11';
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
  if(!own&&!fonts&&!shared) return;   // food databases, Google sign-in and Drive go straight to the network
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
