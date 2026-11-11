const API = 'http://localhost:8000'

function authHeaders(token) {
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(path, { method = 'GET', token = '', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: authHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : {} } catch (e) { data = { raw: text } }
  if (!res.ok) {
    let msg = data?.message || data?.mensaje || data?.error
    if (!msg && Array.isArray(data?.errores) && data.errores.length > 0) {
      msg = data.errores.map(e => e.msg || `${e.path}: inválido`).join(' | ')
    }
    throw new Error(msg || res.statusText || 'Error en la solicitud')
  }
  return data
}

export const api = {
  // auth
  login: (cred) => request('/api/auth/login', { method: 'POST', body: cred }),
  registro: (user) => request('/api/auth/registro', { method: 'POST', body: user }),
  // vehículos
  vehiculos: (token) => request('/api/vehiculos', { token }),
  crearVehiculo: (token, body) => request('/api/vehiculos', { method: 'POST', token, body }),
  editarVehiculo: (token, id, body) => request(`/api/vehiculos/${id}`, { method: 'PUT', token, body }),
  borrarVehiculo: (token, id) => request(`/api/vehiculos/${id}`, { method: 'DELETE', token }),
  // conductores
  conductores: (token) => request('/api/conductores', { token }),
  crearConductor: (token, body) => request('/api/conductores', { method: 'POST', token, body }),
  editarConductor: (token, id, body) => request(`/api/conductores/${id}`, { method: 'PUT', token, body }),
  borrarConductor: (token, id) => request(`/api/conductores/${id}`, { method: 'DELETE', token }),
  // viajes
  viajes: (token, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/api/viajes${qs}`, { token })
  },
  crearViaje: (token, body) => request('/api/viajes', { method: 'POST', token, body }),
  editarViaje: (token, id, body) => request(`/api/viajes/${id}`, { method: 'PUT', token, body }),
  borrarViaje: (token, id) => request(`/api/viajes/${id}`, { method: 'DELETE', token }),
  statsVehiculo: (token, id) => request(`/api/viajes/stats/vehiculo/${id}`, { token }),
  statsConductor: (token, id) => request(`/api/viajes/stats/conductor/${id}`, { token }),
}
