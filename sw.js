const C='cism-trainer-v9';
const A=['./manifest.webmanifest','./icon.svg',
...Array.from({length:8},(_,i)=>'./payload-'+String(i).padStart(2,'0')+'.js'),
'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put('./index.html',c)).catch(()=>{});return r;})
   .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
   return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy)).catch(()=>{});return res;})));
});