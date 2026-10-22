// BloomCalc service worker: makes the site installable and work offline.
const CACHE='bloomcalc-v2';
const PRECACHE=["/", "/about.html", "/age-calculator.html", "/bmi-calculator.html", "/calorie-calculator.html", "/christmas-countdown.html", "/cooking-a-frozen-turkey.html", "/cooking-converter.html", "/days-between-dates.html", "/discount-calculator.html", "/gift-budget-planner.html", "/hourly-to-salary-calculator.html", "/how-long-to-cook-a-turkey.html", "/how-long-to-thaw-a-turkey.html", "/how-much-turkey-per-person.html", "/loan-calculator.html", "/macro-calculator.html", "/percentage-calculator.html", "/privacy.html", "/tdee-calculator.html", "/thanksgiving-food-per-person.html", "/tip-calculator.html", "/turkey-calculator.html", "/turkey-internal-temperature.html", "/water-intake-calculator.html", "/when-to-thaw-turkey-for-thanksgiving.html", "/style.css", "/favicon.svg", "/icon-192.png", "/manifest.webmanifest"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    // pages: fresh from the network when online, saved copy when offline
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('/'))));
    return;
  }
  // css, icons: saved copy first, refreshed in the background
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>m);return m||net}));
});
