import { useState, useEffect, useRef } from "react";

// ─── DATOS UBICACIONES EL SALVADOR ──────────────────────────────────────────
const SV_DATA = {
  "San Salvador": {
    "San Salvador": ["Colonia Escalón","Colonia San Benito","Colonia Miramonte","Colonia Flor Blanca","Colonia Médica","Centro de San Salvador","Mercado Central","Boulevard de los Héroes","Zona Rosa","Colonia Centroamérica","Colonia Santa Marta","Colonia Cucumacayán","Residencial Los Héroes","Colonia Utila"],
    "Mejicanos": ["Colonia Zacamil","Colonia Amatepec","Colonia Satélite","Colonia Santa Lucía","Centro de Mejicanos"],
    "Soyapango": ["Colonia Miralvalle","Colonia San Jacinto","Colonia Las Brisas","Centro de Soyapango"],
    "Ilopango": ["Colonia Santa María","Colonia Las Delicias","Centro de Ilopango"],
    "Apopa": ["Colonia Guadalupe","Colonia El Carmen","Centro de Apopa"],
    "Santa Tecla": ["Colonia Buena Vista","Colonia Las Victorias","Centro de Santa Tecla"],
    "Antiguo Cuscatlán": ["Colonia Maquilishuat","Jardines de Guadalupe","Centro Antiguo Cuscatlán"],
    "San Marcos": ["Colonia Las Margaritas","Centro de San Marcos"],
    "Delgado": ["Colonia Cinco de Noviembre","Centro de Delgado"],
    "Panchimalco": ["Centro de Panchimalco"],
    "Aguilares": ["Centro de Aguilares"],
    "Quezaltepeque": ["Centro de Quezaltepeque"],
    "San Juan Opico": ["Centro de San Juan Opico"]
  },
  "Santa Ana": {
    "Santa Ana": ["Centro de Santa Ana","Colonia Sinaí","Colonia Santa Bárbara","Colonia El Palmar","Colonia Las Vegas"],
    "Coatepeque": ["Centro de Coatepeque","Colonia San Francisco"],
    "Chalchuapa": ["Centro de Chalchuapa","Barrio El Calvario"],
    "Metapán": ["Centro de Metapán"],
    "Nahuizalco": ["Centro de Nahuizalco"]
  },
  "San Miguel": {
    "San Miguel": ["Centro de San Miguel","Colonia Ciudad Jardín","Colonia Chaparral","Barrio El Calvario","Colonia El Molino"],
    "Ciudad Barrios": ["Centro de Ciudad Barrios"],
    "San Francisco Gotera": ["Centro de San Francisco Gotera"]
  },
  "Sonsonate": {
    "Sonsonate": ["Centro de Sonsonate","Colonia Las Palmas","Colonia El Progreso"],
    "Acajutla": ["Centro de Acajutla"],
    "Armenia": ["Centro de Armenia"]
  },
  "La Libertad": {
    "La Libertad": ["Puerto de La Libertad","Colonia El Delfín"],
    "Santa Tecla": ["Colonia Las Victorias","Centro Santa Tecla"],
    "Antiguo Cuscatlán": ["Jardines de Guadalupe"],
    "San Juan Opico": ["Centro de San Juan Opico"]
  },
  "Usulután": {
    "Usulután": ["Centro de Usulután","Colonia 15 de Septiembre"],
    "Jiquilisco": ["Centro de Jiquilisco"],
    "Santiago de María": ["Centro de Santiago de María"]
  },
  "La Unión": {
    "La Unión": ["Centro de La Unión","Puerto Cutuco"],
    "Santa Rosa de Lima": ["Centro de Santa Rosa de Lima"]
  },
  "Chalatenango": {
    "Chalatenango": ["Centro de Chalatenango","Colonia El Rosario"],
    "Aguilares": ["Centro de Aguilares"]
  },
  "Cuscatlán": {
    "Cojutepeque": ["Centro de Cojutepeque","Colonia San Rafael"],
    "San Pedro Nonualco": ["Centro de San Pedro Nonualco"]
  },
  "Ahuachapán": {
    "Ahuachapán": ["Centro de Ahuachapán","Colonia Las Flores"]
  },
  "Cabañas": {
    "Sensuntepeque": ["Centro de Sensuntepeque"],
    "Ilobasco": ["Centro de Ilobasco"]
  },
  "La Paz": {
    "Zacatecoluca": ["Centro de Zacatecoluca","Colonia El Carmen"],
    "San Luis Talpa": ["Centro de San Luis Talpa"],
    "Santiago Nonualco": ["Centro de Santiago Nonualco"]
  },
  "Morazán": {
    "San Francisco Gotera": ["Centro de San Francisco Gotera"]
  },
  "San Vicente": {
    "San Vicente": ["Centro de San Vicente"],
    "Ilobasco": ["Centro de Ilobasco"],
    "San Sebastián": ["Centro de San Sebastián"]
  }
};

// ─── COORDENADAS hardcodeadas El Salvador ───────────────────────────────────
const SV_COORDS = {
  "Bodega central":              [13.7034, -89.2182],
  "Casa del roble, bosque sur":  [13.6929, -89.2182],
  "Árbol grande, bosque norte":  [13.9942, -89.5597],
  "Prado de Eeyore":             [13.4745, -88.1775],
  "Casa de Kanga":               [13.8206, -89.0997],
  "Huerto de Rabbit":            [13.6762, -89.2379],
  "San Salvador":  [13.6929, -89.2182],
  "Santa Ana":     [13.9942, -89.5597],
  "San Miguel":    [13.4745, -88.1775],
  "Sonsonate":     [13.7196, -89.7249],
  "La Libertad":   [13.4903, -89.3222],
  "Usulután":      [13.3500, -88.4333],
  "La Unión":      [13.3367, -87.8437],
  "Chalatenango":  [14.0356, -88.9335],
  "Cuscatlán":     [13.7167, -88.9333],
  "Ahuachapán":    [13.9211, -89.8450],
  "Cabañas":       [13.8667, -88.7500],
  "La Paz":        [13.5000, -88.9167],
  "Morazán":       [13.7667, -88.1167],
  "San Vicente":   [13.6417, -88.7847],
  "Santa Tecla":         [13.6767, -89.2797],
  "Antiguo Cuscatlán":   [13.6731, -89.2503],
  "Mejicanos":           [13.7282, -89.2167],
  "Soyapango":           [13.7100, -89.1533],
  "Ilopango":            [13.7022, -89.1128],
  "Apopa":               [13.8025, -89.1783],
  "Delgado":             [13.7294, -89.1736],
  "San Marcos":          [13.6631, -89.1803],
  "Panchimalco":         [13.6106, -89.1717],
  "Aguilares":           [13.9556, -89.1878],
  "Quezaltepeque":       [13.8311, -89.2700],
  "San Juan Opico":      [13.8761, -89.3575],
  "Coatepeque":          [13.9089, -89.5028],
  "Chalchuapa":          [13.9833, -89.6833],
  "Metapán":             [14.3333, -89.4500],
  "Acajutla":            [13.5928, -89.8317],
  "Nahuizalco":          [13.7808, -89.7278],
  "Armenia":             [13.7433, -89.5031],
  "Zacatecoluca":        [13.5019, -88.8694],
  "San Luis Talpa":      [13.4753, -89.0919],
  "Santiago Nonualco":   [13.5194, -88.9078],
  "Jiquilisco":          [13.3189, -88.5747],
  "Santiago de María":   [13.4878, -88.4703],
  "Santa Rosa de Lima":  [13.6247, -87.9808],
  "San Francisco Gotera":[13.6994, -88.1033],
  "Ciudad Barrios":      [13.7608, -88.2753],
  "Sensuntepeque":       [13.8753, -88.6258],
  "Ilobasco":            [13.8408, -88.8500],
  "San Sebastián":       [13.7269, -88.8336],
  "Cojutepeque":         [13.7167, -88.9333],
  "San Pedro Nonualco":  [13.5556, -88.9294],
  "Colonia Escalón":        [13.7094, -89.2378],
  "Colonia San Benito":     [13.7011, -89.2267],
  "Colonia Miramonte":      [13.7103, -89.2278],
  "Colonia Flor Blanca":    [13.6989, -89.2214],
  "Colonia Médica":         [13.6978, -89.2133],
  "Centro de San Salvador": [13.6985, -89.1912],
  "Mercado Central":        [13.6997, -89.1908],
  "Boulevard de los Héroes":[13.7139, -89.2092],
  "Zona Rosa":              [13.7003, -89.2289],
  "Colonia Centroamérica":  [13.7211, -89.2044],
  "Colonia Santa Marta":    [13.7156, -89.1894],
  "Colonia Cucumacayán":    [13.7231, -89.1800],
  "Residencial Los Héroes": [13.7317, -89.1728],
  "Colonia Utila":          [13.7156, -89.1525],
  "Centro de Santa Ana":    [13.9942, -89.5597],
  "Colonia Sinaí":          [13.9867, -89.5544],
  "Colonia Santa Bárbara":  [13.9989, -89.5478],
  "Centro de San Miguel":   [13.4745, -88.1775],
  "Colonia Ciudad Jardín":  [13.4811, -88.1839],
  "Colonia Chaparral":      [13.4703, -88.1706],
  "Barrio El Calvario":     [13.4728, -88.1758],
};

const SV_BBOX = { minLat: 13.1, maxLat: 14.5, minLon: -90.2, maxLon: -87.6 };

async function geocodeSV(query) {
  if (!query) return null;
  if (SV_COORDS[query]) return SV_COORDS[query];
  const lower = query.toLowerCase().trim();
  for (const [key, coords] of Object.entries(SV_COORDS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower.replace(/, ?el salvador/i, "").trim())) {
      return coords;
    }
  }
  const q = /el salvador/i.test(query) ? query : `${query}, El Salvador`;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=sv`;
    const res  = await fetch(url, { headers: { "Accept-Language": "es" } });
    const data = await res.json();
    const valid = data.filter(r => {
      const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
      return lat >= SV_BBOX.minLat && lat <= SV_BBOX.maxLat &&
             lon >= SV_BBOX.minLon && lon <= SV_BBOX.maxLon;
    });
    if (valid.length > 0) return [parseFloat(valid[0].lat), parseFloat(valid[0].lon)];
  } catch {}
  return null;
}

// ─── PALETA ─────────────────────────────────────────────────────────────────
const C = {
  honey:      "#F0A500",
  honeyDark:  "#C47F00",
  honeyLight: "#FFF8E7",
  honeyBg:    "#FEF3D0",
  blue:       "#2563EB",
  blueDark:   "#1D4ED8",
  blueLight:  "#EFF6FF",
  green:      "#16A34A",
  greenLight: "#F0FDF4",
  gray:       "#6B7280",
  grayLight:  "#F9FAFB",
  border:     "#E5E7EB",
  text:       "#111827",
  textSoft:   "#374151",
  red:        "#DC2626",
  redLight:   "#FEF2F2",
  white:      "#FFFFFF",
  sidebarBg:      "#FFFFFF",
  sidebarText:    "#412402",
  sidebarMuted:   "#855010",
  sidebarActive:  "#633806",
  sidebarActiveBg:"rgba(196,127,0,0.10)",
  sidebarBorder:  "#F5E6B4",
};

const ESTADO_COLORS = {
  CREADO: "#9CA3AF", EN_ALMACEN: C.honey,
  EN_RUTA: C.blue,  ENTREGADO: C.green, FALLIDO: C.red,
};
const ESTADO_NEXT = {
  CREADO: "EN_ALMACEN", EN_ALMACEN: "EN_RUTA",
  EN_RUTA: "ENTREGADO", ENTREGADO: null, FALLIDO: null,
};
const DRIVER_ACTIVO = ["EN_ALMACEN", "EN_RUTA"];
const DRIVERS = Array.from({ length: 10 }, (_, i) => `Tigger-${String(i + 1).padStart(2, "0")}`);

const ROUTE_COLORS = [
  "#E24B4A", "#1D9E75", "#7F77DD",
  "#EF9F27", "#D4537E", "#378ADD",
  "#639922", "#D85A30", "#885EA6",
  "#0F6E56",
];

const ENVIOS_INIT = [
  { id:"HAW001", cliente:"Piglet",  telefono:"7755-1001", producto:"Tarro de miel × 3",  origen:"Bodega central", destino:"San Miguel",   estado:"EN_RUTA",    driver:"Tigger-03", hora:{ CREADO:"08:15", EN_ALMACEN:"09:00", EN_RUTA:"10:30" } },
  { id:"HAW002", cliente:"Owl",     telefono:"7755-1002", producto:"Zanahorias × 10",    origen:"Santa Ana",      destino:"San Salvador", estado:"EN_ALMACEN", driver:"",          hora:{ CREADO:"09:00", EN_ALMACEN:"09:45" } },
  { id:"HAW003", cliente:"Eeyore",  telefono:"7755-1003", producto:"Globo azul × 1",     origen:"Bodega central", destino:"Sonsonate",    estado:"CREADO",     driver:"",          hora:{ CREADO:"10:00" } },
  { id:"HAW004", cliente:"Kanga",   telefono:"7755-1004", producto:"Miel de trébol × 5", origen:"Bodega central", destino:"La Libertad",  estado:"ENTREGADO",  driver:"Tigger-07", hora:{ CREADO:"07:00", EN_ALMACEN:"07:30", EN_RUTA:"08:00", ENTREGADO:"09:15" } },
];

// ─── LEAFLET HELPER ──────────────────────────────────────────────────────────
function ensureLeaflet(cb) {
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css"; link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  if (window.L) { cb(); return; }
  if (document.getElementById("leaflet-js")) {
    const wait = setInterval(() => { if (window.L) { clearInterval(wait); cb(); } }, 50);
    return;
  }
  const sc = document.createElement("script");
  sc.id = "leaflet-js";
  sc.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  sc.onload = cb;
  document.head.appendChild(sc);
}

// ─── MAPA ADMIN ──────────────────────────────────────────────────────────────
function MapaSV({ envios }) {
  const mapRef      = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    ensureLeaflet(async () => {
      if (!mapRef.current) return;
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
      const L   = window.L;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([13.7942, -88.8965], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 18,
      }).addTo(map);
      const enRuta = envios.filter(e => e.estado === "EN_RUTA");
      const allBounds = [];
      for (const [i, e] of enRuta.entries()) {
        const color  = ROUTE_COLORS[i % ROUTE_COLORS.length];
        const coordA = await geocodeSV(e.origen || "Bodega central");
        const coordB = await geocodeSV(e.destino);
        if (!coordA || !coordB) continue;
        allBounds.push(coordA, coordB);
        L.polyline([coordA, coordB], { color, weight: 4, dashArray: "10 6", opacity: 0.95 }).addTo(map);
        const iconA = L.divIcon({
          html: `<div style="background:${color};color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)">A</div>`,
          className: "", iconSize: [30, 30], iconAnchor: [15, 15],
        });
        const iconB = L.divIcon({
          html: `<div style="background:${color};color:white;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)">B</div>`,
          className: "", iconSize: [30, 30], iconAnchor: [15, 15],
        });
        L.marker(coordA, { icon: iconA }).addTo(map).bindPopup(`<b style="color:${color}">📦 ${e.id} — Origen</b><br>${e.origen}`);
        L.marker(coordB, { icon: iconB }).addTo(map).bindPopup(`<b style="color:${color}">🏠 ${e.id} — Destino</b><br>${e.destino}<br>🐯 ${e.driver || "—"}`);
      }
      if (allBounds.length > 0) {
        map.fitBounds(L.latLngBounds(allBounds), { padding: [32, 32], maxZoom: 12, animate: true });
      }
      instanceRef.current = map;
    });
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [envios]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── MAPA A→B ─────────────────────────────────────────────────────────────────
function MapaAB({ origen, destino }) {
  const mapRef      = useRef(null);
  const instanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    Promise.all([geocodeSV(origen), geocodeSV(destino)]).then(([coordA, coordB]) => {
      setLoading(false);
      if (!coordA || !coordB) { setError("No se encontró la ubicación en El Salvador."); return; }
      ensureLeaflet(() => {
        if (!mapRef.current) return;
        if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
        const L   = window.L;
        const mid = [(coordA[0]+coordB[0])/2, (coordA[1]+coordB[1])/2];
        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView(mid, 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 18,
        }).addTo(map);
        const iconA = L.divIcon({
          html: `<div style="background:#16A34A;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.35)">A</div>`,
          className: "", iconSize: [34, 34], iconAnchor: [17, 17],
        });
        const iconB = L.divIcon({
          html: `<div style="background:#2563EB;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.35)">B</div>`,
          className: "", iconSize: [34, 34], iconAnchor: [17, 17],
        });
        L.marker(coordA, { icon: iconA }).addTo(map).bindPopup(`<b>📦 Origen</b><br>${origen}`);
        L.marker(coordB, { icon: iconB }).addTo(map).bindPopup(`<b>🏠 Destino</b><br>${destino}`);
        L.polyline([coordA, coordB], {
          color: "#F0A500", weight: 5, opacity: 0.95, dashArray: "12 7", lineCap: "round", lineJoin: "round",
        }).addTo(map);
        const midPt = [(coordA[0]+coordB[0])/2, (coordA[1]+coordB[1])/2];
        const pulseIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#F0A500;border:3px solid white;box-shadow:0 0 0 4px rgba(240,165,0,0.3);animation:pulse 1.5s ease-in-out infinite">
            <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(240,165,0,0.3)}50%{box-shadow:0 0 0 8px rgba(240,165,0,0.08)}}</style>
          </div>`,
          className: "", iconSize: [14, 14], iconAnchor: [7, 7],
        });
        L.marker(midPt, { icon: pulseIcon, interactive: false }).addTo(map);
        map.fitBounds(L.latLngBounds([coordA, coordB]), { padding: [40, 40], maxZoom: 13, animate: true, duration: 1.2 });
        instanceRef.current = map;
      });
    });
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [origen, destino]);

  if (loading) return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#FAFAFA", color:"#6B7280", fontSize:13, gap:10 }}>
      <style>{`@keyframes spinHoney{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize:28, display:"inline-block", animation:"spinHoney 1.5s linear infinite" }}>🍯</span>
      <span>Buscando en El Salvador…</span>
    </div>
  );
  if (error) return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#FEF2F2", color:"#DC2626", fontSize:13, padding:20, textAlign:"center", gap:8 }}>
      <span style={{ fontSize:22 }}>⚠️</span><span>{error}</span>
    </div>
  );
  return <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>;
}

// ─── ANIMACIÓN TARRO DE MIEL ─────────────────────────────────────────────────
function HoneyBearAnim() {
  return (
    <div style={{ position:"relative", height:70, display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:4 }}>
      <style>{`
        @keyframes haBounce { 0%,100%{transform:translateY(0px)} 40%{transform:translateY(-12px)} 60%{transform:translateY(-6px)} }
        @keyframes haPeek   { 0%,60%{transform:translateY(30px);opacity:0} 75%,100%{transform:translateY(0px);opacity:1} }
      `}</style>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", zIndex:2, overflow:"hidden", height:36, width:40 }}>
        <div style={{ fontSize:26, lineHeight:1, animation:"haPeek 3s ease-in-out infinite" }}>🐻</div>
      </div>
      <div style={{ fontSize:50, animation:"haBounce 3s ease-in-out infinite", zIndex:1, lineHeight:1 }}>🍯</div>
    </div>
  );
}

// ─── BADGE ESTADO ────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const label = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado", FALLIDO:"Fallido ❌" };
  const col = ESTADO_COLORS[estado] || "#888";
  return (
    <span style={{ background:col+"22", color:col, border:`1px solid ${col}44`, borderRadius:99, padding:"2px 10px", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      {label[estado]}
    </span>
  );
}

// ─── STEPPER ─────────────────────────────────────────────────────────────────
function Stepper({ estado }) {
  const steps  = ["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"];
  const labels = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado" };
  const cur    = steps.indexOf(estado);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", margin:"12px 0" }}>
      {steps.map((st, i) => {
        const done = i <= cur; const isLast = i === steps.length - 1;
        return (
          <div key={st} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
              <div style={{ flex:i===0?"0 0 50%":1, height:3, background:i>0&&done?ESTADO_COLORS[estado]:i>0?"#E5E7EB":"transparent" }}/>
              <div style={{ width:14, height:14, borderRadius:"50%", background:done?ESTADO_COLORS[estado]:"#E5E7EB", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {done && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex:isLast?"0 0 50%":1, height:3, background:!isLast&&i<cur?ESTADO_COLORS[estado]:"#E5E7EB" }}/>
            </div>
            <div style={{ fontSize:9, marginTop:4, color:done?ESTADO_COLORS[estado]:"#9CA3AF", fontWeight:600, textAlign:"center" }}>
              {labels[st]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SELECTOR UBICACIÓN EN CASCADA ──────────────────────────────────────────
const selStyle = (disabled) => ({
  width: "100%", padding: "8px 28px 8px 10px",
  borderRadius: 8, border: `1px solid ${C.border}`,
  background: disabled ? C.grayLight : C.white,
  color: disabled ? "#9CA3AF" : C.text,
  fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
  appearance: "none", outline: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  opacity: disabled ? 0.5 : 1,
});

function UbicacionSelector({ label, accentColor, value, onChange }) {
  const { departamento, municipio, colonia } = value;
  const departamentos = Object.keys(SV_DATA);
  const municipios    = departamento ? Object.keys(SV_DATA[departamento] || {}) : [];
  const colonias      = departamento && municipio ? (SV_DATA[departamento]?.[municipio] || []) : [];

  const handleDep = (e) => onChange({ departamento: e.target.value, municipio: "", colonia: "" });
  const handleMun = (e) => onChange({ departamento, municipio: e.target.value, colonia: "" });
  const handleCol = (e) => onChange({ departamento, municipio, colonia: e.target.value });

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:accentColor }} />
        <span style={{ fontSize:12, fontWeight:600, color:C.gray }}>{label}</span>
        {(departamento) && (
          <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, background:accentColor+"22", color:accentColor, border:`1px solid ${accentColor}44`, borderRadius:99, padding:"1px 8px" }}>
            {colonia || municipio || departamento}
          </span>
        )}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>Departamento</label>
          <select value={departamento} onChange={handleDep} style={selStyle(false)}>
            <option value="">Seleccionar…</option>
            {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>Municipio</label>
          <select value={municipio} onChange={handleMun} disabled={!departamento} style={selStyle(!departamento)}>
            <option value="">Seleccionar…</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>Colonia / zona</label>
          <select value={colonia} onChange={handleCol} disabled={!municipio} style={selStyle(!municipio)}>
            <option value="">Seleccionar…</option>
            {colonias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: LOGIN
// ══════════════════════════════════════════════════════════════════════════════
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
    <div style={{ minHeight:"100vh", background:"#FFF5E6", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Helvetica Neue',Arial,sans-serif", fontWeight:300 }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"32px 28px", width:300, boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <HoneyBearAnim />
          <p style={{ margin:"10px 0 3px", fontSize:19, color:"#412402", fontWeight:300, letterSpacing:"0.3px" }}>Hundred Acre Logistics</p>
          <p style={{ color:"#aaa", fontSize:12, margin:0, fontWeight:300 }}>Ingresa al sistema del bosque</p>
        </div>
        <label style={{ fontSize:11, color:"#aaa", fontWeight:300, display:"block", marginBottom:5 }}>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="rabbit@hundredacre.com"
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #e8e8e8", borderRadius:8, fontSize:13, fontWeight:300, marginBottom:14, boxSizing:"border-box", outline:"none", background:"#f9fbff", color:"#333" }}/>
        <label style={{ fontSize:11, color:"#aaa", fontWeight:300, display:"block", marginBottom:5 }}>Contraseña</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #e8e8e8", borderRadius:8, fontSize:13, fontWeight:300, marginBottom:16, boxSizing:"border-box", outline:"none", background:"#f9fbff", color:"#333" }}/>
        {err && <div style={{ background:"#FEF2F2", color:"#DC2626", borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:300, marginBottom:12 }}>{err}</div>}
        <button onClick={login}
          style={{ width:"100%", padding:"12px", background:"#EF9F27", color:"#fff", border:"none", borderRadius:8, fontWeight:300, fontSize:14, letterSpacing:"0.3px", cursor:"pointer" }}>
          Entrar al bosque 🌳
        </button>
        <div style={{ marginTop:16, padding:"12px", background:"#FAEEDA", borderRadius:8, fontSize:11, color:"#633806", fontWeight:300, lineHeight:2, textAlign:"center" }}>
          <span style={{ fontWeight:400 }}>Demo:</span><br/>
          🐰 rabbit@hundredacre.com / honey123<br/>
          🐯 tigger@hundredacre.com / honey123
        </div>
        <p style={{ textAlign:"center", marginTop:14, fontSize:11, color:"#aaa", fontWeight:300 }}>
          ¿Eres cliente?{" "}
          <span style={{ color:"#EF9F27", cursor:"pointer" }} onClick={()=>onLogin("piglet","")}>
            Rastreá tu paquete →
          </span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: PIGLET
// ══════════════════════════════════════════════════════════════════════════════
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
    CREADO:     { icon:"📦", label:"Paquete creado",  who: ()  => "Bodega central" },
    EN_ALMACEN: { icon:"🏭", label:"En almacén",       who: ()  => "Rabbit lo recibió 🐰" },
    EN_RUTA:    { icon:"🐯", label:"En ruta — ahora", who: e   => `Tigger está en camino\nConductor: ${e.driver?.slice(0,-3)}*** (asignado)` },
    ENTREGADO:  { icon:"✅", label:"Entregado",        who: ()  => "Entrega completada" },
  };
  const STEPS  = ["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"];
  const curIdx = result && result!=="notfound" && result!=="invisible" ? STEPS.indexOf(result.estado) : -1;

  return (
    <div style={{ minHeight:"100vh", background:C.sidebarBg }}>
      <div style={{ background:"#FFF5E6", padding:"20px 24px 18px", position:"relative", borderBottom:`1px solid #F5E6B4` }}>
        <div style={{ textAlign:"center" }}>
          <HoneyBearAnim />
          <h1 style={{ color:"#412402", fontSize:22, fontWeight:700, margin:"8px 0 4px" }}>¿Dónde está mi paquete?</h1>
          <p style={{ color:"#855010", fontSize:13, margin:0 }}>Hundred Acre Wood Logistics · El Salvador</p>
        </div>
        <button onClick={onLogout} style={{ position:"absolute", top:16, right:20, background:"rgba(196,127,0,0.12)", color:"#633806", border:"1px solid rgba(196,127,0,0.35)", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
          ← Salir
        </button>
      </div>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"28px 16px" }}>
        <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.gray, marginBottom:8 }}>Número de guía</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&buscar()}
              placeholder="Ej: HAW001"
              style={{ flex:1, padding:"10px 12px", borderRadius:10, border:`1px solid ${C.border}`, fontSize:14, outline:"none" }}/>
            <button onClick={buscar} style={{ background:C.honey, color:C.white, border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              Rastrear ↗
            </button>
          </div>
        </div>
        {result==="notfound" && (
          <div style={{ background:C.redLight, color:C.red, borderRadius:10, padding:"12px 16px", fontSize:13 }}>
            No se encontró el envío. Verificá el código.
          </div>
        )}
        {result==="invisible" && (
          <div style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:10, padding:"12px 16px", fontSize:13 }}>
            ⏳ Tu paquete aún no ingresó a bodega. En breve podrás rastrearlo.
          </div>
        )}
        {result && result!=="notfound" && result!=="invisible" && (
          <>
            <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <div>
                  <div style={{ fontSize:17, fontWeight:700 }}>🍯 {result.producto}</div>
                  <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>Guía: #{result.id}</div>
                </div>
                <EstadoBadge estado={result.estado}/>
              </div>
              <Stepper estado={result.estado}/>
              {result.estado==="EN_RUTA" && result.telefono && (
                <a href={`tel:${result.telefono}`}
                  style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, background:C.greenLight, color:C.green, border:`1px solid ${C.green}33`, borderRadius:10, padding:"10px 14px", textDecoration:"none", fontWeight:600, fontSize:13 }}>
                  📞 Contactar al conductor — {result.telefono}
                </a>
              )}
            </div>
            <div style={{ background:C.white, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ padding:"14px 18px 10px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>📍 Ruta de tu paquete — El Salvador</div>
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
              <div style={{ height:280 }}>
                <MapaAB origen={result.origen} destino={result.destino} />
              </div>
            </div>
            <div style={{ background:C.white, borderRadius:14, padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Historial del paquete</div>
              {STEPS.map((st, i) => {
                const done  = i <= curIdx;
                const h     = HIST_LABELS[st];
                const hora  = result.hora?.[st];
                const isCur = i === curIdx;
                return (
                  <div key={st} style={{ display:"flex", gap:12, marginBottom:16, opacity:done?1:0.35 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:isCur?ESTADO_COLORS[st]:done?C.greenLight:C.grayLight, border:`2px solid ${done?(isCur?ESTADO_COLORS[st]:C.green):C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                        {done ? (isCur ? <span style={{fontSize:15}}>{h.icon}</span> : <span style={{color:C.green,fontSize:14}}>✓</span>) : <span style={{color:"#D1D5DB",fontSize:12}}>○</span>}
                      </div>
                      {i < STEPS.length-1 && <div style={{ width:2, flex:1, minHeight:14, background:done&&i<curIdx?C.green:C.border, marginTop:2 }}/>}
                    </div>
                    <div style={{ paddingBottom:8 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:isCur?ESTADO_COLORS[st]:C.text }}>{h.label}</div>
                      {hora && <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>Hoy {hora} · {h.who(result).split("\n")[0]}</div>}
                      {isCur && h.who(result).split("\n")[1] && <div style={{ fontSize:12, color:ESTADO_COLORS[st], marginTop:1 }}>{h.who(result).split("\n")[1]}</div>}
                      {!hora && !done && <div style={{ fontSize:12, color:"#9CA3AF" }}>Pendiente…</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:C.honeyLight, border:`1px solid ${C.honey}55`, borderRadius:10, padding:"12px 14px", fontSize:12, color:C.honeyDark }}>
              <div style={{ fontWeight:600, marginBottom:2 }}>🔒 Tu privacidad</div>
              No necesitás crear cuenta. Solo ves el estado de TU paquete.
            </div>
          </>
        )}
        <p style={{ textAlign:"center", fontSize:11, color:"#9CA3AF", marginTop:20 }}>
          Demo: HAW001 (en ruta) · HAW002 (bodega) · HAW003 (invisible) · HAW004 (entregado)
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: ADMIN
// ══════════════════════════════════════════════════════════════════════════════
function AdminView({ envios, setEnvios, userName, onLogout }) {
  const [section,     setSection]     = useState("paquetes");
  const [driverSel,   setDriverSel]   = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form,        setForm]        = useState({ cliente:"", telefono:"", producto:"" });
  const [origenLoc,   setOrigenLoc]   = useState({ departamento:"", municipio:"", colonia:"" });
  const [destinoLoc,  setDestinoLoc]  = useState({ departamento:"", municipio:"", colonia:"" });
  const [formErr,     setFormErr]     = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSection = (id) => { setSection(id); setSidebarOpen(false); };

  const crearPaquete = () => {
    const origenStr  = origenLoc.colonia  || origenLoc.municipio  || origenLoc.departamento;
    const destinoStr = destinoLoc.colonia || destinoLoc.municipio || destinoLoc.departamento;

    if (!form.cliente.trim() || !form.producto.trim() || !origenStr || !destinoStr)
      return setFormErr("Completá todos los campos, incluyendo origen y destino.");

    const num   = String(envios.length + 1).padStart(3, "0");
    const nuevo = {
      id: `HAW${num}`,
      cliente: form.cliente,
      telefono: form.telefono,
      producto: form.producto,
      origen: origenStr,
      destino: destinoStr,
      estado: "CREADO",
      driver: "",
      hora: { CREADO: new Date().toLocaleTimeString("es", { hour:"2-digit", minute:"2-digit" }) }
    };
    setEnvios(p => [...p, nuevo]);
    setForm({ cliente:"", telefono:"", producto:"" });
    setOrigenLoc({ departamento:"", municipio:"", colonia:"" });
    setDestinoLoc({ departamento:"", municipio:"", colonia:"" });
    setFormErr("");
    setMostrarForm(false);
  };

  const recibirBodega = id => setEnvios(p => p.map(e =>
    e.id===id && e.estado==="CREADO"
      ? { ...e, estado:"EN_ALMACEN", hora:{ ...e.hora, EN_ALMACEN:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) } }
      : e
  ));

  const despachar = id => {
    const dr = driverSel[id];
    if (!dr) return alert("Seleccioná un driver primero.");
    setEnvios(p => p.map(e =>
      e.id===id && e.estado==="EN_ALMACEN"
        ? { ...e, estado:"EN_RUTA", driver:dr, hora:{ ...e.hora, EN_RUTA:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) } }
        : e
    ));
  };

  const stats = [
    { label:"Total hoy",  val:envios.length,                                   sub:"paquetes",      col:C.text  },
    { label:"En ruta",    val:envios.filter(e=>e.estado==="EN_RUTA").length,    sub:"con Tigger 🐯", col:C.blue  },
    { label:"Entregados", val:envios.filter(e=>e.estado==="ENTREGADO").length,  sub:"hoy",           col:C.green },
    { label:"Fallidos",   val:0,                                                sub:"revisar",       col:C.red   },
  ];
  const estadoStats = [
    { label:"Creado",     val:envios.filter(e=>e.estado==="CREADO").length,     col:C.gray  },
    { label:"En almacén", val:envios.filter(e=>e.estado==="EN_ALMACEN").length, col:C.honey },
    { label:"En ruta",    val:envios.filter(e=>e.estado==="EN_RUTA").length,    col:C.blue  },
    { label:"Entregado",  val:envios.filter(e=>e.estado==="ENTREGADO").length,  col:C.green },
  ];

  const MENU = [
    { id:"paquetes",    icon:"📦", label:"Paquetes"      },
    { id:"conductores", icon:"🐯", label:"Conductores"   },
    { id:"historial",   icon:"📋", label:"Historial"     },
    { id:"config",      icon:"⚙️",  label:"Configuración" },
  ];

  const activeEnvios   = envios.filter(e => e.estado !== "ENTREGADO");
  const tiggersActivos = DRIVERS.filter(d => envios.some(e => e.driver===d && e.estado==="EN_RUTA")).length;
  const enRutaCount    = envios.filter(e => e.estado === "EN_RUTA").length;
  const isDesktop      = typeof window !== "undefined" && window.innerWidth >= 768;

  const sidebarStyle = isDesktop
    ? { width:220, background:C.sidebarBg, borderRight:`1px solid ${C.sidebarBorder}`, display:"flex", flexDirection:"column", flexShrink:0 }
    : { width:220, background:C.sidebarBg, borderRight:`1px solid ${C.sidebarBorder}`, display:"flex", flexDirection:"column", flexShrink:0, position:"fixed", top:0, left:0, height:"100%", zIndex:300, transform:sidebarOpen?"translateX(0)":"translateX(-100%)", transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)", boxShadow:sidebarOpen?"4px 0 24px rgba(0,0,0,0.15)":"none" };

  const FORM_FIELDS = [
    ["cliente",  "Cliente / destinatario", "Ej: Piglet"],
    ["telefono", "Teléfono",               "Ej: 7755-1234"],
    ["producto", "Producto",               "Ej: Tarro de miel × 3"],
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>

      {sidebarOpen && !isDesktop && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.30)", zIndex:250, backdropFilter:"blur(2px)" }}/>
      )}

      <aside style={sidebarStyle}>
        <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${C.sidebarBorder}` }}>
          <HoneyBearAnim />
          <div style={{ fontSize:13, fontWeight:700, color:C.sidebarText, marginTop:4, letterSpacing:"0.2px" }}>Hundred Acre Wood</div>
          <div style={{ fontSize:11, color:C.sidebarMuted, marginTop:2 }}>Panel de despacho — Owl Admin</div>
        </div>
        <div style={{ padding:"10px 0", flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.sidebarMuted, letterSpacing:1.2, padding:"8px 18px 4px", textTransform:"uppercase" }}>MENÚ</div>
          {MENU.map(m => {
            const active = section === m.id;
            return (
              <button key={m.id} onClick={()=>handleSection(m.id)}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 18px", border:"none", background:active?C.sidebarActiveBg:"transparent", color:active?C.sidebarActive:C.sidebarText, fontWeight:active?700:400, fontSize:13.5, cursor:"pointer", borderLeft:active?`3px solid ${C.sidebarActive}`:"3px solid transparent", textAlign:"left", transition:"background 0.12s, color 0.12s" }}>
                <span>{m.icon}</span>{m.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.sidebarBorder}`, fontSize:11 }}>
          <div style={{ color:C.green, fontWeight:600 }}>● Tigger disponible</div>
          <div style={{ color:C.sidebarMuted, marginTop:2 }}>{tiggersActivos} envíos en ruta</div>
        </div>
      </aside>

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setSidebarOpen(v=>!v)} aria-label="Menú"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:`1px solid ${C.border}`, borderRadius:8, width:36, height:36, cursor:"pointer", color:C.gray, flexShrink:0 }}>
              {sidebarOpen
                ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2" y1="4.5" x2="16" y2="4.5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13.5" x2="16" y2="13.5"/></svg>
              }
            </button>
            <span style={{ fontSize:13, color:C.gray }}>Panel de despacho — Owl Admin</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:13, color:C.textSoft }}>🐰 {userName}</span>
            <div style={{ width:30, height:30, borderRadius:"50%", background:C.honey, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>R</div>
            <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer", color:C.gray }}>Cerrar sesión</button>
          </div>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:"20px 24px" }}>

          {section==="paquetes" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
                {stats.map(st=>(
                  <div key={st.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
                    <div style={{ fontSize:11, color:C.gray }}>{st.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:st.col, lineHeight:1.2 }}>{st.val}</div>
                    <div style={{ fontSize:11, color:C.gray }}>{st.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
                {estadoStats.map(st=>(
                  <div key={st.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:st.col, flexShrink:0 }}/>
                    <div>
                      <div style={{ fontSize:20, fontWeight:700, color:st.col }}>{st.val}</div>
                      <div style={{ fontSize:11, color:C.gray }}>{st.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:16 }}>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontWeight:600, fontSize:15 }}>Paquetes activos</div>
                    <button onClick={()=>setMostrarForm(v=>!v)}
                      style={{ background:"transparent", color:C.honeyDark, border:`1.5px solid ${C.honeyDark}`, borderRadius:8, padding:"7px 14px", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                      {mostrarForm ? "✕ Cancelar" : "＋ Nuevo envío"}
                    </button>
                  </div>

                  {mostrarForm && (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14, borderLeft:`4px solid ${C.honey}` }}>
                      <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>📦 Registrar nuevo paquete</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                        {FORM_FIELDS.map(([k,l,ph])=>(
                          <div key={k}>
                            <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>{l}</label>
                            <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}
                              style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, boxSizing:"border-box", outline:"none" }}/>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom:12 }}>
                        <UbicacionSelector
                          label="Origen"
                          accentColor={C.green}
                          value={origenLoc}
                          onChange={setOrigenLoc}
                        />
                      </div>

                      <div style={{ borderTop:`1px solid ${C.border}`, margin:"12px 0" }} />

                      <div style={{ marginBottom:14 }}>
                        <UbicacionSelector
                          label="Destino"
                          accentColor={C.blue}
                          value={destinoLoc}
                          onChange={setDestinoLoc}
                        />
                      </div>

                      {formErr && <div style={{ background:C.redLight, color:C.red, borderRadius:6, padding:"6px 10px", fontSize:12, marginBottom:8 }}>{formErr}</div>}
                      <button onClick={crearPaquete}
                        style={{ background:C.honey, color:C.white, border:"none", borderRadius:8, padding:"8px 18px", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                        ✓ Crear paquete
                      </button>
                    </div>
                  )}

                  {activeEnvios.length===0 && (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:32, textAlign:"center", color:C.gray, fontSize:13 }}>
                      No hay paquetes activos. ¡Creá el primero!
                    </div>
                  )}

                  {activeEnvios.length>0 && (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
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
                                {e.telefono
                                  ? <a href={`tel:${e.telefono}`} style={{ color:C.green, textDecoration:"none", fontWeight:600 }}>📞 {e.telefono}</a>
                                  : <span style={{ color:"#9CA3AF" }}>—</span>}
                              </td>
                              <td style={{ padding:"11px 12px" }}><EstadoBadge estado={e.estado}/></td>
                              <td style={{ padding:"11px 12px", fontSize:12, color:e.driver?C.text:"#9CA3AF" }}>{e.driver||"—"}</td>
                              <td style={{ padding:"11px 12px" }}>
                                {e.estado==="CREADO" && (
                                  <button onClick={()=>recibirBodega(e.id)}
                                    style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                                    📦 Recibir
                                  </button>
                                )}
                                {e.estado==="EN_ALMACEN" && (
                                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                    <select value={driverSel[e.id]||""} onChange={ev=>setDriverSel(p=>({...p,[e.id]:ev.target.value}))}
                                      style={{ padding:"5px 8px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:12, outline:"none" }}>
                                      <option value="">Driver…</option>
                                      {DRIVERS.map(d=><option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <button onClick={()=>despachar(e.id)}
                                      style={{ background:C.blueLight, color:C.blue, border:`1px solid ${C.blue}44`, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                                      🚗 Despachar
                                    </button>
                                  </div>
                                )}
                                {e.estado==="EN_RUTA" && <span style={{ color:"#9CA3AF", fontSize:12 }}>En camino…</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>Mapa del bosque 🇸🇻</div>
                  {enRutaCount > 0 && (
                    <div style={{ marginBottom:8, display:"flex", flexWrap:"wrap", gap:6 }}>
                      {envios.filter(e=>e.estado==="EN_RUTA").map((e,i)=>(
                        <span key={e.id} style={{ display:"inline-flex", alignItems:"center", gap:5, background:ROUTE_COLORS[i%ROUTE_COLORS.length]+"18", border:`1px solid ${ROUTE_COLORS[i%ROUTE_COLORS.length]}44`, borderRadius:99, padding:"2px 9px", fontSize:11, fontWeight:600, color:ROUTE_COLORS[i%ROUTE_COLORS.length] }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:ROUTE_COLORS[i%ROUTE_COLORS.length], display:"inline-block" }}/>
                          {e.id}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", height:310 }}>
                    <MapaSV envios={envios}/>
                  </div>
                  <div style={{ marginTop:6, fontSize:11, color:C.gray }}>
                    ● A = origen &nbsp;■ B = destino &nbsp;— cada color es un paquete EN RUTA
                  </div>
                </div>
              </div>
            </>
          )}

          {section==="conductores" && (
            <div>
              <div style={{ fontWeight:600, fontSize:18, marginBottom:16 }}>🐯 Conductores</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
                {DRIVERS.map(d=>{
                  const asignado = envios.find(e=>e.driver===d&&e.estado==="EN_RUTA");
                  return (
                    <div key={d} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:14 }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>🐯 {d}</div>
                      <div style={{ fontSize:12, marginTop:4 }}>
                        {asignado
                          ? <span style={{ color:C.blue, fontWeight:600 }}>● En ruta · {asignado.id}</span>
                          : <span style={{ color:C.green }}>● Disponible</span>}
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
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead><tr style={{ background:C.grayLight, color:C.gray, fontSize:11, fontWeight:600 }}>
                    {["ID","Cliente","Teléfono","Producto","Destino","Estado","Driver"].map(h=><th key={h} style={{ padding:"9px 12px", textAlign:"left" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {envios.map(e=>(
                      <tr key={e.id} style={{ borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 12px", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{e.id}</td>
                        <td style={{ padding:"10px 12px", fontSize:12 }}>{e.cliente}</td>
                        <td style={{ padding:"10px 12px", fontSize:12 }}>
                          {e.telefono ? <a href={`tel:${e.telefono}`} style={{ color:C.green, textDecoration:"none", fontWeight:600 }}>{e.telefono}</a> : <span style={{ color:"#9CA3AF" }}>—</span>}
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

          {section==="config" && (
            <div style={{ maxWidth:400 }}>
              <div style={{ fontWeight:600, fontSize:18, marginBottom:16 }}>⚙️ Configuración</div>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <div style={{ fontWeight:600, marginBottom:4 }}>Sistema</div>
                <div style={{ fontSize:13, color:C.gray }}>Hundred Acre Wood Logistics v1.0</div>
                <div style={{ fontSize:13, color:C.gray, marginTop:2 }}>Backend: .NET 8 · DB: PostgreSQL 15</div>
                <hr style={{ border:"none", borderTop:`1px solid ${C.border}`, margin:"14px 0" }}/>
                <div style={{ fontSize:13, color:C.gray }}>🦉 Swagger: localhost:5288/swagger</div>
                <hr style={{ border:"none", borderTop:`1px solid ${C.border}`, margin:"14px 0" }}/>
                <div style={{ fontSize:12, color:C.gray, fontWeight:600, marginBottom:6 }}>Ubicaciones reconocidas</div>
                <div style={{ fontSize:11, color:C.gray, lineHeight:1.8 }}>
                  14 departamentos · municipios y colonias de El Salvador precargados.<br/>
                  El formulario de nuevo envío usa selectores en cascada: Departamento → Municipio → Colonia.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: DRIVER
// ══════════════════════════════════════════════════════════════════════════════
function DriverView({ envios, setEnvios, userName, onLogout }) {
  const miNombre   = userName || "";
  const activos    = envios.filter(e =>
    DRIVER_ACTIVO.includes(e.estado) &&
    (e.driver===miNombre || e.driver==="" || !miNombre.startsWith("Tigger-"))
  );
  const entregados = envios.filter(e =>
    e.estado==="ENTREGADO" && (e.driver===miNombre || !miNombre.startsWith("Tigger-"))
  );

  const [mapaAbierto, setMapaAbierto] = useState(null);
  const [fotos,       setFotos]       = useState({});

  const avanzar = id => setEnvios(p => p.map(e =>
    e.id===id && ESTADO_NEXT[e.estado]
      ? { ...e, estado:ESTADO_NEXT[e.estado], hora:{ ...e.hora, [ESTADO_NEXT[e.estado]]:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) } }
      : e
  ));

  const marcarFallido = id => setEnvios(p => p.map(e =>
    e.id===id && (e.estado==="EN_RUTA"||e.estado==="EN_ALMACEN")
      ? { ...e, estado:"FALLIDO", hora:{ ...e.hora, FALLIDO:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) } }
      : e
  ));

  return (
    <div style={{ minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background:"#FFF5E6", padding:"20px 20px 16px", borderBottom:`1px solid #F5E6B4` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ background:"rgba(196,127,0,0.10)", borderRadius:12, padding:"10px 16px", border:"1px solid rgba(196,127,0,0.2)" }}>
            <div style={{ color:"#412402", fontWeight:700, fontSize:16 }}>🐯 App Tigger</div>
            <div style={{ color:"#855010", fontSize:12 }}>Conductor · {userName}</div>
          </div>
          <button onClick={onLogout} style={{ background:"rgba(196,127,0,0.12)", color:"#633806", border:"1px solid rgba(196,127,0,0.35)", borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
            Salir
          </button>
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
            No hay envíos activos. Rabbit debe recibir en bodega y despachar primero.
          </div>
        )}

        {activos.map(e=>(
          <div key={e.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderLeft:`4px solid ${ESTADO_COLORS[e.estado]}`, borderRadius:14, padding:16, marginBottom:12 }}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ fontSize:26 }}>🍯</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{e.producto||"Paquete"}</div>
                <div style={{ fontSize:12, color:C.gray }}>#{e.id} · Para: {e.cliente} 🐷</div>
                <div style={{ fontSize:12, color:C.gray }}>📍 {e.destino}</div>
                {e.telefono && (
                  <a href={`tel:${e.telefono}`}
                    style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, background:C.greenLight, color:C.green, border:`1px solid ${C.green}33`, borderRadius:8, padding:"5px 10px", textDecoration:"none", fontSize:12, fontWeight:600 }}>
                    📞 Llamar al cliente — {e.telefono}
                  </a>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:6, margin:"12px 0 10px", alignItems:"center", flexWrap:"wrap" }}>
              {["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"].map((st,i,arr)=>{
                const cur = arr.indexOf(e.estado); const done = i<=cur; const isCur = i===cur;
                return (
                  <div key={st} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ background:isCur?ESTADO_COLORS[st]:done?ESTADO_COLORS[st]+"66":"#E5E7EB", color:C.white, borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                      {["Creado","Almacén","En ruta","Entregado"][i]}{done&&" ✓"}
                    </div>
                    {i<arr.length-1 && <div style={{ width:12, height:2, background:done&&i<cur?ESTADO_COLORS[e.estado]:"#E5E7EB" }}/>}
                  </div>
                );
              })}
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {e.estado==="EN_ALMACEN" && (
                <>
                  <button onClick={()=>avanzar(e.id)}
                    style={{ background:`linear-gradient(135deg,${C.blue},${C.blueDark})`, color:C.white, border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    🚗 Marcar EN RUTA
                  </button>
                  <button onClick={()=>marcarFallido(e.id)}
                    style={{ background:`linear-gradient(135deg,${C.red},#B91C1C)`, color:C.white, border:"none", borderRadius:10, padding:"10px 14px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    ❌ Fallido
                  </button>
                </>
              )}
              {e.estado==="EN_RUTA" && (
                <>
                  <button onClick={()=>avanzar(e.id)}
                    style={{ background:`linear-gradient(135deg,${C.green},#15803D)`, color:C.white, border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Marcar entregado ✅
                  </button>
                  <button onClick={()=>marcarFallido(e.id)}
                    style={{ background:`linear-gradient(135deg,${C.red},#B91C1C)`, color:C.white, border:"none", borderRadius:10, padding:"10px 14px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    ❌ Fallido
                  </button>
                  <label style={{ background:C.grayLight, color:C.gray, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4 }}>
                    📷 Foto
                    <input type="file" accept="image/*" capture="environment" style={{ display:"none" }}
                      onChange={ev=>{
                        const file = ev.target.files?.[0]; if (!file) return;
                        const url = URL.createObjectURL(file);
                        setFotos(prev=>({...prev,[e.id]:url})); ev.target.value="";
                      }}/>
                  </label>
                </>
              )}
              <button onClick={()=>setMapaAbierto(mapaAbierto===e.id?null:e.id)}
                style={{ background:C.blueLight, color:C.blue, border:`1px solid ${C.blue}33`, borderRadius:10, padding:"10px 12px", fontSize:13, cursor:"pointer", fontWeight:600 }}>
                {mapaAbierto===e.id?"🗺 Ocultar ruta":"🗺 Ver ruta A→B"}
              </button>
            </div>

            {mapaAbierto===e.id && (
              <div style={{ marginTop:12, borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}`, height:240 }}>
                <MapaAB origen={e.origen||"Bodega central"} destino={e.destino} />
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

        <div style={{ background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:12, padding:"12px 14px", marginTop:8, fontSize:12 }}>
          <div style={{ fontWeight:600, color:"#C2410C", marginBottom:3 }}>⚠️ Regla del bosque</div>
          <div style={{ color:"#92400E" }}>No puedes saltar estados. Si un paquete está en almacén, <strong>primero</strong> marcalo "en ruta" antes de "entregado".</div>
        </div>

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

        {envios.filter(e=>e.estado==="FALLIDO"&&(e.driver===miNombre||!miNombre.startsWith("Tigger-"))).length>0 && (
          <>
            <div style={{ fontWeight:600, fontSize:14, color:C.red, margin:"20px 0 10px" }}>❌ Fallidos</div>
            {envios.filter(e=>e.estado==="FALLIDO"&&(e.driver===miNombre||!miNombre.startsWith("Tigger-"))).map(e=>(
              <div key={e.id} style={{ background:C.redLight, border:`1px solid ${C.red}33`, borderRadius:12, padding:"12px 16px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{e.id}</span>
                  <span style={{ color:C.red, fontWeight:600, fontSize:13 }}>❌ Fallido</span>
                </div>
                <div style={{ fontSize:12, color:C.gray, marginTop:3 }}>{e.producto} · {e.destino}</div>
                {e.hora?.FALLIDO && <div style={{ fontSize:11, color:C.red, marginTop:2 }}>Registrado: {e.hora.FALLIDO}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [role,     setRole]   = useState(null);
  const [userName, setUser]   = useState("");
  const [envios,   setEnvios] = useState(ENVIOS_INIT);

  const handleLogin  = (r, name) => { setRole(r); setUser(name); };
  const handleLogout = ()        => { setRole(null); setUser(""); };

  if (!role)           return <LoginView onLogin={handleLogin}/>;
  if (role==="piglet") return <PigletView  envios={envios} onLogout={handleLogout}/>;
  if (role==="admin")  return <AdminView   envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  if (role==="driver") return <DriverView  envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  return null;
}