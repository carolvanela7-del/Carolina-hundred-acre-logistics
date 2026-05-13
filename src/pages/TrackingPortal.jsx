import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { shipmentService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const STATUS_MAP = {0:'CREADO',1:'EN_ALMACEN',2:'EN_RUTA',3:'ENTREGADO',4:'FALLIDO'};
const getStatus = (s) => STATUS_MAP[s] ?? s;

const STEPS = [
  { key:'CREADO',     label:'Paquete creado', icon:'📦' },
  { key:'EN_ALMACEN', label:'En almacén',      icon:'🐰' },
  { key:'EN_RUTA',    label:'En ruta',          icon:'🐯' },
  { key:'ENTREGADO',  label:'Entregado',        icon:'✅' }
];

export default function TrackingPortal() {
  const [query,   setQuery]   = useState('');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const track = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const data = await shipmentService.track(query.trim());
      setResult(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const statusKey   = result ? getStatus(result.status) : null;
  const currentStep = STEPS.findIndex(s => s.key === statusKey);

  return (
    <div style={{ minHeight:'100vh', background:'#FFF5E6', fontFamily:'system-ui' }}>

      <div style={{ background:'#EF9F27', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>🍯</span>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'white', margin:0 }}>Hundred Acre Wood Logistics</p>
            <p style={{ fontSize:11, color:'#FAEEDA', margin:0 }}>Rastreá tu paquete</p>
          </div>
        </div>
        <button onClick={() => navigate('/login')}
          style={{ padding:'5px 12px', background:'rgba(255,255,255,0.2)', color:'white', border:'none', borderRadius:6, cursor:'pointer', fontSize:11 }}>
          Iniciar sesión
        </button>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'24px 16px' }}>

        <div style={{ textAlign:'center', marginBottom:24 }}>
          <p style={{ fontSize:28, margin:0 }}>🐷</p>
          <p style={{ fontSize:18, fontWeight:500, color:'#412402', margin:'4px 0' }}>¿Dónde está mi paquete?</p>
          <p style={{ fontSize:13, color:'#888', margin:0 }}>Ingresá tu número de guía</p>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && track()}
            placeholder="Ej: HAW-20260508-ABC123"
            style={{ flex:1, padding:'10px 14px', border:'1px solid #e8e8e8', borderRadius:8, fontSize:14, outline:'none', background:'white' }}
          />
          <button onClick={track} disabled={loading}
            style={{ padding:'10px 16px', background:'#EF9F27', color:'white', border:'none', borderRadius:8, fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
            {loading ? '...' : 'Rastrear 🔍'}
          </button>
        </div>

        {error && (
          <div style={{ background:'#FCEBEB', color:'#A32D2D', padding:14, borderRadius:10, marginBottom:16, fontSize:13 }}>
            {error}
          </div>
        )}

        {result && (
          <>
            <div style={{ background:'white', border:'0.5px solid #E8E5DC', borderRadius:12, padding:16, marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, paddingBottom:12, borderBottom:'0.5px solid #F5F0E8' }}>
                <span style={{ fontSize:20 }}>🍯</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:'#412402', margin:0 }}>{result.description}</p>
                  <p style={{ fontSize:11, color:'#888', margin:'2px 0 0' }}>Guía: #{result.trackingNumber}</p>
                </div>
                <div style={{ marginLeft:'auto' }}>
                  <span style={{ fontSize:11, padding:'4px 10px', background:'#EAF3DE', color:'#3B6D11', borderRadius:20, fontWeight:500 }}>
                    {statusKey}
                  </span>
                </div>
              </div>

              <p style={{ fontSize:12, color:'#888', marginBottom:14, margin:'0 0 14px' }}>Historial del paquete</p>

              {STEPS.map((step, i) => {
                const isDone    = i < currentStep;
                const isActive  = i === currentStep;
                const isPending = i > currentStep;
                return (
                  <div key={step.key} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13,
                        background: isDone ? '#EAF3DE' : isActive ? '#EF9F27' : '#F5F5F0',
                        color: isDone ? '#3B6D11' : isActive ? 'white' : '#aaa' }}>
                        {isDone ? '✓' : isActive ? step.icon : '○'}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ width:2, height:32, background: isDone ? '#EAF3DE' : '#F5F5F0', margin:'2px 0' }}/>
                      )}
                    </div>
                    <div style={{ paddingTop:4, marginBottom:8 }}>
                      <p style={{ fontSize:13, fontWeight: isActive ? 500 : 400,
                        color: isPending ? '#aaa' : isActive ? '#BA7517' : '#412402', margin:0 }}>
                        {step.label}{isActive ? ' — ahora' : ''}
                      </p>
                      {result.driver && isActive && statusKey === 'EN_RUTA' && (
                        <p style={{ fontSize:11, color:'#888', margin:'2px 0 0' }}>
                          Conductor: {result.driver.initial}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {result.destinationLat && (
              <div style={{ borderRadius:12, overflow:'hidden', height:220, marginBottom:14 }}>
                <MapContainer center={[result.destinationLat, result.destinationLng]} zoom={12} style={{ height:'100%', width:'100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap"/>
                  {result.originLat && <Marker position={[result.originLat, result.originLng]}><Popup>🍯 Origen</Popup></Marker>}
                  <Marker position={[result.destinationLat, result.destinationLng]}><Popup>🐷 Destino</Popup></Marker>
                  {result.originLat && (
                    <Polyline positions={[[result.originLat, result.originLng],[result.destinationLat, result.destinationLng]]} color="#EF9F27" weight={3} dashArray="8,6"/>
                  )}
                </MapContainer>
              </div>
            )}

            <div style={{ background:'#FAEEDA', border:'0.5px solid #FAC775', borderRadius:8, padding:'10px 14px' }}>
              <p style={{ fontSize:12, color:'#412402', fontWeight:500, margin:0 }}>🔒 Tu privacidad</p>
              <p style={{ fontSize:11, color:'#633806', margin:'2px 0 0' }}>No necesitás cuenta. Solo ves el estado de TU paquete. El nombre completo del conductor no se muestra.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}