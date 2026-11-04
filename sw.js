const PREFIX='cism-trainer-';
const C=PREFIX+'v12';
const A=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const ALLOWED=new Set(A.map(asset=>new URL(asset,self.registration.scope).href));
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!ALLOWED.has(e.request.url))return;
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(async r=>{if(r.ok&&!r.redirected&&ALLOWED.has(r.url)){const c=r.clone();await caches.open(C).then(x=>x.put('./index.html',c)).catch(()=>{});}return r;})
   .catch(()=>caches.open(C).then(async c=>(await c.match('./index.html'))||c.match('./'))));
   return;
 }
 e.respondWith(caches.open(C).then(async c=>(await c.match(e.request))||fetch(e.request).then(async res=>{if(res.ok&&!res.redirected&&ALLOWED.has(res.url)){await c.put(e.request,res.clone()).catch(()=>{});}return res;})));
});
