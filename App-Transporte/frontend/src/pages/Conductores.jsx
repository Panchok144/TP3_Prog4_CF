import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

const formInicial = { nombre: '', apellido: '', nro_documento: '', nro_licencia: '', fecha_alta_licencia: '', fecha_vencimiento_licencia: '' }

export default function Conductores() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [form, setForm] = useState(formInicial)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({})

  const cargar = async () => {
    try {
      const c = await api.conductores(token)
      setLista(c)
    } catch (err) { setError(err.message) }
  }
  useEffect(() => { cargar() }, [])

  const verStats = async (id) => {
    try {
      const s = await api.statsConductor(token, id)
      setStats(prev => ({ ...prev, [id]: s }))
    } catch (err) { }
  }

  const isVencida = (fecha) => fecha && new Date(fecha) < new Date()

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre || !form.apellido || !form.nro_documento || !form.nro_licencia || !form.fecha_alta_licencia || !form.fecha_vencimiento_licencia) {
      setError('Completá todos los campos'); return
    }
    try {
      if (editId) await api.editarConductor(token, editId, form)
      else await api.crearConductor(token, form)
      setForm(formInicial)
      setEditId(null)
      await cargar()
    } catch (err) { setError(err.message) }
  }

  const borrar = async (id) => {
    if (!confirm('¿Borrar conductor?')) return
    try { await api.borrarConductor(token, id); cargar() }
    catch (err) { setError(err.message) }
  }

  const editar = (c) => {
    setEditId(c.id)
    setForm({
      nombre: c.nombre, apellido: c.apellido, nro_documento: c.nro_documento,
      nro_licencia: c.nro_licencia,
      fecha_alta_licencia: c.fecha_alta_licencia?.slice(0, 10) || '',
      fecha_vencimiento_licencia: c.fecha_vencimiento_licencia?.slice(0, 10) || ''
    })
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h3>{editId ? 'Editar conductor' : 'Nuevo conductor'}</h3>
        {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
        <form className="grid grid-3" onSubmit={guardar}>
          <div><label>Nombre</label><input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required /></div>
          <div><label>Apellido</label><input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} required /></div>
          <div><label>N° Documento</label><input value={form.nro_documento} onChange={e => setForm({ ...form, nro_documento: e.target.value })} required /></div>
          <div><label>N° Licencia</label><input value={form.nro_licencia} onChange={e => setForm({ ...form, nro_licencia: e.target.value })} required /></div>
          <div><label>Alta de licencia</label><input type="date" value={form.fecha_alta_licencia} onChange={e => setForm({ ...form, fecha_alta_licencia: e.target.value })} required /></div>
          <div><label>Vencimiento de licencia</label><input type="date" value={form.fecha_vencimiento_licencia} onChange={e => setForm({ ...form, fecha_vencimiento_licencia: e.target.value })} required /></div>
          <div className="flex" style={{ alignItems: 'flex-end' }}>
            <button>{editId ? 'Guardar' : 'Crear'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(formInicial) }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Listado de conductores</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Apellido, Nombre</th><th>Documento</th><th>Licencia</th><th>Alta licencia</th><th>Vencimiento</th><th>Total KM</th><th></th></tr></thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.apellido}, {c.nombre}</td>
                <td>{c.nro_documento}</td>
                <td>{c.nro_licencia}</td>
                <td>{c.fecha_alta_licencia?.slice(0, 10)}</td>
                <td>
                  <span className={`badge ${isVencida(c.fecha_vencimiento_licencia) ? 'badge-danger' : 'badge-ok'}`}>
                    {c.fecha_vencimiento_licencia?.slice(0, 10)}
                  </span>
                </td>
                <td>
                  {stats[c.id] ? (
                    <span style={{ color: 'var(--primary)' }}>{stats[c.id].total_km} km ({stats[c.id].total_viajes} viajes)</span>
                  ) : (
                    <button style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => verStats(c.id)}>Ver</button>
                  )}
                </td>
                <td className="flex">
                  <button onClick={() => editar(c)}>Editar</button>
                  <button className="btn-danger" onClick={() => borrar(c.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
