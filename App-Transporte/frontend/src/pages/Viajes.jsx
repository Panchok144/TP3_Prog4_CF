import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

const formInicial = {
  vehiculo_id: '', conductor_id: '',
  fecha_salida: '', fecha_llegada: '',
  origen: '', destino: '', kilometros: '', observaciones: ''
}

export default function Viajes() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [conductores, setConductores] = useState([])
  const [form, setForm] = useState(formInicial)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ vehiculo_id: '', conductor_id: '' })

  const cargarDependencias = async () => {
    try {
      const [v, c] = await Promise.all([api.vehiculos(token), api.conductores(token)])
      setVehiculos(v)
      setConductores(c)
    } catch (err) { }
  }

  const cargar = async () => {
    try {
      const params = {}
      if (filtros.vehiculo_id) params.vehiculo_id = filtros.vehiculo_id
      if (filtros.conductor_id) params.conductor_id = filtros.conductor_id
      const v = await api.viajes(token, Object.keys(params).length ? params : null)
      setLista(v)
    } catch (err) { setError(err.message) }
  }

  useEffect(() => { cargarDependencias(); cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.vehiculo_id || !form.conductor_id || !form.fecha_salida || !form.origen || !form.destino || form.kilometros === '') {
      setError('Completá los campos obligatorios'); return
    }
    try {
      const payload = {
        ...form,
        vehiculo_id: Number(form.vehiculo_id),
        conductor_id: Number(form.conductor_id),
        kilometros: Number(form.kilometros),
        fecha_llegada: form.fecha_llegada || null,
        observaciones: form.observaciones || null
      }
      if (editId) await api.editarViaje(token, editId, payload)
      else await api.crearViaje(token, payload)
      setForm(formInicial)
      setEditId(null)
      await cargar()
    } catch (err) { setError(err.message) }
  }

  const borrar = async (id) => {
    if (!confirm('¿Borrar viaje?')) return
    try { await api.borrarViaje(token, id); cargar() }
    catch (err) { setError(err.message) }
  }

  const editar = (v) => {
    setEditId(v.id)
    setForm({
      vehiculo_id: v.vehiculo_id,
      conductor_id: v.conductor_id,
      fecha_salida: v.fecha_salida?.slice(0, 16) || '',
      fecha_llegada: v.fecha_llegada?.slice(0, 16) || '',
      origen: v.origen,
      destino: v.destino,
      kilometros: v.kilometros,
      observaciones: v.observaciones || ''
    })
  }

  const aplicarFiltros = (e) => {
    e.preventDefault()
    cargar()
  }

  const limpiarFiltros = () => {
    setFiltros({ vehiculo_id: '', conductor_id: '' })
    api.viajes(token, null).then(setLista).catch(err => setError(err.message))
  }

  const totalKm = lista.reduce((sum, v) => sum + Number(v.kilometros || 0), 0)

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h3>{editId ? 'Editar viaje' : 'Nuevo viaje'}</h3>
        {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
        <form className="grid grid-3" onSubmit={guardar}>
          <div>
            <label>Vehículo</label>
            <select value={form.vehiculo_id} onChange={e => setForm({ ...form, vehiculo_id: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Seleccionar...</option>
              {vehiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.patente})</option>)}
            </select>
          </div>
          <div>
            <label>Conductor</label>
            <select value={form.conductor_id} onChange={e => setForm({ ...form, conductor_id: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Seleccionar...</option>
              {conductores.map(c => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label>Kilómetros</label>
            <input type="number" step="0.01" min="0" value={form.kilometros} onChange={e => setForm({ ...form, kilometros: e.target.value })} required />
          </div>
          <div>
            <label>Fecha de salida</label>
            <input type="datetime-local" value={form.fecha_salida} onChange={e => setForm({ ...form, fecha_salida: e.target.value })} required />
          </div>
          <div>
            <label>Fecha de llegada (opcional)</label>
            <input type="datetime-local" value={form.fecha_llegada} onChange={e => setForm({ ...form, fecha_llegada: e.target.value })} />
          </div>
          <div>
            <label>Origen</label>
            <input value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })} required />
          </div>
          <div>
            <label>Destino</label>
            <input value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} required />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label>Observaciones (opcional)</label>
            <textarea value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} rows={2} style={{ width: '100%' }} />
          </div>
          <div className="flex" style={{ alignItems: 'flex-end' }}>
            <button>{editId ? 'Guardar' : 'Crear'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(formInicial) }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Listado de viajes</h3>
          <form className="flex right" onSubmit={aplicarFiltros}>
            <select value={filtros.vehiculo_id} onChange={e => setFiltros({ ...filtros, vehiculo_id: e.target.value })} style={{ minWidth: 160 }}>
              <option value="">Todos los vehículos</option>
              {vehiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>)}
            </select>
            <select value={filtros.conductor_id} onChange={e => setFiltros({ ...filtros, conductor_id: e.target.value })} style={{ minWidth: 160 }}>
              <option value="">Todos los conductores</option>
              {conductores.map(c => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
            </select>
            <button type="submit">Filtrar</button>
            <button type="button" onClick={limpiarFiltros}>Limpiar</button>
          </form>
        </div>

        {lista.length > 0 && (
          <div className="stat-box" style={{ marginBottom: 14 }}>
            <h4>Total Kilómetros Recorridos {filtros.vehiculo_id || filtros.conductor_id ? '(Filtro activo)' : ''}</h4>
            <p>{totalKm.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} km <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>en {lista.length} viaje{lista.length !== 1 ? 's' : ''}</span></p>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Origen → Destino</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>KM</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td><span className="badge badge-ok">{v.patente}</span><br /><small className="muted">{v.marca} {v.modelo}</small></td>
                <td>{v.conductor_apellido}, {v.conductor_nombre}</td>
                <td>{v.origen} → {v.destino}</td>
                <td><small>{v.fecha_salida?.slice(0, 16).replace('T', ' ')}</small></td>
                <td><small>{v.fecha_llegada?.slice(0, 16).replace('T', ' ') || <span style={{ color: 'var(--muted)' }}>-</span>}</small></td>
                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{v.kilometros}</td>
                <td><small className="muted">{v.observaciones || '-'}</small></td>
                <td className="flex">
                  <button onClick={() => editar(v)}>Editar</button>
                  <button className="btn-danger" onClick={() => borrar(v.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
