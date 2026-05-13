import { useState, useEffect } from 'react';
import { shipmentService, authService } from '../services/api';

const STATUS_MAP = {0:'CREADO',1:'EN_ALMACEN',2:'EN_RUTA',3:'ENTREGADO',4:'FALLIDO'};
const getStatus = (s) => STATUS_MAP[s] ?? s;

export default function DriverApp() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading]       = useState(true);
  const user = JSON.parse(localStorage.getItem('hawl_user') || '{}');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await shipmentService.myDeliveries();
      setDeliveries(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function markEnRoute(id) {
    try {
      await shipmentService.updateStatus(id, 'EN_RUTA', 'Tigger salió a entregar');
      load();
    } catch (err) { alert('Error: ' + err.message); }
  }

  async function markDelivered(id) {
    try {
      await shipmentService.updateStatus(id, 'ENTREGADO', 'Tigger entregó el paquete');
      load();
    } catch (err) { alert('Error: ' + err.message); }
  }

  function handleLogout() {
    authService.logout();
    window.location.href = '/login';
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#FFF5E6', fontSize:32 }}>
      🍯 Cargando...
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#FFF5E6', fontFamily:'system-ui' }}>

      <div style={{ background:'#EF9F27', padding:'16px 14px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:16, fontWeight:500, color:'white', margin:0 }}>🐯 App Tigger</p>
          <p style={{ fontSize:11, color:'#FAEEDA', margin:0 }}>Conductor · {user.name || 'Tigger'}</p>
        </div>
        <button onClick={handleLogout} style={{ padding:'5px 12px', background:'rgba(255,255,255,0.2)', color:'white', border:'none', borderRadius:6, cursor:'pointer', fontSize:11 }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ padding:'12px 12px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:500, color:'#412402', margin:0 }}>Mis entregas de hoy</p>
        <span style={{ fontSize:11, background:'#EF9F27', color:'white', padding:'2px 8px', borderRadius:20 }}>
          {deliveries.length} pendientes
        </span>
      </div>

      {deliveries.length === 0 && (
        <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
          <div style={{ fontSize:40 }}>🌿</div>
          <p>No tenés entregas pendientes</p>
        </div>
      )}

      <div style={{ padding:'0 12px 12px' }}>
        {deliveries.map(shipment => {
          const statusKey = getStatus(shipment.status);
          const STEPS = ['CREADO','EN_ALMACEN','EN_RUTA','ENTREGADO'];
          const LABELS = { CREADO:'Creado', EN_ALMACEN:'Almacén', EN_RUTA:'En ruta', ENTREGADO:'Entregado' };
          const currentIdx = STEPS.indexOf(statusKey);
          return (
            <div key={shipment.id} style={{ background:'white', border:'0.5px solid #E8E5DC', borderRadius:12, padding:12, marginBottom:10, borderLeft:'3px solid #EF9F27' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:10 }}>
                <span style={{ fontSize:18 }}>🍯</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:'#412402', margin:0 }}>{shipment.description}</p>
                  <p style={{ fontSize:11, color:'#888', margin:'2px 0 0' }}>#{shipment.trackingNumber} · Para: {shipment.receiverName}</p>
                  <p style={{ fontSize:11, color:'#888', margin:'2px 0 0' }}>📍 {shipment.destinationAddress}</p>
                  <p style={{ fontSize:11, color:'#888', margin:'2px 0 0' }}>📱 {shipment.receiverPhone}</p>
                </div>
              </div>

              <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                {STEPS.map((step, i) => {
                  const isDone   = i < currentIdx;
                  const isActive = i === currentIdx;
                  return (
                    <div key={step} style={{
                      flex:1, padding:'6px 4px', fontSize:10, borderRadius:6, textAlign:'center',
                      background: isDone ? '#E1F5EE' : isActive ? '#EF9F27' : '#F5F5F0',
                      color: isDone ? '#0F6E56' : isActive ? 'white' : '#aaa',
                      border: `0.5px solid ${isDone ? '#9FE1CB' : isActive ? '#EF9F27' : '#e8e8e8'}`
                    }}>
                      {isDone ? '✓ ' : ''}{LABELS[step]}
                    </div>
                  );
                })}
              </div>

              <div style={{ display:'flex', gap:6 }}>
                {statusKey === 'EN_ALMACEN' && (
                  <button onClick={() => markEnRoute(shipment.id)}
                    style={{ flex:1, padding:8, fontSize:12, background:'#FAEEDA', color:'#633806', border:'0.5px solid #FAC775', borderRadius:8, cursor:'pointer', fontWeight:500 }}>
                    🚗 Salir a entregar
                  </button>
                )}
                {statusKey === 'EN_RUTA' && (
                  <button onClick={() => markDelivered(shipment.id)}
                    style={{ flex:1, padding:8, fontSize:12, background:'#E1F5EE', color:'#0F6E56', border:'0.5px solid #9FE1CB', borderRadius:8, cursor:'pointer', fontWeight:500 }}>
                    ✅ Marcar entregado
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ margin:'0 12px 12px', padding:10, background:'#FCEBEB', border:'0.5px solid #F7C1C1', borderRadius:8 }}>
        <p style={{ fontSize:12, color:'#A32D2D', fontWeight:500, margin:0 }}>⚠️ Regla del bosque</p>
        <p style={{ fontSize:11, color:'#791F1F', margin:'3px 0 0' }}>No podés saltar estados. Almacén → En ruta → Entregado.</p>
      </div>
    </div>
  );
}