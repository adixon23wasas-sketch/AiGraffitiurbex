// WallHunt — api/spots.js
// CommonJS (działa na każdej konfiguracji Vercel)
// GET /api/spots?q=Warszawa          → lista spotów z AI scoringiem
// GET /api/spots?photos=1&lat=&lon=  → zdjęcia Wikimedia dla spotu

“use strict”;

// ─── BAZA LOKALNA ─────────────────────────────────────────────────────────────
const LOCAL_DB = [
{ name: “Hala Fabryczna — Praga-Północ”, lat: 52.2512, lon: 21.054, type: “graffiti_legal”,     score: 9, zaludnienie: “srednie”,  dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Legalna ściana przy starej hali produkcyjnej. Klasyk sceny.”, rec: “Brak ochrony w weekend. Najlepszy start.” },
{ name: “Skatepark Agrykola”,             lat: 52.2198, lon: 21.028, type: “graffiti_legal”,     score: 8, zaludnienie: “wysokie”,  dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Oficjalny skatepark — legalna ściana 24/7. Centrum sceny.”, rec: “Zawsze otwarty.” },
{ name: “Tunel PKP — Szmulki”,            lat: 52.2470, lon: 21.068, type: “graffiti_tolerated”, score: 7, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Klasyczny tunel pod torami. Wieloletnia tradycja graffiti.”, rec: “Wieczorami mało ludzi.” },
{ name: “Opuszczona Fabryka — Wola”,      lat: 52.2368, lon: 20.982, type: “urbex”,              score: 8, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Kompleks starych hal na Woli. Urbex + graffiti.”, rec: “Idź z crew. Wejście od Kasprzaka.” },
{ name: “Aleja Solidarności — Murals”,    lat: 52.2485, lon: 21.012, type: “graffiti_legal”,     score: 9, zaludnienie: “wysokie”,  dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Oficjalna ściana murali. Prestiżowa lokalizacja.”, rec: “Kontakt: Biuro Kultury Warszawy.” },
{ name: “FŻNSiC Ursus — Urbex Ikona”,    lat: 52.2012, lon: 20.901, type: “urbex”,              score: 9, zaludnienie: “niskie”,   dostepnosc: “trudna”,  ryzyko: “wysokie”, opis: “Ikoniczna fabryka ciągników. Największy urbex Mazowsza.”, rec: “Min. 3 osoby. Latarka obowiązkowa.” },
{ name: “Żoliborz — Pod Wiadukt”,         lat: 52.2655, lon: 20.985, type: “graffiti_tolerated”, score: 7, zaludnienie: “srednie”,  dostepnosc: “latwa”,   ryzyko: “srednie”, opis: “Wiadukt z historią graffiti. Znany całej scenie.”, rec: “Najlepsza godzina: wt-śr wieczór.” },
{ name: “Centrum Kultury Praga”,          lat: 52.2556, lon: 21.060, type: “graffiti_legal”,     score: 8, zaludnienie: “srednie”,  dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Legalna ściana + warsztaty graffiti co miesiąc.”, rec: “ckpraga.pl” },
{ name: “Pruszków — Stara Cegielnia”,     lat: 52.1701, lon: 20.803, type: “urbex”,              score: 8, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Opuszczona cegielnia. Duże mury ceglane.”, rec: “40 min kolejką z Warszawy.” },
{ name: “Piastów — Tunel Kolejowy”,       lat: 52.1892, lon: 20.861, type: “graffiti_tolerated”, score: 7, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Podejście pod tory w Piastowie. Znane środowisku.”, rec: “Aktywne wieczorami.” },
{ name: “Grodzisk Maz — Opuszczony Zakład”, lat: 52.1089, lon: 20.627, type: “urbex”,            score: 7, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “niskie”,  opis: “Opuszczony zakład produkcyjny w centrum Grodziska.”, rec: “50 min WKD. Weekendy — mało ludzi.” },
{ name: “Milanówek — Stara Stacja”,       lat: 52.1312, lon: 20.670, type: “graffiti_tolerated”, score: 6, zaludnienie: “niskie”,   dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Okolice dworca WKD. Mury i podejścia od stacji.”, rec: “Spokojna okolica.” },
{ name: “Bemowo — Hale Przemysłowe”,      lat: 52.2431, lon: 20.930, type: “graffiti_tolerated”, score: 7, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Stare hale przemysłowe. Duże powierzchnie betonowe.”, rec: “Mało znane poza lokalną sceną.” },
{ name: “Targówek — Undergroundy”,        lat: 52.2764, lon: 21.074, type: “graffiti_tolerated”, score: 7, zaludnienie: “srednie”,  dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Przejścia podziemne na Targówku. Klasyczna lokalizacja.”, rec: “Wejście od ul. Kondratowicza.” },
{ name: “Mokotów — Mury Kolejowe”,        lat: 52.1895, lon: 21.023, type: “graffiti_tolerated”, score: 6, zaludnienie: “srednie”,  dostepnosc: “latwa”,   ryzyko: “srednie”, opis: “Mury wzdłuż linii kolejowej na Mokotowie.”, rec: “Od Puławskiej do Rakowieckiej.” },
{ name: “Brwinów — Stary Tartak”,         lat: 52.1127, lon: 20.710, type: “urbex”,              score: 7, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “niskie”,  opis: “Opuszczony tartak. Dobre ściany drewniane i ceglane.”, rec: “Łatwy dojazd z Pruszkowa.” },
{ name: “Żyrardów — Stara Przędzalnia”,  lat: 52.0500, lon: 20.445, type: “urbex”,              score: 8, zaludnienie: “niskie”,   dostepnosc: “srednia”, ryzyko: “srednie”, opis: “Zabytkowa przędzalnia lnu. Jeden z najpiękniejszych urbexów Mazowsza.”, rec: “Wycieczka na cały dzień. Duży kompleks.” },
{ name: “Parzniew — Opuszczony Zakład”,   lat: 52.1600, lon: 20.850, type: “urbex”,              score: 7, zaludnienie: “niskie”,   dostepnosc: “latwa”,   ryzyko: “niskie”,  opis: “Opuszczony zakład przemysłowy przy obwodnicy.”, rec: “Łatwy dojazd z Pruszkowa.” },
];

// ─── MAPA OBSZARÓW ─────────────────────────────────────────────────────────────
const AREA_MAP = {
“praga”: [52.252, 21.048], “praga-północ”: [52.258, 21.046], “praga-południe”: [52.238, 21.055],
“wola”: [52.236, 20.987], “mokotów”: [52.198, 21.023], “mokotow”: [52.198, 21.023],
“żoliborz”: [52.268, 20.985], “zoliborz”: [52.268, 20.985],
“targówek”: [52.276, 21.074], “targowek”: [52.276, 21.074],
“ursus”: [52.198, 20.898], “bemowo”: [52.243, 20.929],
“ursynów”: [52.148, 21.059], “ursynow”: [52.148, 21.059],
“śródmieście”: [52.231, 21.006], “srodmiescie”: [52.231, 21.006], “centrum”: [52.231, 21.006],
“bielany”: [52.291, 20.948], “ochota”: [52.219, 20.971],
“pruszków”: [52.168, 20.799], “pruszkow”: [52.168, 20.799],
“piastów”: [52.187, 20.856], “piastow”: [52.187, 20.856],
“grodzisk”: [52.108, 20.621],
“milanówek”: [52.133, 20.669], “milanowek”: [52.133, 20.669],
“brwinów”: [52.112, 20.709], “brwinow”: [52.112, 20.709],
“żyrardów”: [52.050, 20.445], “zyrardow”: [52.050, 20.445],
“parzniew”: [52.160, 20.850],
“warszawa”: [52.229, 21.012], “warsaw”: [52.229, 21.012],
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function setCORS(res) {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “GET, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);
}

function addGoogleLinks(s) {
return {
…s,
mapsUrl:    `https://www.google.com/maps?q=${s.lat},${s.lon}`,
navCar:     `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`,
navTransit: `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=transit`,
navWalk:    `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=walking`,
streetView: `https://www.google.com/maps?layer=c&cbll=${s.lat},${s.lon}`,
embedUrl:   `https://maps.google.com/maps?q=${s.lat},${s.lon}&z=16&output=embed`,
};
}

function dedup(arr) {
const out = [];
for (const s of arr) {
if (!s || !s.lat || !s.lon) continue;
const dupe = out.some(
(o) => Math.abs(o.lat - s.lat) < 0.0005 && Math.abs(o.lon - s.lon) < 0.0005
);
if (!dupe) out.push(s);
}
return out;
}

function textToCoords(text) {
const low = text.toLowerCase();
for (const [key, coords] of Object.entries(AREA_MAP)) {
if (low.includes(key)) {
return {
lat: coords[0] + (Math.random() - 0.5) * 0.012,
lon: coords[1] + (Math.random() - 0.5) * 0.012,
};
}
}
return null;
}

// ─── GEOCODING ─────────────────────────────────────────────────────────────────
async function geocode(query) {
const url = “https://nominatim.openstreetmap.org/search?” +
new URLSearchParams({ q: query + “ Polska”, format: “json”, limit: “1” });
const res = await fetch(url, {
headers: { “User-Agent”: “WallHunt/1.0” },
signal: AbortSignal.timeout(7000),
});
if (!res.ok) throw new Error(“Nominatim “ + res.status);
const data = await res.json();
if (!data.length) throw new Error(“Nie znaleziono: “ + query);
return { lat: +data[0].lat, lon: +data[0].lon, name: data[0].display_name.split(”,”)[0] };
}

// ─── OSM OVERPASS ──────────────────────────────────────────────────────────────
async function fetchOSM(lat, lon, r) {
const q = `[out:json][timeout:18];( way["leisure"="skate_park"](around:${r},${lat},${lon}); way["building"="industrial"](around:${r},${lat},${lon}); way["building"="warehouse"](around:${r},${lat},${lon}); way["abandoned"="yes"](around:${r},${lat},${lon}); way["disused"="yes"](around:${r},${lat},${lon}); way["historic"="ruins"](around:${r},${lat},${lon}); node["amenity"="arts_centre"](around:${r},${lat},${lon}); node["tourism"="artwork"]["artwork_type"="mural"](around:${r},${lat},${lon}); way["tunnel"="yes"]["railway"](around:${r},${lat},${lon}); way["landuse"="industrial"](around:${r},${lat},${lon}); );out center 20;`;

const res = await fetch(
“https://overpass-api.de/api/interpreter?data=” + encodeURIComponent(q),
{ signal: AbortSignal.timeout(15000) }
);
if (!res.ok) throw new Error(“Overpass “ + res.status);
const data = await res.json();

return (data.elements || []).slice(0, 18).map((el) => {
const la = el.lat ?? el.center?.lat;
const lo = el.lon ?? el.center?.lon;
if (!la || !lo) return null;
const t = el.tags || {};
let type = “graffiti_tolerated”, score = 5;
if (t.leisure === “skate_park” || t.amenity === “arts_centre” || t.tourism === “artwork”) { type = “graffiti_legal”; score = 7; }
else if (t.abandoned === “yes” || t.disused === “yes” || t.historic === “ruins”) { type = “urbex”; score = 6; }
else if (t.tunnel === “yes”) { type = “graffiti_wild”; score = 5; }
else if (t.building === “industrial” || t.landuse === “industrial”) { type = “graffiti_tolerated”; score = 6; }
const name = t.name || t[“name:pl”] || `OSM: ${t.building || t.leisure || t.amenity || t.historic || "obiekt"}`;
const tags = Object.entries(t).slice(0, 3).map(([k, v]) => `${k}=${v}`).join(”, “);
return { name, lat: la, lon: lo, type, score,
zaludnienie: “srednie”, dostepnosc: “srednia”, ryzyko: “srednie”,
opis: `OpenStreetMap · ${tags.slice(0, 80)}`,
rec: “Dane z OSM. Sprawdź osobiście przed wizytą.”, source: “osm” };
}).filter(Boolean);
}

// ─── REDDIT ─────────────────────────────────────────────────────────────────────
async function fetchReddit(city) {
const spots = [];
const urls = [
`https://www.reddit.com/search.json?q=${encodeURIComponent("graffiti " + city + " ściana spot")}&sort=relevance&limit=15&t=all`,
`https://www.reddit.com/r/Polska/search.json?q=${encodeURIComponent("graffiti spot mural")}&sort=top&limit=10&restrict_sr=on&t=year`,
`https://www.reddit.com/r/warsaw/search.json?q=${encodeURIComponent("graffiti mural")}&sort=top&limit=8&restrict_sr=on&t=all`,
];
for (const url of urls) {
try {
const res = await fetch(url, { headers: { “User-Agent”: “WallHunt/1.0” }, signal: AbortSignal.timeout(8000) });
if (!res.ok) continue;
const data = await res.json();
for (const p of data?.data?.children || []) {
const pd = p.data;
const full = ((pd.title || “”) + “ “ + (pd.selftext || “”)).toLowerCase();
if (!full.includes(“graffiti”) && !full.includes(“mural”) && !full.includes(“spot”) && !full.includes(“ściana”)) continue;
const coords = textToCoords(full + “ “ + city.toLowerCase());
if (!coords) continue;
const isLegal = full.includes(“legal”) || full.includes(“pozwoleni”);
const isUrbex = full.includes(“opuszczon”) || full.includes(“abandon”) || full.includes(“urbex”);
spots.push({
name: “Reddit: “ + (pd.title || “”).slice(0, 55),
lat: coords.lat, lon: coords.lon,
type: isLegal ? “graffiti_legal” : isUrbex ? “urbex” : “graffiti_tolerated”,
score: Math.min(8, 4 + Math.floor((pd.score || 0) / 30)),
zaludnienie: “srednie”, dostepnosc: “srednia”, ryzyko: “srednie”,
opis: (pd.title || “”).slice(0, 100),
rec: `Reddit r/${pd.subreddit} · ${pd.score || 0} pkt`,
source: “reddit”,
url: pd.permalink ? “https://reddit.com” + pd.permalink : null,
});
if (spots.length >= 7) return spots;
}
} catch (_) {}
}
return spots;
}

// ─── WIKIMEDIA ──────────────────────────────────────────────────────────────────
async function fetchWikimedia(lat, lon) {
const url = “https://commons.wikimedia.org/w/api.php?” +
new URLSearchParams({ action: “query”, list: “geosearch”, gsradius: “3000”,
gscoord: `${lat}|${lon}`, gslimit: “15”, format: “json”, origin: “*” });
const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
if (!res.ok) return [];
const data = await res.json();
return (data?.query?.geosearch || []).slice(0, 8).map((item) => ({
name: “Wikimedia: “ + item.title.replace(/*/g, “ “).slice(0, 55),
lat: item.lat + (Math.random() - 0.5) * 0.002,
lon: item.lon + (Math.random() - 0.5) * 0.002,
type: “graffiti_tolerated”, score: 5,
zaludnienie: “srednie”, dostepnosc: “latwa”, ryzyko: “niskie”,
opis: “Wikimedia Commons: “ + item.title.replace(/*/g, “ “),
rec: “Udokumentowane fotograficznie w Wikimedia Commons.”, source: “wiki”, wikiTitle: item.title,
}));
}

// ─── WIKIMEDIA PHOTOS ───────────────────────────────────────────────────────────
async function fetchPhotos(lat, lon, radius) {
const gsUrl = “https://commons.wikimedia.org/w/api.php?” +
new URLSearchParams({ action: “query”, list: “geosearch”, gsradius: String(radius),
gscoord: `${lat}|${lon}`, gslimit: “10”, format: “json”, origin: “*” });
const gsRes = await fetch(gsUrl, { signal: AbortSignal.timeout(8000) });
if (!gsRes.ok) return [];
const gsData = await gsRes.json();
const items = gsData?.query?.geosearch || [];
if (!items.length) return [];

const titles = items.slice(0, 6).map((i) => i.title).join(”|”);
const tUrl = “https://commons.wikimedia.org/w/api.php?” +
new URLSearchParams({ action: “query”, titles, prop: “imageinfo”,
iiprop: “url|thumburl|extmetadata”, iiurlwidth: “400”, format: “json”, origin: “*” });
const tRes = await fetch(tUrl, { signal: AbortSignal.timeout(8000) });
if (!tRes.ok) return [];
const tData = await tRes.json();

return Object.values(tData?.query?.pages || {}).map((p) => {
const ii = p.imageinfo?.[0]; if (!ii) return null;
const m = ii.extmetadata || {};
return {
title: (p.title || “”).replace(“File:”, “”).replace(/_/g, “ “),
thumb: ii.thumburl || ii.url, full: ii.url,
license: m.LicenseShortName?.value || “CC”,
author: (m.Artist?.value || “”).replace(/<[^>]*>/g, “”).slice(0, 60),
};
}).filter(Boolean);
}

// ─── POLLINATIONS AI ────────────────────────────────────────────────────────────
async function scoreWithAI(spots) {
const results = [];
for (const s of spots.slice(0, 20)) {
try {
const prompt = `Jesteś ekspertem sceny graffiti i urbex Warszawy. Oceń spot:\nNazwa: ${s.name}\nTyp: ${s.type}\nOpis: ${s.opis}\nGPS: ${(s.lat||0).toFixed(4)}, ${(s.lon||0).toFixed(4)}\nŹródło: ${s.source}\nOdpowiedz WYŁĄCZNIE czystym JSON:\n{"score":7,"type":"${s.type}","zaludnienie":"srednie","dostepnosc":"srednia","ryzyko":"srednie","opis":"max 70 znaków PL","rec":"max 90 znaków PL"}`;
const res = await fetch(“https://text.pollinations.ai/” + encodeURIComponent(prompt), { signal: AbortSignal.timeout(12000) });
if (!res.ok) { results.push(s); continue; }
const text = await res.text();
const match = text.match(/{[\s\S]*?}/);
if (match) {
const ai = JSON.parse(match[0]);
results.push({ …s,
score: typeof ai.score === “number” ? Math.min(10, Math.max(1, ai.score)) : s.score,
type: ai.type || s.type,
zaludnienie: ai.zaludnienie || s.zaludnienie,
dostepnosc: ai.dostepnosc || s.dostepnosc,
ryzyko: ai.ryzyko || s.ryzyko,
opis: ai.opis || s.opis,
rec: ai.rec || s.rec,
});
} else { results.push(s); }
} catch (_) { results.push(s); }
}
return results;
}

// ─── HANDLER ────────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
setCORS(res);
if (req.method === “OPTIONS”) return res.status(200).end();

const { q, photos, lat: pLat, lon: pLon, radius = “400” } = req.query;

// Photos sub-route
if (photos === “1” && pLat && pLon) {
try {
const list = await fetchPhotos(+pLat, +pLon, +radius);
return res.status(200).json({ photos: list });
} catch (e) {
return res.status(200).json({ photos: [], error: e.message });
}
}

// Main spots route
const query = (q || “Warszawa”).trim();
let lat = 52.2297, lon = 21.0122, locName = “Warszawa”;

try {
const geo = await geocode(query);
lat = geo.lat; lon = geo.lon; locName = geo.name;
} catch (_) {
const low = query.toLowerCase();
for (const [k, v] of Object.entries(AREA_MAP)) {
if (low.includes(k)) { lat = v[0]; lon = v[1]; locName = query; break; }
}
}

const local = LOCAL_DB.filter((s) => Math.sqrt((s.lat - lat) ** 2 + (s.lon - lon) ** 2) < 0.18);

const [osmR, redditR, wikiR] = await Promise.allSettled([
fetchOSM(lat, lon, 3000),
fetchReddit(locName),
fetchWikimedia(lat, lon),
]);

const combined = dedup([
…local,
…(osmR.value || []),
…(redditR.value || []),
…(wikiR.value || []),
]);

const scored = await scoreWithAI(combined);
const final = scored.sort((a, b) => (b.score || 5) - (a.score || 5)).map(addGoogleLinks);

return res.status(200).json({
success: true,
location: { name: locName, lat, lon },
count: final.length,
sources: {
local: local.length,
osm: osmR.value?.length || 0,
reddit: redditR.value?.length || 0,
wiki: wikiR.value?.length || 0,
},
spots: final,
});
};
