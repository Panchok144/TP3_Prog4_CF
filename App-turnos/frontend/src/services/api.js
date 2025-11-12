const API = 'http://localhost:8000'

function authHeaders(token) {
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(path, { method='GET', token='', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: authHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : {} } catch(e) { data = { raw:text } }
  if (!res.ok) {
    const msg = data?.message || data?.mensaje || data?.error || res.statusText
    throw new Error(msg)
  }
  return data
}

export const api = {
  //
  login: (cred) => request('/api/auth/login', { method:'POST', body: cred }),
  registro: (user) => request('/api/auth/registro', { method:'POST', body: user }),
  // especialidades
  especialidades: (token) => request('/api/especialidades', { token }),
  crearEspecialidad: (token, body) => request('/api/especialidades', { method:'POST', token, body }),
  // médicos
  medicos: (token) => request('/api/medicos', { token }),
  crearMedico: (token, body) => request('/api/medicos', { method:'POST', token, body }),
  editarMedico: (token, id, body) => request(`/api/medicos/${id}`, { method:'PUT', token, body }),
  borrarMedico: (token, id) => request(`/api/medicos/${id}`, { method:'DELETE', token }),
  // pacientes
  pacientes: (token) => request('/api/pacientes', { token }),
  crearPaciente: (token, body) => request('/api/pacientes', { method:'POST', token, body }),
  editarPaciente: (token, id, body) => request(`/api/pacientes/${id}`, { method:'PUT', token, body }),
  borrarPaciente: (token, id) => request(`/api/pacientes/${id}`, { method:'DELETE', token }),
  // turnos
  turnos: (token) => request('/api/turnos', { token }),
  crearTurno: (token, body) => request('/api/turnos', { method:'POST', token, body }),
  editarTurno: (token, id, body) => request(`/api/turnos/${id}`, { method:'PUT', token, body }),
  borrarTurno: (token, id) => request(`/api/turnos/${id}`, { method:'DELETE', token }),
}
