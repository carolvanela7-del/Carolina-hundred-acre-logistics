const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5288/api';

const getToken = () => localStorage.getItem('hawl_token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Email o contraseña incorrectos');
    const data = await res.json();
    localStorage.setItem('hawl_token', data.token);
    localStorage.setItem('hawl_user', JSON.stringify({ name: data.name, role: data.role }));
    return data;
  },
  logout() {
    localStorage.removeItem('hawl_token');
    localStorage.removeItem('hawl_user');
  }
};

export const shipmentService = {
  async getAll() {
    const res = await fetch(`${API_URL}/shipments`, { headers: headers() });
    if (!res.ok) throw new Error('Error al cargar paquetes');
    return res.json();
  },
  async create(data) {
    const res = await fetch(`${API_URL}/shipments`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear envío');
    return res.json();
  },
  async updateStatus(id, newStatus, note = null) {
    const res = await fetch(`${API_URL}/shipments/${id}/status`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ NewStatus: newStatus, Note: note })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    return res.json();
  },
  async assignDriver(id, driverId) {
    const res = await fetch(`${API_URL}/shipments/${id}/assign/${driverId}`, {
      method: 'PATCH',
      headers: headers()
    });
    if (!res.ok) throw new Error('Error al asignar conductor');
    return res.json();
  },
  async myDeliveries() {
    const res = await fetch(`${API_URL}/shipments/my-deliveries`, { headers: headers() });
    if (!res.ok) throw new Error('Error al cargar entregas');
    return res.json();
  },
  async track(trackingNumber) {
    const res = await fetch(`${API_URL}/shipments/track/${trackingNumber}`);
    if (res.status === 404) throw new Error('Paquete no encontrado en el bosque');
    if (!res.ok) throw new Error('Error al rastrear');
    return res.json();
  }
};

export const driverService = {
  async getAvailable() {
    const res = await fetch(`${API_URL}/drivers/available`, { headers: headers() });
    if (!res.ok) return [];
    return res.json();
  }
};