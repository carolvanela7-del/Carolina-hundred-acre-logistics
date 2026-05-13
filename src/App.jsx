import { useState, useEffect, useRef } from "react";

// ─── COORDENADAS El Salvador — ciudades reales ─────────────────────────────
const SV_COORDS = {
  "Casa del roble, bosque sur":   [13.6929, -89.2182],
  "Árbol grande, bosque norte":   [13.9942, -89.5597],
  "Prado de Eeyore":              [13.4745, -88.1775],
  "Casa de Kanga":                [13.8206, -89.0997],
  "Bodega central":               [13.7034, -89.2182],
  "Huerto de Rabbit":             [13.6762, -89.2379],
};

// ─── PALETA ────────────────────────────────────────────────────────────────────
const C = {
  honey:     "#F0A500",
  honeyDark: "#C47F00",
  honeyLight:"#FFF8E7",
  honeyBg:   "#FEF3D0",
  blue:      "#2563EB",
  blueDark:  "#1D4ED8",
  blueLight: "#EFF6FF",
  green:     "#16A34A",
  greenLight:"#F0FDF4",
  gray:      "#6B7280",
  grayLight: "#F9FAFB",
  border:    "#E5E7EB",
  text:      "#111827",
  textSoft:  "#374151",
  red:       "#DC2626",
  redLight:  "#FEF2F2",
  white:     "#FFFFFF",
};

// ─── ESTADO COMPARTIDO ─────────────────────────────────────────────────────────
const ESTADO_COLORS = { CREADO:"#9CA3AF", EN_ALMACEN:C.honey, EN_RUTA:C.blue, ENTREGADO:C.green, FALLIDO:C.red };
const ESTADO_NEXT   = { CREADO:"EN_ALMACEN", EN_ALMACEN:"EN_RUTA", EN_RUTA:"ENTREGADO", ENTREGADO:null, FALLIDO:null };
const DRIVER_ACTIVO = ["EN_ALMACEN","EN_RUTA"];
const DRIVERS = Array.from({length:10},(_,i)=>`Tigger-${String(i+1).padStart(2,"0")}`);

const ENVIOS_INIT = [
  { id:"HAW001", cliente:"Piglet",  producto:"Tarro de miel × 3",  origen:"Bodega central",  destino:"Casa del roble, bosque sur",  estado:"EN_RUTA",    driver:"Tigger-03", hora:{ CREADO:"08:15", EN_ALMACEN:"09:00", EN_RUTA:"10:30" } },
  { id:"HAW002", cliente:"Owl",     producto:"Zanahorias × 10",    origen:"Huerto de Rabbit", destino:"Árbol grande, bosque norte",  estado:"EN_ALMACEN", driver:"",          hora:{ CREADO:"09:00", EN_ALMACEN:"09:45" } },
  { id:"HAW003", cliente:"Eeyore",  producto:"Globo azul × 1",     origen:"Bodega central",  destino:"Prado de Eeyore",             estado:"CREADO",     driver:"",          hora:{ CREADO:"10:00" } },
  { id:"HAW004", cliente:"Kanga",   producto:"Miel de trébol × 5", origen:"Bodega central",  destino:"Casa de Kanga",               estado:"ENTREGADO",  driver:"Tigger-07", hora:{ CREADO:"07:00", EN_ALMACEN:"07:30", EN_RUTA:"08:00", ENTREGADO:"09:15" } },
];

// ─── LEAFLET HELPER ────────────────────────────────────────────────────────────
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

// ─── MAPA ADMIN — envíos activos sobre El Salvador ────────────────────────────
function MapaSV({ envios }) {
  const mapRef     = useRef(null);
  const instanceRef= useRef(null);

  useEffect(() => {
    ensureLeaflet(() => {
      if (!mapRef.current) return;
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
      const L   = window.L;
      const map = L.map(mapRef.current, { zoomControl:true }).setView([13.7942, -88.8965], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:18,
      }).addTo(map);

      envios.filter(e => e.estado === "EN_RUTA").forEach(e => {
        const coords = SV_COORDS[e.destino];
        if (!coords) return;
        const icon = L.divIcon({
          html:`<div style="background:#2563EB;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${e.id.replace("HAW","")}</div>`,
          className:"", iconSize:[28,28], iconAnchor:[14,14],
        });
        L.marker(coords, { icon }).addTo(map)
          .bindPopup(`<b>${e.id}</b><br>${e.producto||"Paquete"}<br>📍 ${e.destino}<br>🐯 ${e.driver||"—"}`);
      });

      envios.filter(e => e.estado === "EN_ALMACEN").forEach(e => {
        const coords = SV_COORDS["Bodega central"];
        if (!coords) return;
        const icon = L.divIcon({
          html:`<div style="background:#F0A500;color:white;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2)">📦</div>`,
          className:"", iconSize:[28,28], iconAnchor:[14,14],
        });
        L.marker(coords, { icon }).addTo(map).bindPopup(`<b>${e.id}</b><br>En bodega`);
      });

      instanceRef.current = map;
    });
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [envios]);

  return <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>;
}

// ─── MAPA A→B — Piglet y Tigger ───────────────────────────────────────────────
function MapaAB({ origen, destino }) {
  const mapRef     = useRef(null);
  const instanceRef= useRef(null);

  useEffect(() => {
    const coordA = SV_COORDS[origen]  || [13.7034, -89.2182];
    const coordB = SV_COORDS[destino] || [13.6929, -89.2182];

    ensureLeaflet(() => {
      if (!mapRef.current) return;
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
      const L   = window.L;
      const mid = [(coordA[0]+coordB[0])/2, (coordA[1]+coordB[1])/2];
      const map = L.map(mapRef.current, { zoomControl:true, scrollWheelZoom:false }).setView(mid, 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:18,
      }).addTo(map);

      const iconA = L.divIcon({ html:`<div style="background:#16A34A;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)">A</div>`, className:"", iconSize:[32,32], iconAnchor:[16,16] });
      const iconB = L.divIcon({ html:`<div style="background:#2563EB;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)">B</div>`, className:"", iconSize:[32,32], iconAnchor:[16,16] });

      L.marker(coordA, { icon:iconA }).addTo(map).bindPopup(`<b>📦 Origen</b><br>${origen}`).openPopup();
      L.marker(coordB, { icon:iconB }).addTo(map).bindPopup(`<b>🏠 Destino</b><br>${destino}`);
      L.polyline([coordA, coordB], { color:"#F0A500", weight:3, dashArray:"8 6", opacity:0.85 }).addTo(map);
      map.fitBounds([coordA, coordB], { padding:[30,30] });

      instanceRef.current = map;
    });
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, [origen, destino]);

  return <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>;
}

// ─── OSITO ANIMADO — nuevo diseño emoji minimalista ───────────────────────────
function HoneyBearAnim({ size=90, wiggle=false }) {
  return (
    <div style={{ position:"relative", height:70, display:"flex", alignItems:"flex-end", justifyContent:"center", marginBottom:4 }}>
      <style>{`
        @keyframes haBounce  { 0%,100%{transform:translateY(0px)} 40%{transform:translateY(-12px)} 60%{transform:translateY(-6px)} }
        @keyframes haPeek    { 0%,60%{transform:translateY(30px);opacity:0} 75%,100%{transform:translateY(0px);opacity:1} }
      `}</style>
      {/* Osito asomándose */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", zIndex:2, overflow:"hidden", height:36, width:40 }}>
        <div style={{ fontSize:26, lineHeight:1, animation:"haPeek 3s ease-in-out infinite" }}>🐻</div>
      </div>
      {/* Tarro rebotando */}
      <div style={{ fontSize:50, animation:"haBounce 3s ease-in-out infinite", zIndex:1, lineHeight:1 }}>🍯</div>
    </div>
  );
}

// ─── BADGE ESTADO ──────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const label = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado", FALLIDO:"Fallido ❌" };
  const col = ESTADO_COLORS[estado] || "#888";
  return (
    <span style={{ background:col+"22", color:col, border:`1px solid ${col}44`, borderRadius:99, padding:"2px 10px", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      {label[estado]}
    </span>
  );
}

// ─── STEPPER ───────────────────────────────────────────────────────────────────
function Stepper({ estado }) {
  const steps  = ["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"];
  const labels = { CREADO:"Creado", EN_ALMACEN:"En almacén", EN_RUTA:"En ruta", ENTREGADO:"Entregado" };
  const cur = steps.indexOf(estado);
  return (
    <div style={{ display:"flex", alignItems:"flex-start", margin:"12px 0" }}>
      {steps.map((st, i) => {
        const done   = i <= cur;
        const isLast = i === steps.length-1;
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

        {/* Osito + tarro animado */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <HoneyBearAnim />
          <p style={{ margin:"10px 0 3px", fontSize:19, color:"#412402", fontWeight:300, letterSpacing:"0.3px" }}>Hundred Acre Logistics</p>
          <p style={{ color:"#aaa", fontSize:12, margin:0, fontWeight:300 }}>Ingresa al sistema del bosque</p>
        </div>

        {/* Email */}
        <label style={{ fontSize:11, color:"#aaa", fontWeight:300, display:"block", marginBottom:5 }}>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="rabbit@hundredacre.com"
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #e8e8e8", borderRadius:8, fontSize:13, fontWeight:300, marginBottom:14, boxSizing:"border-box", outline:"none", background:"#f9fbff", color:"#333" }}/>

        {/* Contraseña */}
        <label style={{ fontSize:11, color:"#aaa", fontWeight:300, display:"block", marginBottom:5 }}>Contraseña</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #e8e8e8", borderRadius:8, fontSize:13, fontWeight:300, marginBottom:16, boxSizing:"border-box", outline:"none", background:"#f9fbff", color:"#333" }}/>

        {err && <div style={{ background:"#FEF2F2", color:"#DC2626", borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:300, marginBottom:12 }}>{err}</div>}

        {/* Botón */}
        <button onClick={login}
          style={{ width:"100%", padding:"12px", background:"#EF9F27", color:"#fff", border:"none", borderRadius:8, fontWeight:300, fontSize:14, letterSpacing:"0.3px", cursor:"pointer" }}>
          Entrar al bosque 🌳
        </button>

        {/* Demo box */}
        <div style={{ marginTop:16, padding:"12px", background:"#FAEEDA", borderRadius:8, fontSize:11, color:"#633806", fontWeight:300, lineHeight:2, textAlign:"center" }}>
          <span style={{ fontWeight:400 }}>Demo:</span><br/>
          🐰 rabbit@hundredacre.com / honey123<br/>
          🐯 tigger@hundredacre.com / honey123
        </div>

        {/* Link Piglet */}
        <p style={{ textAlign:"center", marginTop:14, fontSize:11, color:"#aaa", fontWeight:300 }}>
          ¿Sos cliente?{" "}
          <span style={{ color:"#EF9F27", cursor:"pointer" }} onClick={()=>onLogin("piglet","")}>
            Rastreá tu paquete →
          </span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: PIGLET — Portal de rastreo público
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
    <div style={{ minHeight:"100vh", background:C.grayLight }}>
      {/* Header */}
      <div style={{ background:C.honey, padding:"20px 24px 18px", position:"relative" }}>
        <div style={{ textAlign:"center" }}>
          <HoneyBearAnim size={52} wiggle />
          <h1 style={{ color:C.white, fontSize:22, fontWeight:700, margin:"8px 0 4px" }}>¿Dónde está mi paquete?</h1>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, margin:0 }}>Hundred Acre Wood Logistics</p>
        </div>
        <button onClick={onLogout} style={{ position:"absolute", top:16, right:20, background:"rgba(255,255,255,0.2)", color:C.white, border:"1px solid rgba(255,255,255,0.4)", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
          ← Salir
        </button>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"28px 16px" }}>
        {/* Buscador */}
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
            </div>

            {/* Mapa A→B */}
            <div style={{ background:C.white, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:14 }}>
              <div style={{ padding:"14px 18px 10px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:600, fontSize:14 }}>📍 Ruta de tu paquete</div>
                <div style={{ display:"flex", gap:12, fontSize:12 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ background:"#16A34A", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:10 }}>A</span>
                    {result.origen}
                  </span>
                  <span style={{ color:C.honey, fontWeight:700 }}>→</span>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ background:"#2563EB", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:10 }}>B</span>
                    {result.destino}
                  </span>
                </div>
              </div>
              <div style={{ height:240 }}>
                <MapaAB origen={result.origen} destino={result.destino}/>
              </div>
            </div>

            {/* Historial */}
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
              No necesitás crear cuenta. Solo ves el estado de TU paquete. El nombre completo del conductor no se muestra.
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
// VISTA: ADMIN — Rabbit
// ══════════════════════════════════════════════════════════════════════════════
function AdminView({ envios, setEnvios, userName, onLogout }) {
  const [section,     setSection]     = useState("paquetes");
  const [driverSel,   setDriverSel]   = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form,        setForm]        = useState({ cliente:"", producto:"", origen:"", destino:"" });
  const [formErr,     setFormErr]     = useState("");

  const crearPaquete = () => {
    if (!form.cliente.trim()||!form.producto.trim()||!form.origen.trim()||!form.destino.trim())
      return setFormErr("Completá todos los campos.");
    const num   = String(envios.length+1).padStart(3,"0");
    const nuevo = { id:`HAW${num}`, ...form, estado:"CREADO", driver:"", hora:{ CREADO:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) } };
    setEnvios(p=>[...p,nuevo]);
    setForm({ cliente:"", producto:"", origen:"", destino:"" });
    setFormErr(""); setMostrarForm(false);
  };

  const recibirBodega = id => setEnvios(p=>p.map(e=>
    e.id===id&&e.estado==="CREADO"
      ? {...e, estado:"EN_ALMACEN", hora:{...e.hora, EN_ALMACEN:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));

  const despachar = id => {
    const dr = driverSel[id];
    if (!dr) return alert("Seleccioná un driver primero.");
    setEnvios(p=>p.map(e=>
      e.id===id&&e.estado==="EN_ALMACEN"
        ? {...e, estado:"EN_RUTA", driver:dr, hora:{...e.hora, EN_RUTA:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
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

  const activeEnvios   = envios.filter(e=>e.estado!=="ENTREGADO");
  const tiggersActivos = DRIVERS.filter(d=>envios.some(e=>e.driver===d&&e.estado==="EN_RUTA")).length;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ width:200, background:C.white, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"18px 16px 12px", borderBottom:`1px solid ${C.border}` }}>
          <HoneyBearAnim size={38} />
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:4 }}>Hundred Acre Wood</div>
          <div style={{ fontSize:11, color:C.gray }}>Panel de despacho — Owl Admin</div>
        </div>
        <div style={{ padding:"10px 0", flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", letterSpacing:1, padding:"6px 16px" }}>MENÚ</div>
          {MENU.map(m=>(
            <button key={m.id} onClick={()=>setSection(m.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 16px", border:"none", background:section===m.id?C.honeyLight:"none", color:section===m.id?C.honeyDark:C.textSoft, fontWeight:section===m.id?700:400, fontSize:13.5, cursor:"pointer", borderLeft:section===m.id?`3px solid ${C.honey}`:"3px solid transparent", textAlign:"left" }}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, fontSize:11 }}>
          <div style={{ color:C.green, fontWeight:600 }}>● Tigger disponible</div>
          <div style={{ color:C.gray, marginTop:2 }}>{tiggersActivos} envíos en ruta</div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, color:C.gray }}>Panel de despacho — Owl Admin</span>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:13, color:C.textSoft }}>🐰 {userName}</span>
            <div style={{ width:30, height:30, borderRadius:"50%", background:C.honey, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>R</div>
            <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer", color:C.gray }}>Cerrar sesión</button>
          </div>
        </div>

        {/* Main */}
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
                      style={{ background:C.honey, color:C.white, border:"none", borderRadius:8, padding:"7px 14px", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                      {mostrarForm?"✕ Cancelar":"＋ Nuevo envío"}
                    </button>
                  </div>

                  {mostrarForm && (
                    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14, borderLeft:`4px solid ${C.honey}` }}>
                      <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>📦 Registrar nuevo paquete</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                        {[["cliente","Cliente / destinatario","Ej: Piglet"],["producto","Producto","Ej: Tarro de miel × 3"],["origen","Origen","Ej: Bodega central"],["destino","Destino","Ej: Casa del roble, bosque sur"]].map(([k,l,ph])=>(
                          <div key={k}>
                            <label style={{ fontSize:11, fontWeight:600, color:C.gray, display:"block", marginBottom:3 }}>{l}</label>
                            <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}
                              style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, boxSizing:"border-box", outline:"none" }}/>
                          </div>
                        ))}
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
                            {["ID","Destino","Estado","Driver","Acción"].map(h=>(
                              <th key={h} style={{ padding:"9px 12px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeEnvios.map(e=>(
                            <tr key={e.id} style={{ borderTop:`1px solid ${C.border}` }}>
                              <td style={{ padding:"11px 12px", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{e.id}</td>
                              <td style={{ padding:"11px 12px", fontSize:12 }}>{e.destino}</td>
                              <td style={{ padding:"11px 12px" }}><EstadoBadge estado={e.estado}/></td>
                              <td style={{ padding:"11px 12px", fontSize:12, color:e.driver?C.text:"#9CA3AF" }}>{e.driver||"—"}</td>
                              <td style={{ padding:"11px 12px" }}>
                                {e.estado==="CREADO" && (
                                  <button onClick={()=>recibirBodega(e.id)}
                                    style={{ background:C.honeyLight, color:C.honeyDark, border:`1px solid ${C.honey}66`, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                                    📦 Recibir en bodega
                                  </button>
                                )}
                                {e.estado==="EN_ALMACEN" && (
                                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                    <select value={driverSel[e.id]||""} onChange={ev=>setDriverSel(p=>({...p,[e.id]:ev.target.value}))}
                                      style={{ padding:"5px 8px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:12, outline:"none" }}>
                                      <option value="">Asignar driver…</option>
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

                {/* Mapa */}
                <div>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:10 }}>Mapa del bosque 🇸🇻</div>
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", height:320 }}>
                    <MapaSV envios={envios}/>
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:C.gray }}>📍 Paquetes EN RUTA en el mapa</div>
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
                    {["ID","Cliente","Producto","Destino","Estado","Driver"].map(h=><th key={h} style={{ padding:"9px 12px", textAlign:"left" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {envios.map(e=>(
                      <tr key={e.id} style={{ borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 12px", fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{e.id}</td>
                        <td style={{ padding:"10px 12px", fontSize:12 }}>{e.cliente}</td>
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
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VISTA: DRIVER — Tigger
// ══════════════════════════════════════════════════════════════════════════════
function DriverView({ envios, setEnvios, userName, onLogout }) {
  const miNombre   = userName || "";
  const activos    = envios.filter(e =>
    DRIVER_ACTIVO.includes(e.estado) &&
    (e.driver===miNombre || e.driver==="" || !miNombre.startsWith("Tigger-"))
  );
  const entregados = envios.filter(e =>
    e.estado==="ENTREGADO" &&
    (e.driver===miNombre || !miNombre.startsWith("Tigger-"))
  );

  const [mapaAbierto, setMapaAbierto] = useState(null);
  const [fotos,       setFotos]       = useState({});

  const avanzar = id => setEnvios(p=>p.map(e=>
    e.id===id && ESTADO_NEXT[e.estado]
      ? {...e, estado:ESTADO_NEXT[e.estado], hora:{...e.hora, [ESTADO_NEXT[e.estado]]:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));

  const marcarFallido = id => setEnvios(p=>p.map(e=>
    e.id===id && (e.estado==="EN_RUTA"||e.estado==="EN_ALMACEN")
      ? {...e, estado:"FALLIDO", hora:{...e.hora, FALLIDO:new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}}
      : e
  ));

  return (
    <div style={{ minHeight:"100vh", background:C.grayLight, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background:`linear-gradient(135deg,${C.blue},${C.green})`, padding:"20px 20px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"10px 16px", display:"inline-block" }}>
            <div style={{ color:C.white, fontWeight:700, fontSize:16 }}>🐯 App Tigger</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Conductor · {userName}</div>
          </div>
          <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.2)", color:C.white, border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer" }}>
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
                <div style={{ fontSize:12, color:C.gray }}>{e.destino}</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:6, margin:"12px 0 10px", alignItems:"center", flexWrap:"wrap" }}>
              {["CREADO","EN_ALMACEN","EN_RUTA","ENTREGADO"].map((st,i,arr)=>{
                const cur  = arr.indexOf(e.estado);
                const done = i<=cur;
                const isCur= i===cur;
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
                  {/* Botón foto — abre cámara en móvil */}
                  <label style={{ background:C.grayLight, color:C.gray, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4 }}>
                    📷 Foto
                    <input type="file" accept="image/*" capture="environment" style={{ display:"none" }}
                      onChange={ev=>{
                        const file = ev.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setFotos(prev=>({...prev,[e.id]:url}));
                        ev.target.value="";
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
              <div style={{ marginTop:12, borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}`, height:220 }}>
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

        {/* FALLIDOS */}
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
// APP ROOT — todo en un solo archivo, sin react-router
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [role,     setRole]   = useState(null);
  const [userName, setUser]   = useState("");
  const [envios,   setEnvios] = useState(ENVIOS_INIT);

  const handleLogin  = (r, name) => { setRole(r); setUser(name); };
  const handleLogout = ()        => { setRole(null); setUser(""); };

  if (!role)             return <LoginView onLogin={handleLogin}/>;
  if (role==="piglet")   return <PigletView  envios={envios} onLogout={handleLogout}/>;
  if (role==="admin")    return <AdminView   envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  if (role==="driver")   return <DriverView  envios={envios} setEnvios={setEnvios} userName={userName} onLogout={handleLogout}/>;
  return null;
}
