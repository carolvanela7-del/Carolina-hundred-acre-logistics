import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { shipmentService, driverService } from '../services/api';
import 'leaflet/dist/leaflet.css';

const STATUS_MAP = { 0: 'CREADO', 1: 'EN_ALMACEN', 2: 'EN_RUTA', 3: 'ENTREGADO', 4: 'FALLIDO' };
const STATUS_COLORS = {
  CREADO:     { bg: '#E6F1FB', text: '#185FA5', label: '📦 Creado' },
  EN_ALMACEN: { bg: '#FAEEDA', text: '#633806', label: '🐰 En almacén' },
  EN_RUTA:    { bg: '#EAF3DE', text: '#3B6D11', label: '🐯 En ruta' },
  ENTREGADO:  { bg: '#E1F5EE', text: '#0F6E56', label: '✅ Entregado' },
  FALLIDO:    { bg: '#FCEBEB', text: '#A32D2D', label: '❌ Fallido' },
};
const getStatus = (s) => STATUS_MAP[s] ?? s;

export default function AdminPanel() {
  const [shipments, setShipments]   = useState([]);
  const [drivers, setDrivers]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [activeMenu, setActiveMenu] = useState('Paquetes');
  const [expanded, setExpanded]     = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [s, d] = await Promise.all([
        shipmentService.getAll(),
        driverService.getAvailable(),
      ]);
      setShipments(s);
      setDrivers(d);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleStatusChange(shipmentId, newStatus) {
    try {
      await shipmentService.updateStatus(shipmentId, newStatus);
      setExpanded(null);
      await loadData();
    } catch (err) { alert('Error: ' + (err.message || JSON.stringify(err))); }
  }

  async function handleAssignDriver(shipmentId, driverId) {
    if (!driverId) return;
    try {
      await shipmentService.assignDriver(shipmentId, driverId);
      setExpanded(null);
      await loadData();
    } catch (err) { alert('Error: ' + err.message); }
  }

  function handleLogout() {
    localStorage.removeItem('hawl_token');
    localStorage.removeItem('hawl_user');
    window.location.href = '/login';
  }

  function toggleExpand(shipment) {
    setExpanded(prev => (prev === shipment.id ? null : shipment.id));
    setSelected(prev => (prev?.id === shipment.id ? null : shipment));
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FFFBF5', fontSize: 32 }}>
      🍯 Cargando...
    </div>
  );

  const stats = [
    { label: 'Total hoy',  value: shipments.length,                                                  sub: 'paquetes',      color: '#333' },
    { label: 'En ruta',    value: shipments.filter(s => getStatus(s.status) === 'EN_RUTA').length,   sub: 'con Tigger 🐯', color: '#185FA5' },
    { label: 'Entregados', value: shipments.filter(s => getStatus(s.status) === 'ENTREGADO').length, sub: 'hoy',           color: '#0F6E56' },
    { label: 'Fallidos',   value: shipments.filter(s => getStatus(s.status) === 'FALLIDO').length,   sub: 'revisar',       color: '#A32D2D' },
  ];

  const badges = [
    { status: 'CREADO',     bg: '#E6F1FB', text: '#185FA5', label: '📦 Creado' },
    { status: 'EN_ALMACEN', bg: '#FAEEDA', text: '#633806', label: '🐰 En almacén' },
    { status: 'EN_RUTA',    bg: '#EAF3DE', text: '#3B6D11', label: '🐯 En ruta' },
    { status: 'ENTREGADO',  bg: '#E1F5EE', text: '#0F6E56', label: '✅ Entregado' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui', background: '#FFFBF5' }}>

      <div style={{ background: '#FAEEDA', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '0.5px solid #FAC775', flexShrink: 0 }}>
        <span style={{ fontSize: 20 }}>🦉</span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#412402', margin: 0 }}>Hundred Acre Wood Logistics</p>
          <p style={{ fontSize: 11, color: '#633806', margin: 0 }}>Panel de despacho — Owl Admin</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#633806' }}>🐰 Rabbit, jefe de bodega</span>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FAC775', color: '#412402', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}>R</div>
          <button onClick={handleLogout} style={{ padding: '5px 12px', background: '#EF9F27', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ width: 200, background: '#FAFAF8', borderRight: '0.5px solid #E8E5DC', display: 'flex', flexDirection: 'column', padding: '1rem', gap: 6, flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: '#999', padding: '4px 12px', marginBottom: 4 }}>MENÚ</p>
          {[['📦', 'Paquetes', shipments.length], ['🗺️', 'Mapa en vivo', null], ['🐯', 'Conductores', null], ['📋', 'Historial', null]].map(([icon, label, count]) => (
            <button key={label} onClick={() => setActiveMenu(label)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, fontSize: 13, color: activeMenu === label ? '#633806' : '#666', background: activeMenu === label ? '#FAEEDA' : 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: activeMenu === label ? 500 : 400 }}>
              {icon} {label}
              {count > 0 && <span style={{ marginLeft: 'auto', background: '#EF9F27', color: 'white', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>{count}</span>}
            </button>
          ))}
          <div style={{ marginTop: 'auto', padding: '8px 12px', background: '#FAEEDA', borderRadius: 8 }}>
            <p style={{ fontSize: 11, color: '#633806', fontWeight: 500, margin: 0 }}>Tigger disponible ✅</p>
            <p style={{ fontSize: 11, color: '#854F0B', margin: '2px 0 0' }}>{shipments.filter(s => getStatus(s.status) === 'EN_RUTA').length} envíos asignados</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>

          {activeMenu === 'Paquetes' && <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {stats.map(m => (
                <div key={m.label} style={{ background: '#F5F5F0', borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{m.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 500, color: m.color, margin: '4px 0' }}>{m.value}</p>
                  <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{m.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {badges.map(b => (
                <div key={b.status} style={{ background: b.bg, padding: 10, borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: b.text }}>{shipments.filter(x => getStatus(x.status) === b.status).length}</div>
                  <div style={{ fontSize: 11, color: b.text }}>{b.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1 }}>

              <div style={{ background: 'white', border: '0.5px solid #E8E5DC', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '0.5px solid #F5F0E8' }}>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: 0 }}>Paquetes activos</p>
                  <button onClick={() => setShowForm(true)} style={{ fontSize: 11, padding: '5px 12px', background: '#EF9F27', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ Nuevo envío</button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1, padding: '0 12px' }}>
                  {shipments.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', padding: 20, fontSize: 12 }}>No hay paquetes. ¡Creá el primero!</p>}
                  {shipments.map(shipment => {
                    const statusKey  = getStatus(shipment.status);
                    const st         = STATUS_COLORS[statusKey] || STATUS_COLORS.CREADO;
                    const emoji      = statusKey === 'CREADO' ? '📦' : statusKey === 'EN_ALMACEN' ? '🐰' : statusKey === 'EN_RUTA' ? '🐯' : statusKey === 'ENTREGADO' ? '✅' : '❌';
                    const isExpanded = expanded === shipment.id;

                    return (
                      <div key={shipment.id} style={{ borderBottom: '0.5px solid #F5F0E8' }}>
                        <div onClick={() => toggleExpand(shipment)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', cursor: 'pointer' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{emoji}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 500, fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shipment.description}</p>
                            <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0' }}>{shipment.senderName} → {shipment.receiverName} · #{shipment.trackingNumber}</p>
                          </div>
                          <span style={{ background: st.bg, color: st.text, padding: '3px 8px', borderRadius: 20, fontSize: 11, flexShrink: 0 }}>{st.label}</span>
                        </div>

                        {isExpanded && (
                          <div style={{ padding: '0 0 12px 42px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {statusKey === 'CREADO' && (
                              <button onClick={() => handleStatusChange(shipment.id, 'EN_ALMACEN')}
                                style={{ padding: '8px 14px', background: '#FAEEDA', color: '#633806', border: '1px solid #FAC775', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                                🐰 Recibir en bodega
                              </button>
                            )}
                            {statusKey === 'EN_ALMACEN' && (
                              <>
                                <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Asignar conductor:</p>
                                <select defaultValue="" onChange={e => handleAssignDriver(shipment.id, e.target.value)}
                                  style={{ padding: '8px', fontSize: 12, borderRadius: 8, border: '1px solid #FAC775', background: '#FAEEDA', color: '#633806', cursor: 'pointer' }}>
                                  <option value="" disabled>🐯 Seleccioná un conductor...</option>
                                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {drivers.length === 0 && <p style={{ fontSize: 11, color: '#A32D2D', margin: 0 }}>⚠️ No hay conductores disponibles</p>}
                              </>
                            )}
                            {statusKey === 'EN_RUTA' && (
                              <button onClick={() => handleStatusChange(shipment.id, 'ENTREGADO')}
                                style={{ padding: '8px 14px', background: '#E1F5EE', color: '#0F6E56', border: '1px solid #9FE1CB', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                                ✅ Marcar como entregado
                              </button>
                            )}
                            {(statusKey === 'ENTREGADO' || statusKey === 'FALLIDO') && (
                              <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>Este paquete ya está cerrado.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'white', border: '0.5px solid #E8E5DC', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #F5F0E8' }}>
                  <p style={{ fontWeight: 500, fontSize: 13, margin: 0 }}>
                    {selected ? `Mapa — ${selected.description}` : 'Mapa del bosque — clic en paquete para ver ruta'}
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <MapContainer center={[13.6929, -89.2182]} zoom={9} style={{ height: '100%', width: '100%', minHeight: 250 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                    {shipments.map(s => s.destinationLat && (
                      <Marker key={s.id} position={[s.destinationLat, s.destinationLng]}>
                        <Popup><strong>{s.description}</strong><br />{s.trackingNumber}</Popup>
                      </Marker>
                    ))}
                    {selected?.originLat && selected?.destinationLat && (
                      <Polyline positions={[[selected.originLat, selected.originLng], [selected.destinationLat, selected.destinationLng]]} color="#EF9F27" weight={3} dashArray="8,6" />
                    )}
                  </MapContainer>
                </div>
                <p style={{ fontSize: 11, color: '#aaa', padding: '6px 14px', borderTop: '0.5px solid #F5F0E8', margin: 0 }}>— — línea A→B al seleccionar paquete</p>
              </div>
            </div>
          </>}

          {activeMenu === 'Mapa en vivo' && (
            <div style={{ flex: 1, background: 'white', border: '0.5px solid #E8E5DC', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #F5F0E8' }}>
                <p style={{ fontWeight: 500, fontSize: 13, margin: 0 }}>Mapa en vivo — todos los paquetes</p>
              </div>
              <div style={{ flex: 1, minHeight: 500 }}>
                <MapContainer center={[13.6929, -89.2182]} zoom={8} style={{ height: '100%', width: '100%', minHeight: 500 }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                  {shipments.map(s => s.destinationLat && (
                    <Marker key={s.id} position={[s.destinationLat, s.destinationLng]}>
                      <Popup><strong>{s.description}</strong><br />{s.receiverName}<br />{s.trackingNumber}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {activeMenu === 'Conductores' && (
            <div style={{ background: 'white', border: '0.5px solid #E8E5DC', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 12px' }}>🐯 Conductores disponibles</p>
              {drivers.length === 0 && <p style={{ color: '#aaa', fontSize: 12 }}>No hay conductores disponibles.</p>}
              {drivers.map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid #F5F0E8' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🐯</div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 13, margin: 0 }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{d.email}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', background: '#EAF3DE', color: '#3B6D11', padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>✅ Disponible</span>
                </div>
              ))}
            </div>
          )}

          {activeMenu === 'Historial' && (
            <div style={{ background: 'white', border: '0.5px solid #E8E5DC', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 500, fontSize: 13, margin: '0 0 12px' }}>📋 Historial de paquetes</p>
              {shipments.map(shipment => {
                const statusKey = getStatus(shipment.status);
                const st = STATUS_COLORS[statusKey] || STATUS_COLORS.CREADO;
                return (
                  <div key={shipment.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid #F5F0E8' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, fontSize: 12, margin: 0 }}>{shipment.description}</p>
                      <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0' }}>#{shipment.trackingNumber} · {shipment.senderName} → {shipment.receiverName}</p>
                    </div>
                    <span style={{ background: st.bg, color: st.text, padding: '3px 8px', borderRadius: 20, fontSize: 11 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: 400, maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, color: '#412402', fontSize: 18 }}>🍯 Nuevo envío</h2>
            <CreateForm onClose={() => setShowForm(false)} onCreated={loadData} />
          </div>
        </div>
      )}
    </div>
  );
}

function CreateForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    description: '', weightKg: 1, senderName: '', receiverName: '',
    receiverPhone: '', destinationLat: '', destinationLng: '', destinationAddress: ''
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await shipmentService.create({
        ...form,
        weightKg:       parseFloat(form.weightKg),
        destinationLat: parseFloat(form.destinationLat),
        destinationLng: parseFloat(form.destinationLng),
      });
      onCreated();
      onClose();
    } catch (err) { alert('Error: ' + JSON.stringify(err)); }
    finally { setSaving(false); }
  }

  const field = (label, key, type = 'text') => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 3 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
    </div>
  );

  return (
    <>
      {field('¿Qué se envía?', 'description')}
      {field('Peso (kg)', 'weightKg', 'number')}
      {field('Remitente', 'senderName')}
      {field('Destinatario', 'receiverName')}
      {field('Teléfono', 'receiverPhone')}
      {field('Dirección destino', 'destinationAddress')}
      {field('Latitud destino', 'destinationLat', 'number')}
      {field('Longitud destino', 'destinationLng', 'number')}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 10, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
        <button onClick={handleSubmit} disabled={saving} style={{ flex: 1, padding: 10, background: '#EF9F27', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          {saving ? 'Guardando...' : 'Crear envío 🍯'}
        </button>
      </div>
    </>
  );
}