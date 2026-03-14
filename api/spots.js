// WallHunt — jeden plik backend
// Obsługuje: /api/spots?q=Warszawa  /api/spots?photos=1&lat=52&lon=21
export const config = { maxDuration: 30 };

const LOCAL = [
{ name:‘Hala Fabryczna — Praga’,    lat:52.2512, lon:21.0540, type:‘graffiti_legal’,     score:9, zaludnienie:‘srednie’, dostepnosc:‘latwa’,  ryzyko:‘niskie’,  opis:‘Legalna ściana, stara hala. Klasyk sceny.’,              rec:‘Brak ochrony w weekend.’ },
{ name:‘Skatepark Agrykola’,         lat:52.2198, lon:21.0285, type:‘graffiti_legal’,     score:8, zaludnienie:‘wysokie’, dostepnosc:‘latwa’,  ryzyko:‘niskie’,  opis:‘Oficjalny skatepark — legalne malowanie 24/7.’,           rec:‘Zawsze otwarty. Dobry start.’ },
{ name:‘Tunel PKP — Szmulki’,        lat:52.2470, lon:21.0680, type:‘graffiti_tolerated’, score:7, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Klasyczny tunel pod torami. Wieloletnia tradycja.’,       rec:‘Wieczorami mało ludzi.’ },
{ name:‘Opuszczona Fabryka — Wola’,  lat:52.2368, lon:20.9821, type:‘urbex’,              score:8, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Stare hale na Woli. Urbex + graffiti.’,                   rec:‘Idź z crew. Wejście od Kasprzaka.’ },
{ name:‘Aleja Solidarności — Murals’,lat:52.2485, lon:21.0123, type:‘graffiti_legal’,     score:9, zaludnienie:‘wysokie’, dostepnosc:‘latwa’,  ryzyko:‘niskie’,  opis:‘Oficjalna ściana murali miejskich.’,                      rec:‘Kontakt: Biuro Kultury Warszawy.’ },
{ name:‘FŻNSiC Ursus — Urbex Ikona’, lat:52.2012, lon:20.9012, type:‘urbex’,              score:9, zaludnienie:‘niskie’,  dostepnosc:‘trudna’, ryzyko:‘wysokie’, opis:‘Ikoniczna fabryka ciągników. Największy urbex Mazowsza.’, rec:‘Min. 3 osoby. Latarka obowiązkowa.’ },
{ name:‘Żoliborz — Pod Wiadukt’,     lat:52.2655, lon:20.9854, type:‘graffiti_tolerated’, score:7, zaludnienie:‘srednie’, dostepnosc:‘latwa’,  ryzyko:‘srednie’, opis:‘Wiadukt z historią. Znany na całej scenie.’,              rec:‘Najlepsza godzina: wt-śr wieczór.’ },
{ name:‘Centrum Kultury Praga’,      lat:52.2556, lon:21.0601, type:‘graffiti_legal’,     score:8, zaludnienie:‘srednie’, dostepnosc:‘latwa’,  ryzyko:‘niskie’,  opis:‘Legalna ściana + warsztaty graffiti.’,                    rec:‘Warsztaty co miesiąc. ckpraga.pl’ },
{ name:‘Pruszków — Stara Cegielnia’, lat:52.1701, lon:20.8034, type:‘urbex’,              score:8, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Opuszczona cegielnia. Duże mury ceglane.’,                rec:‘40 min kolejką z Warszawy.’ },
{ name:‘Piastów — Tunel Kolejowy’,   lat:52.1892, lon:20.8612, type:‘graffiti_tolerated’, score:7, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Podejście pod tory. Znane lokalnemu środowisku.’,         rec:‘Dojazd z Pruszkowa. Aktywne wieczorami.’ },
{ name:‘Grodzisk Maz — Zakład’,      lat:52.1089, lon:20.6267, type:‘urbex’,              score:7, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘niskie’,  opis:‘Opuszczony zakład produkcyjny w centrum.’,                rec:‘50 min WKD. Weekendy — mało ludzi.’ },
{ name:‘Milanówek — Stara Stacja’,   lat:52.1312, lon:20.6698, type:‘graffiti_tolerated’, score:6, zaludnienie:‘niskie’,  dostepnosc:‘latwa’,  ryzyko:‘niskie’,  opis:‘Okolice dworca WKD. Mury i podejścia.’,                  rec:‘Spokojna okolica. Dobry na start.’ },
{ name:‘Bemowo — Hale Przemysłowe’,  lat:52.2431, lon:20.9302, type:‘graffiti_tolerated’, score:7, zaludnienie:‘niskie’,  dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Stare hale na Bemowie. Spore powierzchnie.’,             rec:‘Mało znane poza lokalną sceną.’ },
{ name:‘Targówek — Undergroundy’,    lat:52.2764, lon:21.0740, type:‘graffiti_tolerated’, score:7, zaludnienie:‘srednie’, dostepnosc:‘srednia’,ryzyko:‘srednie’, opis:‘Przejścia podziemne. Klasyczna lokalizacja.’,            rec:‘Wejście od ul. Kondratowicza.’ },
{ name:‘Mokotów — Mury Kolejowe’,    lat:52.1895, lon:21.0234, type:‘graffiti_tolerated’, score:6, zaludnienie:‘srednie’, dostepnosc:‘latwa’,  ryzyko:‘srednie’, opis:‘Mury wzdłuż linii kolejowej.’,                           rec:‘Od Puławskiej do Rakowieckiej.’ },
];

const AREA = {
‘praga’:[52.252,21.048],‘wola’:[52.236,20.987],‘mokotów’:[52.198,21.023],‘mokotow’:[52.198,21.023],
‘żoliborz’:[52.268,20.985],‘zoliborz’:[52.268,20.985],‘targówek’:[52.276,21.074],‘targowek’:[52.276,21.074],
‘ursus’:[52.198,20.898],‘bemowo’:[52.243,20.929],‘śródmieście’:[52.231,21.006],‘srodmiescie’:[52.231,21.006],
‘pruszków’:[52.168,20.799],‘pruszkow’:[52.168,20.799],‘piastów’:[52.187,20.856],‘piastow’:[52.187,20.856],
‘grodzisk’:[52.108,20.621],‘milanówek’:[52.133,20.669],‘milanowek’:[52.133,20.669],
‘brwinów’:[52.112,20.709],‘brwinow’:[52.112,20.709],‘warszawa’:[52.229,21.012],‘warsaw’:[52.229,21.012],
};

function cors(res) {
res.setHeader(‘Access-Control-Allow-Origin’,’*’);
res.setHeader(‘Access-Control-Allow-Methods’,‘GET,OPTIONS’);
}

function addLinks(s) {
return { …s,
mapsUrl:`https://www.google.com/maps?q=${s.lat},${s.lon}`,
navCar:`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=driving`,
navTransit:`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=transit`,
navWalk:`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=walking`,
streetView:`https://www.google.com/maps?layer=c&cbll=${s.lat},${s.lon}`,
};
}

async function geocode(q) {
const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q+' Polska')}&format=json&limit=1`,
{ headers:{‘User-Agent’:‘WallHunt/1.0’}, signal:AbortSignal.timeout(6000) });
const d = await r.json();
if (!d.length) throw new Error(‘Nie znaleziono: ‘+q);
return { lat:+d[0].lat, lon:+d[0].lon, name:d[0].display_name.split(’,’)[0] };
}

async function fetchOSM(lat,lon) {
const q=`[out:json][timeout:16];( way["leisure"="skate_park"](around:3000,${lat},${lon}); way["building"="industrial"](around:3000,${lat},${lon}); way["abandoned"="yes"](around:3000,${lat},${lon}); way["disused"="yes"](around:3000,${lat},${lon}); way["historic"="ruins"](around:3000,${lat},${lon}); node["amenity"="arts_centre"](around:3000,${lat},${lon}); way["tunnel"="yes"]["railway"](around:2000,${lat},${lon}); node["tourism"="artwork"]["artwork_type"="mural"](around:3000,${lat},${lon}); way["landuse"="industrial"](around:3000,${lat},${lon}); );out center 18;`;
const r = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`,
{ signal:AbortSignal.timeout(14000) });
const d = await r.json();
return (d.elements||[]).slice(0,14).map(el=>{
const la=el.lat??el.center?.lat, lo=el.lon??el.center?.lon;
if(!la||!lo) return null;
const t=el.tags||{};
let type=‘graffiti_tolerated’,score=5;
if(t.leisure===‘skate_park’||t.amenity===‘arts_centre’||t.tourism===‘artwork’){type=‘graffiti_legal’;score=7;}
else if(t.abandoned===‘yes’||t.disused===‘yes’||t.historic===‘ruins’){type=‘urbex’;score=6;}
else if(t.tunnel===‘yes’){type=‘graffiti_wild’;score=5;}
else if(t.building===‘industrial’||t.landuse===‘industrial’){type=‘graffiti_tolerated’;score=6;}
return { name:t.name||t[‘name:pl’]||`OSM: ${t.building||t.leisure||t.amenity||t.historic||'obiekt'}`,
lat:la,lon:lo,type,score,zaludnienie:‘srednie’,dostepnosc:‘srednia’,ryzyko:‘srednie’,
opis:`OpenStreetMap · ${Object.entries(t).slice(0,2).map(([k,v])=>k+'='+v).join(', ')}`,
rec:‘Dane z OSM. Sprawdź osobiście.’, source:‘osm’ };
}).filter(Boolean);
}

async function fetchReddit(city) {
const spots=[];
const urls=[
`https://www.reddit.com/search.json?q=${encodeURIComponent('graffiti '+city+' ściana')}&sort=relevance&limit=12&t=all`,
`https://www.reddit.com/r/Polska/search.json?q=graffiti+spot&sort=top&limit=8&restrict_sr=on&t=year`,
];
for(const url of urls){
try{
const r=await fetch(url,{headers:{‘User-Agent’:‘WallHunt/1.0’},signal:AbortSignal.timeout(7000)});
const d=await r.json();
for(const p of (d?.data?.children||[])){
const pd=p.data;
const full=((pd.title||’’)+’ ‘+(pd.selftext||’’)).toLowerCase();
if(!full.includes(‘graffiti’)&&!full.includes(‘spot’)&&!full.includes(‘mural’)) continue;
let coords=null;
for(const[k,v] of Object.entries(AREA)){
if(full.includes(k)){coords={lat:v[0]+(Math.random()-.5)*.01,lon:v[1]+(Math.random()-.5)*.01};break;}
}
if(!coords) continue;
spots.push({ name:‘Reddit: ‘+(pd.title||’’).slice(0,50),
lat:coords.lat,lon:coords.lon,
type:full.includes(‘legal’)?‘graffiti_legal’:full.includes(‘opuszczon’)?‘urbex’:‘graffiti_tolerated’,
score:Math.min(8,4+Math.floor((pd.score||0)/30)),
zaludnienie:‘srednie’,dostepnosc:‘srednia’,ryzyko:‘srednie’,
opis:(pd.title||’’).slice(0,90),
rec:`r/${pd.subreddit} · ${pd.score||0} pkt`, source:‘reddit’,
url:pd.permalink?‘https://reddit.com’+pd.permalink:null });
if(spots.length>=5) return spots;
}
}catch(_){}
}
return spots;
}

async function fetchWiki(lat,lon) {
const r=await fetch(`https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsradius=3000&gscoord=${lat}|${lon}&gslimit=12&format=json&origin=*`,
{signal:AbortSignal.timeout(7000)});
const d=await r.json();
return (d?.query?.geosearch||[]).slice(0,6).map(i=>({
name:’Wikimedia: ‘+i.title.replace(/_/g,’ ’).slice(0,50),
lat:i.lat+(Math.random()-.5)*.002, lon:i.lon+(Math.random()-.5)*.002,
type:‘graffiti_tolerated’,score:5,zaludnienie:‘srednie’,dostepnosc:‘latwa’,ryzyko:‘niskie’,
opis:`Wikimedia: ${i.title.replace(/_/g,' ')}`,rec:‘Udokumentowane fotograficznie.’,
source:‘wiki’,wikiTitle:i.title }));
}

async function fetchPhotos(lat,lon,radius=400) {
const r=await fetch(`https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsradius=${radius}&gscoord=${lat}|${lon}&gslimit=8&format=json&origin=*`,
{signal:AbortSignal.timeout(6000)});
const d=await r.json();
const items=d?.query?.geosearch||[];
if(!items.length) return [];
const titles=items.slice(0,5).map(i=>i.title).join(’|’);
const r2=await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|thumburl|extmetadata&iiurlwidth=400&format=json&origin=*`,
{signal:AbortSignal.timeout(6000)});
const d2=await r2.json();
return Object.values(d2?.query?.pages||{}).map(p=>{
const ii=p.imageinfo?.[0]; if(!ii) return null;
const m=ii.extmetadata||{};
return { title:(p.title||’’).replace(‘File:’,’’).replace(/_/g,’ ’),
thumb:ii.thumburl||ii.url, full:ii.url,
license:m.LicenseShortName?.value||‘CC’ };
}).filter(Boolean);
}

async function aiScore(spots) {
const out=[];
for(const s of spots.slice(0,16)){
try{
const prompt=`Ekspert graffiti Warszawa. Oceń spot: Nazwa: ${s.name} Typ: ${s.type}, Opis: ${s.opis} GPS: ${s.lat?.toFixed(4)}, ${s.lon?.toFixed(4)} Odpowiedz TYLKO JSON bez markdown: {"score":5,"type":"${s.type}","zaludnienie":"srednie","dostepnosc":"srednia","ryzyko":"srednie","opis":"max 70 znaków PL","rec":"max 90 znaków PL"}`;
const r=await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`,{signal:AbortSignal.timeout(9000)});
const txt=await r.text();
const m=txt.match(/{[^{}]*}/s);
if(m){ const ai=JSON.parse(m[0]); out.push({…s,…ai,name:s.name,lat:s.lat,lon:s.lon,source:s.source,url:s.url}); continue; }
}catch(_){}
out.push(s);
}
return out;
}

function dedup(arr) {
const out=[];
for(const s of arr){
if(!s.lat||!s.lon) continue;
if(!out.some(o=>Math.abs(o.lat-s.lat)<.0005&&Math.abs(o.lon-s.lon)<.0005)) out.push(s);
}
return out;
}

export default async function handler(req,res) {
cors(res);
if(req.method===‘OPTIONS’) return res.status(200).end();

const { q, photos, lat:pLat, lon:pLon, radius=400 } = req.query;

// Photos sub-route
if(photos===‘1’&&pLat&&pLon){
try{ const p=await fetchPhotos(+pLat,+pLon,+radius); return res.status(200).json({photos:p}); }
catch(e){ return res.status(200).json({photos:[],error:e.message}); }
}

// Main spots route
const query=q||‘Warszawa’;
try{
let lat=52.2297, lon=21.0122, locName=‘Warszawa’;
try{ const g=await geocode(query); lat=g.lat; lon=g.lon; locName=g.name; }catch(_){}

```
const local=LOCAL.filter(s=>Math.sqrt((s.lat-lat)**2+(s.lon-lon)**2)<.15);

const [osmR,redditR,wikiR]=await Promise.allSettled([
  fetchOSM(lat,lon), fetchReddit(locName), fetchWiki(lat,lon)
]);

const raw=[...local,...(osmR.value||[]),...(redditR.value||[]),...(wikiR.value||[])];
const deduped=dedup(raw);
const scored=await aiScore(deduped);
const final=scored.sort((a,b)=>(b.score||5)-(a.score||5)).map(addLinks);

return res.status(200).json({ success:true,
  location:{ name:locName, lat, lon },
  count:final.length,
  sources:{ local:local.length, osm:osmR.value?.length||0, reddit:redditR.value?.length||0, wiki:wikiR.value?.length||0 },
  spots:final });
```

}catch(e){
const fallback=LOCAL.map(addLinks).sort((a,b)=>b.score-a.score);
return res.status(200).json({ success:true,fallback:true,location:{name:‘Warszawa’,lat:52.2297,lon:21.0122},
count:fallback.length, spots:fallback, error:e.message });
}
}
