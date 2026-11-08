// Rclass – fonctionnement hors ligne. Changez VERSION à chaque mise à jour de index.html.
const VERSION="rclass-v47";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  // Page : réseau d'abord (pour recevoir les mises à jour), sinon la copie hors ligne
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("./index.html",cp));return res}).catch(()=>caches.match("./index.html")));return}
  // Polices et bibliothèque PDF : copie locale, rafraîchie en arrière-plan
  if(/fonts\.(googleapis|gstatic)\.com|www\.gstatic\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/.test(u.host)){e.respondWith(caches.open(VERSION+"-ext").then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}));return}
  if(u.origin===location.origin)e.respondWith(caches.match(r).then(h=>h||fetch(r)));
});
