import { useState, useEffect, useRef } from "react";

const SV_DATA = {
  "San Salvador": {
    "San Salvador": ["Centro de San Salvador","Mercado Central","Barrio El Centro","Barrio Candelaria","Barrio San Esteban","Barrio Santa Anita","Barrio San Miguelito","Barrio La Vega","Barrio San Jacinto","Barrio Modelo","Colonia Escalón","Colonia San Benito","Colonia Miramonte","Colonia Flor Blanca","Colonia Médica","Boulevard de los Héroes","Zona Rosa","Colonia Centroamérica","Colonia Santa Marta","Colonia Cucumacayán","Residencial Los Héroes","Colonia Utila","Colonia Layco","Colonia Libertad","Colonia El Roble","Colonia Lourdes","Colonia Costa Rica","Colonia Atlacatl","Colonia Universitaria","Colonia El Refugio","Colonia San Mateo","Colonia Alvarez","Colonia Ferrocarril","Colonia Militar","Colonia Monserrat","Colonia San Antonio Abad","Colonia Quiñónez","Colonia Santa Eduviges","Colonia Dolores","Colonia Guadalupe","Colonia Bernal","Colonia Zúñiga","Colonia Dinamarca","Colonia Bello Horizonte","Colonia Las Mercedes","Colonia Santa Alegría","Colonia Cuscatlán","Colonia El Modelo","Colonia Tres Ceibas","Cantón El Playón","Cantón Las Delicias","Cantón El Ángel","Cantón Planes de Renderos"],
    "Mejicanos": ["Centro de Mejicanos","Colonia Zacamil","Colonia Amatepec","Colonia Satélite","Colonia Santa Lucía","Colonia Independencia","Colonia Lomas de San Francisco","Colonia Miramonte Norte","Colonia Las Palmeras","Colonia El Rosal","Colonia El Paraíso","Colonia La Gloria","Colonia San Ramón","Colonia Santa Isabel","Colonia San Alfredo","Colonia San Valentín","Colonia Trinidad","Colonia Las Rosas","Colonia Lomas de Mejicanos","Colonia Nuevo Mejicanos","Colonia San Cristóbal","Colonia Quezaltepec","Barrio San Rafael","Barrio Apulo","Cantón Ayutepeque","Cantón Planes de San José"],
    "Soyapango": ["Centro de Soyapango","Colonia Miralvalle","Colonia San Jacinto","Colonia Las Brisas","Colonia Iberia","Colonia Santa Anita","Colonia Jardines de Soyapango","Colonia Las Margaritas","Colonia El Roble","Colonia San Jorge","Colonia Monte María","Colonia San Antonio","Colonia San Luis","Colonia Venecia","Colonia Minerva","Colonia Monserrat","Colonia Las Begonias","Colonia La Pradera","Colonia El Progreso","Colonia La Cañada","Urbanización Santa Lucía","Urbanización Milán","Cantón Apulo","Cantón Unicentro"],
    "Ilopango": ["Centro de Ilopango","Colonia Santa María","Colonia Las Delicias","Colonia Ciudad Delgado","Colonia El Tránsito","Colonia San Bartolo","Colonia La Gloria","Colonia San José","Colonia Las Américas","Colonia El Almendro","Colonia Monte Sinaí","Colonia San Carlos","Colonia Jardines de Ilopango","Cantón Asino","Cantón El Ángel","Cantón Dolores","Cantón San Bartolo Oriente","Finca El Paraíso","Finca San Antonio"],
    "Apopa": ["Centro de Apopa","Colonia Guadalupe","Colonia El Carmen","Colonia Ciudad Real","Colonia Las Flores","Colonia Santa Paula","Colonia El Milagro","Colonia Quezaltepec","Colonia San Marcos","Colonia El Trébol","Colonia Las Vegas","Colonia Monte Verde","Colonia El Progreso","Colonia San Rafael","Colonia Santa Rosa","Colonia Las Palmas","Cantón Nejapa","Cantón El Ángel","Cantón Ayutuxtepeque","Cantón Las Lajas","Cantón San José Villanueva","Cantón El Pajal","Cantón Las Marías","Finca El Rosario","Finca Las Mercedes"],
    "Santa Tecla": ["Centro de Santa Tecla","Colonia Buena Vista","Colonia Las Victorias","Colonia Miramonte","Colonia Santa Teresa","Colonia California","Colonia El Molino","Colonia Las Colinas","Colonia Lomas de Santa Tecla","Colonia Merliot","Colonia Las Rosas","Colonia Jardines del Volcán","Colonia Santa Marta","Colonia El Carmelo","Colonia Las Mercedes","Colonia San Ramón","Colonia Escalón Sur","Colonia Lomas Verdes","Colonia San Luis","Colonia El Recreo","Urbanización Madre Selva","Urbanización Las Cumbres","Residencial Santa Tecla","Residencial Jardines de Santa Tecla","Cantón El Progreso","Cantón Las Granadillas","Cantón Tutunichapa","Cantón Nuevo Cuscatlán","Finca El Edén","Finca La Esperanza"],
    "Antiguo Cuscatlán": ["Centro Antiguo Cuscatlán","Colonia Maquilishuat","Jardines de Guadalupe","Colonia Montserrat","Colonia San Luis","Colonia El Bálsamo","Colonia Las Magnolias","Colonia La Sultana","Colonia Jardines del Bálsamo","Colonia Lomas del Bálsamo","Colonia San Francisco","Colonia Santa Elena","Residencial Santa Elena","Urbanización Madre Selva","Urbanización Las Colinas","Urbanización Bosques de Prusia","Cantón El Bálsamo","Finca El Bálsamo","Finca Las Delicias"],
    "San Marcos": ["Centro de San Marcos","Colonia Las Margaritas","Colonia Jardines de San Marcos","Colonia Santa Marta","Colonia Las Flores","Colonia San Antonio","Colonia El Paraíso","Colonia La Cañada","Colonia Los Almendros","Colonia Las Brisas","Colonia Monte Alegre","Barrio El Centro","Cantón Los Planes","Cantón El Barillo","Cantón El Sunza","Finca El Rosario"],
    "Delgado": ["Centro de Delgado","Colonia Cinco de Noviembre","Colonia Ciudad Delgado","Colonia Las Palmeras","Colonia Quiñónez","Colonia El Modelo","Colonia La Fosa","Colonia El Rosal","Colonia San Rafael","Colonia Santa Lucía","Colonia Las Vegas","Colonia El Milagro","Barrio San Rafael","Cantón Iberia","Cantón El Ángel"],
  },
  "Santa Ana": {
    "Santa Ana": ["Centro de Santa Ana","Colonia Sinaí","Colonia Santa Bárbara","Colonia El Palmar","Colonia Las Vegas","Colonia Santa Lucia","Colonia Belén","Colonia Lourdes","Colonia San Rafael","Colonia La Esperanza","Colonia El Carmen","Colonia Santa Cruz","Colonia Las Flores","Barrio El Calvario","Barrio Santa Bárbara","Barrio San Rafael","Barrio El Centro"],
    "Chalchuapa": ["Centro de Chalchuapa","Barrio El Calvario","Barrio San Rafael","Barrio Santiago","Colonia El Carmen","Colonia Las Flores","Cantón Atiquizaya","Cantón El Sunza","Cantón Las Flores"],
  },
  "San Miguel": {
    "San Miguel": ["Centro de San Miguel","Colonia Ciudad Jardín","Colonia Chaparral","Barrio El Calvario","Colonia El Molino","Colonia Milagro de la Paz","Colonia Las Margaritas","Colonia Belén","Colonia San Francisco","Colonia Las Flores","Colonia Santa Rosa","Colonia El Carmen","Colonia La Merced","Barrio El Centro","Barrio San Francisco","Barrio La Merced","Cantón El Jícaro","Cantón Hornitos","Cantón Gualcho"],
  },
  "Sonsonate": {
    "Sonsonate": ["Centro de Sonsonate","Colonia Las Palmas","Colonia El Progreso","Colonia Las Flores","Colonia Santa Rosa","Colonia El Carmen","Barrio El Centro","Barrio El Calvario"],
    "Acajutla": ["Centro de Acajutla","Puerto de Acajutla","Barrio El Centro","Colonia Las Flores"],
  },
  "La Libertad": {
    "La Libertad": ["Puerto de La Libertad","Colonia El Delfín","Barrio El Centro","Cantón El Tunco","Cantón Playa San Diego"],
    "Santa Tecla": ["Centro Santa Tecla","Colonia Las Victorias","Colonia El Merliot","Colonia Jardines del Volcán"],
    "Antiguo Cuscatlán": ["Jardines de Guadalupe","Colonia Santa Elena","Colonia Montserrat"],
  },
  "Usulután": {
    "Usulután": ["Centro de Usulután","Colonia 15 de Septiembre","Barrio El Centro","Barrio El Calvario","Colonia Las Flores","Colonia El Carmen"],
    "Jiquilisco": ["Centro de Jiquilisco","Barrio El Centro","Cantón Puerto El Triunfo","Cantón El Jobal"],
  },
  "La Unión": {
    "La Unión": ["Centro de La Unión","Puerto Cutuco","Barrio El Centro","Barrio El Calvario","Colonia Las Flores"],
  },
  "Chalatenango": {
    "Chalatenango": ["Centro de Chalatenango","Colonia El Rosario","Barrio El Centro","Barrio El Calvario","Colonia Las Flores"],
  },
  "Ahuachapán": {
    "Ahuachapán": ["Centro de Ahuachapán","Colonia Las Flores","Barrio El Centro","Barrio El Calvario","Colonia El Carmen"],
  },
  "La Paz": {
    "Zacatecoluca": ["Centro de Zacatecoluca","Colonia El Carmen","Barrio El Centro","Barrio El Calvario","Colonia Las Flores"],
    "San Luis Talpa": ["Centro de San Luis Talpa","Cantón Las Flores","Cantón El Aeropuerto"],
  },
};

const SV_COORDS = {
  "San Salvador":[13.6929,-89.2182],"Santa Ana":[13.9942,-89.5597],"San Miguel":[13.4745,-88.1775],
  "Sonsonate":[13.7196,-89.7249],"La Libertad":[13.4903,-89.3222],"Usulután":[13.3500,-88.4333],
  "La Unión":[13.3367,-87.8437],"Chalatenango":[14.0356,-88.9335],"Cuscatlán":[13.7167,-88.9333],
  "Ahuachapán":[13.9211,-89.8450],"Cabañas":[13.8667,-88.7500],"La Paz":[13.5000,-88.9167],
  "Morazán":[13.7667,-88.1167],"San Vicente":[13.6417,-88.7847],
  "Santa Tecla":[13.6767,-89.2797],"Antiguo Cuscatlán":[13.6731,-89.2503],
  "Mejicanos":[13.7282,-89.2167],"Soyapango":[13.7100,-89.1533],
  "Ilopango":[13.7022,-89.1128],"Apopa":[13.8025,-89.1783],
  "Delgado":[13.7294,-89.1736],"San Marcos":[13.6631,-89.1803],
  "Centro de San Salvador":[13.6985,-89.1912],"Mercado Central":[13.6997,-89.1908],
  "Boulevard de los Héroes":[13.7139,-89.2092],"Zona Rosa":[13.7003,-89.2289],
  "Puerto de La Libertad":[13.4903,-89.3222],"Centro de Santa Ana":[13.9942,-89.5597],
  "Centro de San Miguel":[13.4745,-88.1775],"Centro de Sonsonate":[13.7196,-89.7249],
  "Puerto Cutuco":[13.3320,-87.8400],"Colonia Escalón":[13.7094,-89.2378],
  "Centro de Santa Tecla":[13.6767,-89.2797],"Bodega central":[13.6985,-89.1912],
  "Centro de Mejicanos":[13.7282,-89.2167],"Centro de Delgado":[13.7294,-89.1736],
};

function resolveCoords(name) {
  if (!name) return null;
  if (SV_COORDS[name]) return SV_COORDS[name];
  const lower = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(SV_COORDS)) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) return v;
  }
  for (const [dep, municipios] of Object.entries(SV_DATA)) {
    for (const [mun, colonias] of Object.entries(municipios)) {
      if (colonias.includes(name)) {
        if (SV_COORDS[mun]) return SV_COORDS[mun];
        if (SV_COORDS[dep]) return SV_COORDS[dep];
      }
    }
  }
  for (const [dep, municipios] of Object.entries(SV_DATA)) {
    if (Object.keys(municipios).includes(name)) {
      if (SV_COORDS[name]) return SV_COORDS[name];
      if (SV_COORDS[dep]) return SV_COORDS[dep];
    }
  }
  return null;
}

const C = {
  honey:"#F0A500", honeyDark:"#C47F00", honeyLight:"#FFF8E7", honeyBg:"#FEF3D0",
  blue:"#2563EB", blueDark:"#1D4ED8", blueLight:"#EFF6FF",
  green:"#16A34A", greenLight:"#F0FDF4",
  gray:"#6B7280", grayLight:"#F9FAFB", border:"#E5E7EB",
  text:"#111827", textSoft:"#374151",
  red:"#DC2626", redLight:"#FEF2F2", white:"#FFFFFF",
  sidebarBg:"#FFFFFF", sidebarText:"#412402", sidebarMuted:"#855010",
  sidebarActive:"#633806", sidebarActiveBg:"rgba(196,127,0,0.10)", sidebarBorder:"#F5E6B4",
};

const STEP_COLORS = {
  CREADO:"#9CA3AF", EN_ALMACEN:"#F0A500", EN_RUTA:"#2563EB", ENTREGADO:"#16A34A",
};
const ESTADO_COLORS = {
  CREADO:"#9CA3AF", EN_ALMACEN:C.honey, EN_RUTA:C.blue, ENTREGADO:C.green, FALLIDO:C.red,
};
const ESTADO_NEXT = {
  CREADO:"EN_ALMACEN", EN_ALMACEN:"EN_RUTA", EN_RUTA:"ENTREGADO", ENTREGADO:null, FALLIDO:null,
};
const DRIVER_ACTIVO = ["EN_ALMACEN","EN_RUTA"];
const DRIVERS = Array.from({length:10},(_,i)=>`Tigger-${String(i+1).padStart(2,"0")}`);
const ROUTE_COLORS = ["#E24B4A","#1D9E75","#7F77DD","#EF9F27","#D4537E","#378ADD","#639922","#D85A30","#885EA6","#0F6E56"];

const ENVIOS_INIT = [
  { id:"HAW001", cliente:"Piglet",  telefono:"7755-1001", producto:"Tarro de miel × 3",  origen:"Bodega central", destino:"San Miguel",   estado:"EN_RUTA",    driver:"Tigger-03", hora:{ CREADO:"08:15", EN_ALMACEN:"09:00", EN_RUTA:"10:30" } },
  { id:"HAW002", cliente:"Owl",     telefono:"7755-1002", producto:"Zanahorias × 10",    origen:"Santa Ana",      destino:"San Salvador", estado:"EN_ALMACEN", driver:"",          hora:{ CREADO:"09:00", EN_ALMACEN:"09:45" } },
  { id:"HAW003", cliente:"Eeyore",  telefono:"7755-1003", producto:"Globo azul × 1",     origen:"Bodega central", destino:"Sonsonate",    estado:"CREADO",     driver:"",          hora:{ CREADO:"10:00" } },
  { id:"HAW004", cliente:"Kanga",   telefono:"7755-1004", producto:"Miel de trébol × 5", origen:"Bodega central", destino:"La Libertad",  estado:"ENTREGADO",  driver:"Tigger-07", hora:{ CREADO:"07:00", EN_ALMACEN:"07:30", EN_RUTA:"08:00", ENTREGADO:"09:15" } },
];

const SESSION_KEY = "haw_session";
const ENVIOS_KEY  = "haw_envios";
const SECTION_KEY = "haw_section";

function saveSession(role, userName) { try { localStorage.setItem(SESSION_KEY, JSON.stringify({ role, userName })); } catch(_) {} }
function loadSession() { try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch(_) { return null; } }
function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch(_) {} }
function saveEnvios(envios) { try { localStorage.setItem(ENVIOS_KEY, JSON.stringify(envios)); } catch(_) {} }
function loadEnvios() { try { const s = localStorage.getItem(ENVIOS_KEY); return s ? JSON.parse(s) : null; } catch(_) { return null; } }
function saveSection(s) { try { localStorage.setItem(SECTION_KEY, s); } catch(_) {} }
function loadSection() { try { return localStorage.getItem(SECTION_KEY) || "paquetes"; } catch(_) { return "paquetes"; } }

function useLeaflet() {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function MapaSV({ envios }) {
  const leafletReady = useLeaflet();
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const enRuta = envios.filter(e => e.estado === "EN_RUTA");
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;
    const L = window.L;
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    const map = L.map(mapRef.current, { center:[13.794,-88.896], zoom:7, zoomControl:true, scrollWheelZoom:false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:"© OpenStreetMap", maxZoom:18 }).addTo(map);
    const greenIcon = L.divIcon({ html:'<div style="background:#16A34A;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">A</div>', className:"", iconSize:[22,22], iconAnchor:[11,11] });
    const blueIcon  = L.divIcon({ html:'<div style="background:#2563EB;color:#fff;border-radius:4px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">B</div>', className:"", iconSize:[22,22], iconAnchor:[11,11] });
    enRuta.forEach((e, i) => {
      const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
      const cA = resolveCoords(e.origen); const cB = resolveCoords(e.destino);
      if (!cA || !cB) return;
      L.polyline([cA, cB], { color, weight:3, dashArray:"8 4", opacity:0.85 }).addTo(map).bindPopup(`<b>${e.id}</b><br>${e.origen} → ${e.destino}<br>🐯 ${e.driver}`);
      L.marker(cA, { icon:greenIcon }).addTo(map).bindPopup(`Origen: ${e.origen}`);
      L.marker(cB, { icon:blueIcon  }).addTo(map).bindPopup(`Destino: ${e.destino} · ${e.id}`);
    });
    instanceRef.current = map;
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [leafletReady, JSON.stringify(enRuta.map(e=>e.id))]);
  return (
    <div style={{ width:"100%", height:"100%", position:"relative" }}>
      {!leafletReady && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4f8", color:C.gray, fontSize:13 }}>Cargando mapa…</div>}
      <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>
      {leafletReady && enRuta.length===0 && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:C.gray, fontSize:12, fontStyle:"italic", pointerEvents:"none", zIndex:10 }}>No hay envíos EN RUTA ahora mismo</div>}
    </div>
  );
}

function MapaAB({ origen, destino }) {
  const leafletReady = useLeaflet();
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const coordA = resolveCoords(origen);
  const coordB = resolveCoords(destino);
  useEffect(() => {
    if (!leafletReady || !mapRef.current || !coordA || !coordB) return;
    const L = window.L;
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    const map = L.map(mapRef.current, { center:[(coordA[0]+coordB[0])/2,(coordA[1]+coordB[1])/2], zoom:8, zoomControl:true, scrollWheelZoom:false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:"© OpenStreetMap", maxZoom:18 }).addTo(map);
    L.polyline([coordA, coordB], { color:C.honey, weight:4, dashArray:"10 5", opacity:0.9 }).addTo(map);
    const mkA = L.divIcon({ html:`<div style="background:#16A34A;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)">A</div>`, className:"", iconSize:[28,28], iconAnchor:[14,14] });
    const mkB = L.divIcon({ html:`<div style="background:#2563EB;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)">B</div>`, className:"", iconSize:[28,28], iconAnchor:[14,14] });
    L.marker(coordA, { icon:mkA }).addTo(map).bindPopup(`<b>Origen</b><br>${origen}`).openPopup();
    L.marker(coordB, { icon:mkB }).addTo(map).bindPopup(`<b>Destino</b><br>${destino}`);
    map.fitBounds(L.latLngBounds([coordA, coordB]), { padding:[30,30] });
    instanceRef.current = map;
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [leafletReady, origen, destino]);
  if (!coordA || !coordB) return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#FEF2F2", color:C.red, fontSize:13, gap:8, padding:16, textAlign:"center" }}>
      <span style={{fontSize:22}}>⚠️</span>
      <span>No se pudo ubicar: <b>{!coordA ? origen : destino}</b></span>
    </div>
  );
  return (
    <div style={{ width:"100%", height:"100%", position:"relative" }}>
      {!leafletReady && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4f8", color:C.gray, fontSize:13, zIndex:1 }}>Cargando mapa…</div>}
      <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>
    </div>
  );
}

function HoneyBearAnim() {
  return (
    <div style={{ position:"relative", height:70, display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:4 }}>
      <style>{`@keyframes haBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-12px)}60%{transform:translateY(-6px)}}@keyframes haPeek{0%,60%{transform:translateY(30px);opacity:0}75%,100%{transform:translateY(0);opacity:1}}`}</style>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", zIndex:2, overflow:"hidden", height:36, width:40 }}>
        <div style={{ fontSize:26, lineHeight:1, animation:"haPeek 3s ease-in-out infinite" }}>🐻</div>
      </div>
      <div style={{ fontSize:50, animation:"haBounce 3s ease-in-out infinite", zIndex:1, lineHeight:1 }}>🍯</div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const label = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado", FALLIDO:"Fallido ❌" };
  const col = ESTADO_COLORS[estado] || "#888";
  return (
    <span style={{ background:col+"22", color:col, border:`1px solid ${col}44`, borderRadius:99, padding:"2px 10px", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      {label[estado]}
    </span>
  );
}

function Stepper({ estado }) {
  const steps  = ["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"];
  const labels = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado" };
  const cur    = steps.indexOf(estado);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", margin:"12px 0" }}>
      {steps.map((st, i) => {
        const done   = i <= cur;
        const isLast = i === steps.length - 1;
        const col    = STEP_COLORS[st];
        const leftLineDone  = i > 0 && done;
        const leftLineColor = i > 0 ? STEP_COLORS[steps[i-1]] : "transparent";
        const rightLineDone = !isLast && i < cur;
        return (
          <div key={st} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
              <div style={{ flex: i === 0 ? "0 0 50%" : 1, height: 3, background: i > 0 && leftLineDone ? leftLineColor : i > 0 ? "#E5E7EB" : "transparent" }}/>
              <div style={{ width:14, height:14, borderRadius:"50%", background: done ? col : "#E5E7EB", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border: done ? `2px solid ${col}` : "2px solid #E5E7EB", boxSizing:"border-box" }}>
                {done && (<svg width="7" height="7" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>)}
              </div>
              <div style={{ flex: isLast ? "0 0 50%" : 1, height: 3, background: !isLast && rightLineDone ? col : !isLast ? "#E5E7EB" : "transparent" }}/>
            </div>
            <div style={{ fontSize:9, marginTop:4, color:done ? col : "#9CA3AF", fontWeight:600, textAlign:"center" }}>{labels[st]}</div>
          </div>
        );
      })}
    </div>
  );
}

const selStyle = (disabled) => ({
  width:"100%", padding:"8px 28px 8px 10px", borderRadius:8, border:`1px solid ${C.border}`,
  background:disabled?C.grayLight:C.white, color:disabled?"#9CA3AF":C.text,
  fontSize:13, cursor:disabled?"not-allowed":"pointer", appearance:"none", outline:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", opacity:disabled?0.5:1,
});

function UbicacionSelector({ label, accentColor, value, onChange }) {
  const { departamento, municipio, colonia } = value;
  const departamentos = Object.keys(SV_DATA);
  const municipios    = departamento ? Object.keys(SV_DATA[departamento] || {}) : [];
  const colonias      = departamento && municipio ? (SV_DATA[departamento]?.[municipio] || []) : [];
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:accentColor }}/>
        <span style={{ fontSize:12, fontWeight:600, color:C.gray }}>{label}</span>
        {departamento && (
          <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, background:accentColor+"22", color:accentColor, border:`1px solid ${accentColor}44`, borderRadius:99, padding:"1px 8px" }}>
            {colonia||municipio||departamento}
          </span>
        )}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[
          ["Departamento", departamento, null, departamentos, (e)=>onChange({departamento:e.target.value,municipio:"",colonia:""})],
          ["Municipio",    municipio,    !departamento, municipios,    (e)=>onChange({departamento,municipio:e.target.value,colonia:""})],
          ["Colonia/zona", colonia,      !municipio,    colonias,      (e)=>onChange({departamento,municipio,colonia:e.target.value})],
        ].map(([lbl, val, dis, opts, handler])=>(
          <div key={lbl}>
            <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>{lbl}</label>
            <select value={val} onChange={handler} disabled={dis} style={selStyle(dis)}>
              <option value="">Seleccionar…</option>
              {opts.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err,   setErr]   = useState("");
  const USERS = {
    "rabbit@hundredacre.com": { pass:"honey123", role:"admin",  name:"Rabbit jefe de bodega" },
    "tigger@hundredacre.com": { pass:"honey123", role:"driver", name:"Tigger" },
  };
  const login = () => {
    const u = USERS[email.toLowerCase().trim()];
    if (!u)            return setErr("Email no encontrado.");
    if (u.pass!==pass) return setErr("Contraseña incorrecta.");
    setErr(""); onLogin(u.role, u.name);
  };
  return (
    <div style={{ minHeight:"100vh", background:"#FFF5E6", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Helvetica Neue',Arial,sans-serif", padding:"16px" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"32px 28px", width:"100%", maxWidth:340, boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <HoneyBearAnim/>
          <p style={{ margin:"10px 0 3px", fontSize:19, color:"#412402", fontWeight:300 }}>Hundred Acre Logistics</p>
          <p style={{ color:"#aaa", fontSize:12, margin:0 }}>Ingresa al sistema del bosque</p>
        </div>
        {[["Email","text",email,setEmail,"rabbit@hundredacre.com"],["Contraseña","password",pass,setPass,"••••••••"]].map(([lbl,type,val,setter,ph])=>(
          <div key={lbl}>
            <label style={{ fontSize:11, color:"#aaa", display:"block", marginBottom:5 }}>{lbl}</label>
            <input type={type} value={val} onChange={e=>setter(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()} placeholder={ph}
              style={{ width:"100%", padding:"10px 12px", border:"1px solid #e8e8e8", borderRadius:8, fontSize:13, marginBottom:14, boxSizing:"border-box", outline:"none", background:"#f9fbff", color:"#333" }}/>
          </div>
        ))}
        {err && <div style={{ background:"#FEF2F2", color:"#DC2626", borderRadius:8, padding:"8px 12px", fontSize:12, marginBottom:12 }}>{err}</div>}
        <button onClick={login} style={{ width:"100%", padding:"12px", background:"#EF9F27", color:"#fff", border:"none", borderRadius:8, fontWeight:600, fontSize:14, cursor:"pointer" }}>
          Entrar al bosque 🌳
        </button>
        <div style={{ marginTop:16, padding:"12px", background:"#FAEEDA", borderRadius:8, fontSize:11, color:"#633806", lineHeight:2, textAlign:"center" }}>
          <span style={{fontWeight:600}}>Demo:</span><br/>
          🐰 rabbit@hundredacre.com / honey123<br/>
          🐯 tigger@hundredacre.com / honey123
        </div>
        <p style={{ textAlign:"center", marginTop:14, fontSize:11, color:"#aaa" }}>
          ¿Eres cliente?{" "}
          <span style={{ color:"#EF9F27", cursor:"pointer" }} onClick={()=>onLogin("piglet","")}>
            Rastreá tu paquete →
          </span>
        </p>
      </div>
    </div>
  );
}

function PigletView({ envios, onLogout }) {
  const [code,   setCode]   = useState("");
  const [result, setResult] = useState(null);
  const buscar = () => {
    const found = envios.find(e => e.id === code.toUpperCase().trim());
    if (!found)                    return setResult("notfound");
    if (found.estado === "CREADO") return setResult("invisible");
    setResult(found);
  };
  const HIST_LABELS = {
    CREADO:    { icon:"📦", label:"Paquete creado",   who:()=>"Bodega central" },
    EN_ALMACEN:{ icon:"🏭", label:"En almacén",        who:()=>"Rabbit lo recibió 🐰" },
    EN_RUTA:   { icon:"🐯", label:"En ruta — ahora",  who:e=>`Tigger está en camino\nConductor: ${e.driver?.slice(0,-3)}*** (asignado)` },
    ENTREGADO: { icon:"✅", label:"Entregado",         who:()=>"Entrega completada" },
  };
  const STEPS  = ["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"];
  const curIdx = result && result!=="notfound" && result!=="invisible" ? STEPS.indexOf(result.estado) : -1;
  return (
    <div style={{ minHeight:"100vh", background:C.sidebarBg }}>
      <div style={{ background:"#FFF5E6", padding:"20px 24px 18px", position:"relative", borderBottom:`1px solid #F5E6B4` }}>
        <div style={{ textAlign:"center" }}>
          <HoneyBearAnim/>
          <h1 style={{ color:"#412402", fontSize:22, fontWeight:700, margin:"8px 0 4px" }}>¿Dónde está mi paquete?</h1>
          <p style={{ color:"#855010", fontSize:13, margin:0 }}>Hundred Acre Wood Logistics · El Salvador</p>
        </div>
        <button onClick={onLogout} style={{ position:"absolute", top:16, right:20, background:"rgba(196,127,0,0.12)", color:"#633806", border:"1px solid rgba(196,127,0,0.35)", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>← Salir</button>
      </div>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"28px 16px" }}>
        <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.gray, marginBottom:8 }}>Número de guía</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&buscar()}
              placeholder="Ej: HAW001"
              style={{ flex:1, padding:"10px 12px", borderRadius:10, border:`1px solid ${C.border}`, fontSize:14, outline:"none" }}/>
            <button onClick={buscar} style={{ background:C.honey, color:C.white, border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Rastrear ↗</button>
          </div>
        </div>
        {result==="notfound" && <div style={{ background:C.redLight, color:C.red, borderRadius:10, padding:"12px 16px", fontSize:13 }}>No se encontró el envío. Verificá el código.</div>}
        {result==="invisible" && <div style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:10, padding:"12px 16px", fontSize:13 }}>⏳ Tu paquete aún no ingresó a bodega. En breve podrás rastrearlo.</div>}
        {result && result!=="notfound" && result!=="invisible" && (
          <>
            <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4, flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ fontSize:17, fontWeight:700 }}>🍯 {result.producto}</div>
                  <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>Guía: #{result.id}</div>
                </div>
                <EstadoBadge estado={result.estado}/>
              </div>
              <Stepper estado={result.estado}/>
              {result.estado==="EN_RUTA" && result.telefono && (
                <a href={`tel:${result.telefono}`} style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, background:C.greenLight, color:C.green, border:`1px solid ${C.green}33`, borderRadius:10, padding:"10px 14px", textDecoration:"none", fontWeight:600, fontSize:13 }}>
                  📞 Contactar al conductor — {result.telefono}
                </a>
              )}
            </div>
            <div style={{ background:C.white, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ padding:"14px 18px 10px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>📍 Ruta de tu paquete</div>
                <div style={{ display:"flex", gap:10, fontSize:12, flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ background:"#16A34A", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:10 }}>A</span>
                    {result.origen}
                  </span>
                  <span style={{ color:C.honey, fontWeight:700, fontSize:16 }}>——→</span>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ background:"#2563EB", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:10 }}>B</span>
                    {result.destino}
                  </span>
                </div>
              </div>
              <div style={{ height:260 }}><MapaAB origen={result.origen} destino={result.destino}/></div>
            </div>
            <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Historial del paquete</div>
              {STEPS.map((st, i) => {
                const done = i<=curIdx; const h = HIST_LABELS[st]; const hora = result.hora?.[st]; const isCur = i===curIdx;
                const stepCol = STEP_COLORS[st];
                return (
                  <div key={st} style={{ display:"flex", gap:12, marginBottom:16, opacity:done?1:0.35 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:done?stepCol+"22":C.grayLight, border:`2px solid ${done?stepCol:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                        {done ? (isCur ? <span style={{fontSize:15}}>{h.icon}</span> : <span style={{color:stepCol,fontSize:14}}>✓</span>) : <span style={{color:"#D1D5DB",fontSize:12}}>○</span>}
                      </div>
                      {i < STEPS.length-1 && <div style={{ width:2, flex:1, minHeight:14, background:done&&i<curIdx?C.green:C.border, marginTop:2 }}/>}
                    </div>
                    <div style={{ paddingBottom:8 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:isCur?stepCol:C.text }}>{h.label}</div>
                      {hora && <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>Hoy {hora} · {h.who(result).split("\n")[0]}</div>}
                      {isCur && h.who(result).split("\n")[1] && <div style={{ fontSize:12, color:stepCol, marginTop:1 }}>{h.who(result).split("\n")[1]}</div>}
                      {!hora && !done && <div style={{ fontSize:12, color:"#9CA3AF" }}>Pendiente…</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <p style={{ textAlign:"center", fontSize:11, color:"#9CA3AF", marginTop:20 }}>Demo: HAW001 · HAW002 · HAW003 · HAW004</p>
      </div>
    </div>
  );
}

function AdminView({ envios, setEnvios, userName, onLogout }) {
  const [section,     setSection]     = useState(loadSection);
  const [driverSel,   setDriverSel]   = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form,        setForm]        = useState({ cliente:"", telefono:"", producto:"" });
  const [origenLoc,   setOrigenLoc]   = useState({ departamento:"", municipio:"", colonia:"" });
  const [destinoLoc,  setDestinoLoc]  = useState({ departamento:"", municipio:"", colonia:"" });
  const [formErr,     setFormErr]     = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const crearPaquete = () => {
    const origenStr  = origenLoc.colonia  || origenLoc.municipio  || origenLoc.departamento;
    const destinoStr = destinoLoc.colonia || destinoLoc.municipio || destinoLoc.departamento;
    if (!form.cliente.trim() || !form.producto.trim() || !origenStr || !destinoStr)
      return setFormErr("Completá todos los campos, incluyendo origen y destino.");
    const num   = String(envios.length+1).padStart(3,"0");
    const nuevo = {
      id:`HAW${num}`, cliente:form.cliente, telefono:form.telefono,
      producto:form.producto, origen:origenStr, destino:destinoStr,
      estado:"CREADO", driver:"",
      hora:{ CREADO:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) }
    };
    setEnvios(p=>[...p,nuevo]);
    setForm({cliente:"",telefono:"",producto:""});
    setOrigenLoc({departamento:"",municipio:"",colonia:""});
    setDestinoLoc({departamento:"",municipio:"",colonia:""});
    setFormErr(""); setMostrarForm(false);
  };

  const recibirBodega = id => setEnvios(p=>p.map(e=>
    e.id===id&&e.estado==="CREADO"
      ? {...e,estado:"EN_ALMACEN",hora:{...e.hora,EN_ALMACEN:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));

  const despachar = id => {
    const dr = driverSel[id];
    if (!dr) return alert("Seleccioná un driver primero.");
    setEnvios(p=>p.map(e=>
      e.id===id&&e.estado==="EN_ALMACEN"
        ? {...e,estado:"EN_RUTA",driver:dr,hora:{...e.hora,EN_RUTA:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
        : e
    ));
  };

  const stats = [
    {label:"Total hoy",  val:envios.length,                                  sub:"paquetes",      col:C.text },
    {label:"En ruta",    val:envios.filter(e=>e.estado==="EN_RUTA").length,   sub:"con Tigger 🐯", col:C.blue },
    {label:"Entregados", val:envios.filter(e=>e.estado==="ENTREGADO").length, sub:"hoy",           col:C.green},
    {label:"Fallidos",   val:0,                                               sub:"revisar",       col:C.red  },
  ];
  const estadoStats = [
    {label:"Creado",     val:envios.filter(e=>e.estado==="CREADO").length,     col:C.gray },
    {label:"En almacén", val:envios.filter(e=>e.estado==="EN_ALMACEN").length, col:C.honey},
    {label:"En ruta",    val:envios.filter(e=>e.estado==="EN_RUTA").length,    col:C.blue },
    {label:"Entregado",  val:envios.filter(e=>e.estado==="ENTREGADO").length,  col:C.green},
  ];

  const MENU = [
    {id:"paquetes",    icon:"📦", label:"Paquetes"      },
    {id:"conductores", icon:"🐯", label:"Conductores"   },
    {id:"historial",   icon:"📋", label:"Historial"     },
    {id:"config",      icon:"⚙️",  label:"Configuración" },
  ];

  const activeEnvios   = envios.filter(e=>e.estado!=="ENTREGADO");
  const tiggersActivos = DRIVERS.filter(d=>envios.some(e=>e.driver===d&&e.estado==="EN_RUTA")).length;
  const enRutaCount    = envios.filter(e=>e.estado==="EN_RUTA").length;

  const navTo = (id) => { setSection(id); saveSection(id); setSidebarOpen(false); };

  const SidebarContent = () => (
    <>
      <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${C.sidebarBorder}` }}>
        <HoneyBearAnim/>
        <div style={{ fontSize:13, fontWeight:700, color:C.sidebarText, marginTop:4 }}>Hundred Acre Wood</div>
        <div style={{ fontSize:11, color:C.sidebarMuted, marginTop:2 }}>Panel de despacho</div>
      </div>
      <div style={{ padding:"10px 0", flex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.sidebarMuted, letterSpacing:1.2, padding:"8px 18px 4px", textTransform:"uppercase" }}>MENÚ</div>
        {MENU.map(m => {
          const active = section===m.id;
          return (
            <button key={m.id} onClick={()=>navTo(m.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 18px", border:"none", background:active?C.sidebarActiveBg:"transparent", color:active?C.sidebarActive:C.sidebarText, fontWeight:active?700:400, fontSize:13.5, cursor:"pointer", borderLeft:active?`3px solid ${C.sidebarActive}`:"3px solid transparent", textAlign:"left" }}>
              <span>{m.icon}</span>{m.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.sidebarBorder}`, fontSize:11 }}>
        <div style={{ color:C.green, fontWeight:600 }}>● Tigger disponible</div>
        <div style={{ color:C.sidebarMuted, marginTop:2 }}>{tiggersActivos} envíos en ruta</div>
      </div>
    </>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {!isMobile && (
        <aside style={{ width:220, background:C.sidebarBg, borderRight:`1px solid ${C.sidebarBorder}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <SidebarContent/>
        </aside>
      )}
      {isMobile && sidebarOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)" }} onClick={()=>setSidebarOpen(false)}/>
          <aside style={{ position:"relative", width:260, background:C.sidebarBg, display:"flex", flexDirection:"column", boxShadow:"4px 0 20px rgba(0,0,0,0.15)", zIndex:101 }}>
            {/* ✅ FIX: botón X con área táctil grande para móvil */}
            <button
              onClick={()=>setSidebarOpen(false)}
              style={{
                position:"absolute", top:8, right:8, zIndex:110,
                background:"rgba(0,0,0,0.08)", border:"none",
                borderRadius:8, width:40, height:40,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, cursor:"pointer", color:C.gray,
                touchAction:"manipulation", WebkitTapHighlightColor:"transparent",
              }}
            >✕</button>
            <SidebarContent/>
          </aside>
        </div>
      )}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isMobile && (
              <button onClick={()=>setSidebarOpen(true)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 10px", fontSize:18, cursor:"pointer", lineHeight:1 }}>☰</button>
            )}
            <span style={{ fontSize:13, color:C.gray, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {isMobile ? MENU.find(m=>m.id===section)?.label : "Panel de despacho — Owl Admin"}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {!isMobile && <span style={{ fontSize:13, color:C.textSoft }}>🐰 {userName}</span>}
            <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", color:C.gray, whiteSpace:"nowrap" }}>
              {isMobile ? "Salir" : "Cerrar sesión"}
            </button>
          </div>
        </div>
        <div style={{ flex:1, overflow:"auto", padding:isMobile?"12px":"20px 24px" }}>
          {section==="paquetes" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:12 }}>
                {stats.map(st=>(
                  <div key={st.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
                    <div style={{ fontSize:11, color:C.gray }}>{st.label}</div>
                    <div style={{ fontSize:26, fontWeight:700, color:st.col, lineHeight:1.2 }}>{st.val}</div>
                    <div style={{ fontSize:11, color:C.gray }}>{st.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:8, marginBottom:16 }}>
                {estadoStats.map(st=>(
                  <div key={st.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:st.col, flexShrink:0 }}/>
                    <div>
                      <div style={{ fontSize:18, fontWeight:700, color:st.col }}>{st.val}</div>
                      <div style={{ fontSize:11, color:C.gray }}>{st.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 360px", gap:16 }}>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, gap:8 }}>
                    <div style={{ fontWeight:600, fontSize:15 }}>Paquetes activos</div>
                    <button onClick={()=>setMostrarForm(v=>!v)} style={{ background:"transparent", color:C.honeyDark, border:`1.5px solid ${C.honeyDark}`, borderRadius:8, padding:"7px 12px", fontWeight:600, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                      {mostrarForm?"✕ Cancelar":"＋ Nuevo envío"}
                    </button>
                  </div>
                  {mostrarForm && (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:14, marginBottom:14, borderLeft:`4px solid ${C.honey}` }}>
                      <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>📦 Registrar nuevo paquete</div>
                      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:10, marginBottom:14 }}>
                        {[["cliente","Cliente / destinatario","Ej: Piglet"],["telefono","Teléfono","Ej: 7755-1234"],["producto","Producto","Ej: Tarro de miel × 3"]].map(([k,l,ph])=>(
                          <div key={k}>
                            <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>{l}</label>
                            <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}
                              style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, boxSizing:"border-box", outline:"none" }}/>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom:12 }}>
                        <UbicacionSelector label="Origen" accentColor={C.green} value={origenLoc} onChange={setOrigenLoc}/>
                      </div>
                      <div style={{ borderTop:`1px solid ${C.border}`, margin:"12px 0" }}/>
                      <div style={{ marginBottom:14 }}>
                        <UbicacionSelector label="Destino" accentColor={C.blue} value={destinoLoc} onChange={setDestinoLoc}/>
                      </div>
                      {formErr && <div style={{ background:C.redLight, color:C.red, borderRadius:6, padding:"6px 10px", fontSize:12, marginBottom:8 }}>{formErr}</div>}
                      <button onClick={crearPaquete} style={{ background:C.honey, color:C.white, border:"none", borderRadius:8, padding:"8px 18px", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                        ✓ Crear paquete
                      </button>
                    </div>
                  )}
                  {activeEnvios.length===0 ? (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:32, textAlign:"center", color:C.gray, fontSize:13 }}>No hay paquetes activos.</div>
                  ) : isMobile ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {activeEnvios.map(e=>(
                        <div key={e.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderLeft:`4px solid ${ESTADO_COLORS[e.estado]}`, borderRadius:12, padding:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                            <div>
                              <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{e.id}</div>
                              <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{e.cliente}</div>
                              <div style={{ fontSize:12, color:C.gray }}>{e.producto}</div>
                            </div>
                            <EstadoBadge estado={e.estado}/>
                          </div>
                          <div style={{ fontSize:12, color:C.gray, marginBottom:8 }}>📍 {e.origen} → {e.destino}</div>
                          {e.telefono && <a href={`tel:${e.telefono}`} style={{ fontSize:12, color:C.green, fontWeight:600, display:"block", marginBottom:8 }}>📞 {e.telefono}</a>}
                          {e.driver && <div style={{ fontSize:12, color:C.text, marginBottom:8 }}>🐯 {e.driver}</div>}
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                            {e.estado==="CREADO" && (
                              <button onClick={()=>recibirBodega(e.id)} style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:7, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>📦 Recibir</button>
                            )}
                            {e.estado==="EN_ALMACEN" && (
                              <>
                                <select value={driverSel[e.id]||""} onChange={ev=>setDriverSel(p=>({...p,[e.id]:ev.target.value}))}
                                  style={{ padding:"6px 8px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:12, outline:"none", flex:1, minWidth:0 }}>
                                  <option value="">Driver…</option>
                                  {DRIVERS.map(d=><option key={d} value={d}>{d}</option>)}
                                </select>
                                <button onClick={()=>despachar(e.id)} style={{ background:C.blueLight, color:C.blue, border:`1px solid ${C.blue}44`, borderRadius:7, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>🚗 Despachar</button>
                              </>
                            )}
                            {e.estado==="EN_RUTA" && <span style={{ color:"#9CA3AF", fontSize:12, alignSelf:"center" }}>En camino…</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                      <div style={{ overflowX:"auto" }}>
                        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                          <thead>
                            <tr style={{ background:C.grayLight, color:C.gray, fontSize:11, fontWeight:600 }}>
                              {["ID","Cliente","Teléfono","Estado","Driver","Acción"].map(h=>(
                                <th key={h} style={{ padding:"9px 12px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {activeEnvios.map(e=>(
                              <tr key={e.id} style={{ borderTop:`1px solid ${C.border}` }}>
                                <td style={{ padding:"11px 12px", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{e.id}</td>
                                <td style={{ padding:"11px 12px", fontSize:12 }}>{e.cliente}</td>
                                <td style={{ padding:"11px 12px", fontSize:12 }}>
                                  {e.telefono ? <a href={`tel:${e.telefono}`} style={{ color:C.green, textDecoration:"none", fontWeight:600 }}>📞 {e.telefono}</a> : <span style={{color:"#9CA3AF"}}>—</span>}
                                </td>
                                <td style={{ padding:"11px 12px" }}><EstadoBadge estado={e.estado}/></td>
                                <td style={{ padding:"11px 12px", fontSize:12, color:e.driver?C.text:"#9CA3AF" }}>{e.driver||"—"}</td>
                                <td style={{ padding:"11px 12px" }}>
                                  {e.estado==="CREADO" && (
                                    <button onClick={()=>recibirBodega(e.id)} style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer" }}>📦 Recibir</button>
                                  )}
                                  {e.estado==="EN_ALMACEN" && (
                                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                      <select value={driverSel[e.id]||""} onChange={ev=>setDriverSel(p=>({...p,[e.id]:ev.target.value}))}
                                        style={{ padding:"5px 8px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:12, outline:"none" }}>
                                        <option value="">Driver…</option>
                                        {DRIVERS.map(d=><option key={d} value={d}>{d}</option>)}
                                      </select>
                                      <button onClick={()=>despachar(e.id)} style={{ background:C.blueLight, color:C.blue, border:`1px solid ${C.blue}44`, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer" }}>🚗 Despachar</button>
                                    </div>
                                  )}
                                  {e.estado==="EN_RUTA" && <span style={{ color:"#9CA3AF", fontSize:12 }}>En camino…</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>Mapa del bosque 🇸🇻</div>
                  {enRutaCount>0 && (
                    <div style={{ marginBottom:8, display:"flex", flexWrap:"wrap", gap:6 }}>
                      {envios.filter(e=>e.estado==="EN_RUTA").map((e,i)=>(
                        <span key={e.id} style={{ display:"inline-flex", alignItems:"center", gap:5, background:ROUTE_COLORS[i%ROUTE_COLORS.length]+"18", border:`1px solid ${ROUTE_COLORS[i%ROUTE_COLORS.length]}44`, borderRadius:99, padding:"2px 9px", fontSize:11, fontWeight:600, color:ROUTE_COLORS[i%ROUTE_COLORS.length] }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:ROUTE_COLORS[i%ROUTE_COLORS.length], display:"inline-block" }}/>
                          {e.id}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", height:isMobile?280:340 }}>
                    <MapaSV envios={envios}/>
                  </div>
                  <div style={{ marginTop:6, fontSize:11, color:C.gray }}>● A = origen &nbsp;■ B = destino</div>
                </div>
              </div>
            </>
          )}
          {section==="conductores" && (
            <div>
              <div style={{ fontWeight:600, fontSize:18, marginBottom:16 }}>🐯 Conductores</div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
                {DRIVERS.map(d=>{
                  const asignado = envios.find(e=>e.driver===d&&e.estado==="EN_RUTA");
                  return (
                    <div key={d} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:14 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>🐯 {d}</div>
                      <div style={{ fontSize:12, marginTop:4 }}>
                        {asignado ? <span style={{color:C.blue,fontWeight:600}}>● En ruta · {asignado.id}</span> : <span style={{color:C.green}}>● Disponible</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {section==="historial" && (
            <div>
              <div style={{ fontWeight:600, fontSize:18, marginBottom:16 }}>📋 Historial completo</div>
              {isMobile ? (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {envios.map(e=>(
                    <div key={e.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <div>
                          <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{e.id}</div>
                          <div style={{ fontSize:12, color:C.gray }}>{e.cliente}</div>
                        </div>
                        <EstadoBadge estado={e.estado}/>
                      </div>
                      <div style={{ fontSize:12, color:C.gray, marginBottom:4 }}>{e.producto}</div>
                      <div style={{ fontSize:12, color:C.gray, marginBottom:4 }}>📍 {e.destino}</div>
                      {e.telefono && <a href={`tel:${e.telefono}`} style={{ fontSize:12, color:C.green, fontWeight:600 }}>📞 {e.telefono}</a>}
                      {e.driver && <div style={{ fontSize:12, color:C.text, marginTop:4 }}>🐯 {e.driver}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead><tr style={{ background:C.grayLight, color:C.gray, fontSize:11, fontWeight:600 }}>
                        {["ID","Cliente","Teléfono","Producto","Destino","Estado","Driver"].map(h=><th key={h} style={{ padding:"9px 12px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {envios.map(e=>(
                          <tr key={e.id} style={{ borderTop:`1px solid ${C.border}` }}>
                            <td style={{ padding:"10px 12px", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{e.id}</td>
                            <td style={{ padding:"10px 12px", fontSize:12 }}>{e.cliente}</td>
                            <td style={{ padding:"10px 12px", fontSize:12 }}>
                              {e.telefono ? <a href={`tel:${e.telefono}`} style={{ color:C.green, textDecoration:"none", fontWeight:600 }}>{e.telefono}</a> : <span style={{color:"#9CA3AF"}}>—</span>}
                            </td>
                            <td style={{ padding:"10px 12px", fontSize:12 }}>{e.producto}</td>
                            <td style={{ padding:"10px 12px", fontSize:12 }}>{e.destino}</td>
                            <td style={{ padding:"10px 12px" }}><EstadoBadge estado={e.estado}/></td>
                            <td style={{ padding:"10px 12px", fontSize:12, color:e.driver?C.text:"#9CA3AF" }}>{e.driver||"—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          {section==="config" && (
            <div style={{ maxWidth:400 }}>
              <div style={{ fontWeight:600, fontSize:18, marginBottom:16 }}>⚙️ Configuración</div>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <div style={{ fontWeight:600, marginBottom:4 }}>Sistema</div>
                <div style={{ fontSize:13, color:C.gray }}>Hundred Acre Wood Logistics v3.1</div>
                <div style={{ fontSize:13, color:C.gray, marginTop:2 }}>Mapa real Leaflet + OpenStreetMap</div>
                <hr style={{ border:"none", borderTop:`1px solid ${C.border}`, margin:"14px 0" }}/>
                <div style={{ fontSize:12, color:C.gray, fontWeight:600, marginBottom:6 }}>Mapa</div>
                <div style={{ fontSize:11, color:C.gray, lineHeight:1.8 }}>
                  Usando OpenStreetMap vía Leaflet 1.9.4.<br/>
                  14 departamentos · municipios y colonias de El Salvador precargados.
                </div>
                <hr style={{ border:"none", borderTop:`1px solid ${C.border}`, margin:"14px 0" }}/>
                <div style={{ fontSize:12, color:C.gray, fontWeight:600, marginBottom:6 }}>Sesión</div>
                <div style={{ fontSize:11, color:C.gray, lineHeight:1.8 }}>
                  La sesión y los envíos se guardan en localStorage.<br/>
                  Al refrescar la página se mantiene el login activo.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DriverView({ envios, setEnvios, userName, onLogout }) {
  const miNombre = userName || "";
  const activos  = envios.filter(e =>
    DRIVER_ACTIVO.includes(e.estado) &&
    (e.driver===miNombre || e.driver==="" || !miNombre.startsWith("Tigger-"))
  );
  const entregados = envios.filter(e =>
    e.estado==="ENTREGADO" && (e.driver===miNombre || !miNombre.startsWith("Tigger-"))
  );
  const [mapaAbierto, setMapaAbierto] = useState(null);
  const [fotos,       setFotos]       = useState({});

  const avanzar = id => setEnvios(p=>p.map(e=>
    e.id===id&&ESTADO_NEXT[e.estado]
      ? {...e,estado:ESTADO_NEXT[e.estado],hora:{...e.hora,[ESTADO_NEXT[e.estado]]:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));
  const marcarFallido = id => setEnvios(p=>p.map(e=>
    e.id===id&&(e.estado==="EN_RUTA"||e.estado==="EN_ALMACEN")
      ? {...e,estado:"FALLIDO",hora:{...e.hora,FALLIDO:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));

  // ── Estilos de botones ──
  // ENTREGADO: verde oscuro de fondo, cajita interna verde claro con check blanco
  const btnEntregado = {
    background:"#3D6B35",
    color:"#fff",
    border:"none",
    borderRadius:10,
    padding:"10px 16px",
    fontWeight:700,
    fontSize:13,
    cursor:"pointer",
    display:"inline-flex",
    alignItems:"center",
    gap:8,
  };
  // FALLIDO: café-ocre oscuro, X en rojo
  const btnFallido = {
    background:"#6B3A2A",
    color:"#fff",
    border:"none",
    borderRadius:10,
    padding:"10px 14px",
    fontWeight:700,
    fontSize:13,
    cursor:"pointer",
    display:"inline-flex",
    alignItems:"center",
    gap:8,
  };
  // EN RUTA: azul con flechita blanca en cajita semitransparente
  const btnEnRuta = {
    background:"#1D4ED8",
    color:"#fff",
    border:"none",
    borderRadius:10,
    padding:"10px 16px",
    fontWeight:700,
    fontSize:13,
    cursor:"pointer",
    display:"inline-flex",
    alignItems:"center",
    gap:8,
  };
  const btnSecondary = {
    background:C.grayLight,
    color:C.gray,
    border:`1px solid ${C.border}`,
    borderRadius:10,
    padding:"10px 12px",
    fontSize:13,
    cursor:"pointer",
    fontWeight:600,
    display:"inline-flex",
    alignItems:"center",
    gap:4,
  };

  // Ícono cajita checkmark verde claro
  const CheckIcon = () => (
    <span style={{ background:"#7CB87A", borderRadius:5, width:20, height:20, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );

  // Ícono X roja
  const XIcon = () => (
    <span style={{ color:"#F87171", fontSize:16, fontWeight:900, lineHeight:1 }}>✕</span>
  );

  // Ícono flechita blanca en cajita semitransparente
  const ArrowIcon = () => (
    <span style={{ background:"rgba(255,255,255,0.20)", borderRadius:5, width:20, height:20, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background:"#FFF5E6", padding:"20px 20px 16px", borderBottom:`1px solid #F5E6B4` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ background:"rgba(196,127,0,0.10)", borderRadius:12, padding:"10px 16px", border:"1px solid rgba(196,127,0,0.2)" }}>
            <div style={{ color:"#412402", fontWeight:700, fontSize:16 }}>🐯 App Tigger</div>
            <div style={{ color:"#855010", fontSize:12 }}>Conductor · {userName}</div>
          </div>
          <button onClick={onLogout} style={{ background:"rgba(196,127,0,0.12)", color:"#633806", border:"1px solid rgba(196,127,0,0.35)", borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>Salir</button>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontWeight:600, fontSize:15 }}>Mis entregas de hoy</div>
          {activos.length>0 && (
            <span style={{ background:C.honey, color:C.white, borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700 }}>
              {activos.length} pendientes
            </span>
          )}
        </div>

        {activos.length===0 && (
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:32, textAlign:"center", color:C.gray, fontSize:13 }}>
            No hay envíos activos. Rabbit debe despachar primero.
          </div>
        )}

        {activos.map(e=>(
          <div key={e.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderLeft:`4px solid ${ESTADO_COLORS[e.estado]}`, borderRadius:14, padding:16, marginBottom:12 }}>

            {/* ✅ Layout horizontal: emoji al lado de la info */}
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ fontSize:28, flexShrink:0, marginTop:2 }}>🍯</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{e.producto||"Paquete"}</div>
                <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>#{e.id} · Para: {e.cliente}</div>
                <div style={{ fontSize:12, color:C.gray }}>📍 {e.destino}</div>
                {e.telefono && (
                  <a href={`tel:${e.telefono}`} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, background:C.greenLight, color:C.green, border:`1px solid ${C.green}33`, borderRadius:8, padding:"5px 10px", textDecoration:"none", fontSize:12, fontWeight:600 }}>
                    📞 Llamar — {e.telefono}
                  </a>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display:"flex", gap:8, margin:"12px 0 10px", alignItems:"center", flexWrap:"wrap" }}>
              {e.estado==="EN_ALMACEN" && (
                <>
                  <button onClick={()=>avanzar(e.id)} style={btnEnRuta}>
                    <ArrowIcon/> EN RUTA
                  </button>
                  <button onClick={()=>marcarFallido(e.id)} style={btnFallido}>
                    <XIcon/> FALLIDO
                  </button>
                </>
              )}
              {e.estado==="EN_RUTA" && (
                <>
                  <button onClick={()=>avanzar(e.id)} style={btnEntregado}>
                    <CheckIcon/> ENTREGADO
                  </button>
                  <button onClick={()=>marcarFallido(e.id)} style={btnFallido}>
                    <XIcon/> FALLIDO
                  </button>
                  <label style={btnSecondary}>
                    📷 Foto
                    <input type="file" accept="image/*" capture="environment" style={{ display:"none" }}
                      onChange={ev=>{ const file=ev.target.files?.[0]; if(!file)return; const url=URL.createObjectURL(file); setFotos(p=>({...p,[e.id]:url})); ev.target.value=""; }}/>
                  </label>
                </>
              )}
              <button onClick={()=>setMapaAbierto(mapaAbierto===e.id?null:e.id)} style={btnSecondary}>
                {mapaAbierto===e.id?"🗺 Ocultar":"🗺 Ver ruta"}
              </button>
            </div>

            {mapaAbierto===e.id && (
              <div style={{ marginTop:12, borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}`, height:260 }}>
                <MapaAB origen={e.origen||"Bodega central"} destino={e.destino}/>
              </div>
            )}
            {fotos[e.id] && (
              <div style={{ marginTop:10 }}>
                <div style={{ fontSize:11, color:C.gray, marginBottom:4, fontWeight:600 }}>📷 Foto de entrega</div>
                <img src={fotos[e.id]} alt="entrega" style={{ width:"100%", maxHeight:180, objectFit:"cover", borderRadius:10, border:`1px solid ${C.border}` }}/>
              </div>
            )}
          </div>
        ))}

        {entregados.length>0 && (
          <>
            <div style={{ fontWeight:600, fontSize:14, color:C.gray, margin:"20px 0 10px" }}>Entregados hoy</div>
            {entregados.map(e=>(
              <div key={e.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", marginBottom:8, opacity:0.6 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{e.id}</span>
                  <span style={{ color:C.green, fontWeight:600, fontSize:13 }}>✓ Entregado</span>
                </div>
                <div style={{ fontSize:12, color:C.gray, marginTop:3 }}>{e.destino}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const savedSession = loadSession();
  const savedEnvios  = loadEnvios();
  const [role,     setRole]   = useState(savedSession?.role     || null);
  const [userName, setUser]   = useState(savedSession?.userName || "");
  const [envios,   setEnvios] = useState(savedEnvios || ENVIOS_INIT);
  useEffect(() => { saveEnvios(envios); }, [envios]);
  const handleLogin  = (r, name) => { setRole(r); setUser(name); saveSession(r, name); };
  const handleLogout = () => { setRole(null); setUser(""); clearSession(); };
  if (!role)           return <LoginView onLogin={handleLogin}/>;
  if (role==="piglet") return <PigletView  envios={envios} onLogout={handleLogout}/>;
  if (role==="admin")  return <AdminView   envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  if (role==="driver") return <DriverView  envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  return null;
}