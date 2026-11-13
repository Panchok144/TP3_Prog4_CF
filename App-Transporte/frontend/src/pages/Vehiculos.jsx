import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

const formInicial = { marca: '', modelo: '', patente: '', anio: '', capacidad_carga: '' }

export default function Vehiculos() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [form, setForm] = useState(formInicial)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({})

  const cargar = async () => {
    try {
      const v = await api.vehiculos(token)
      setLista(v)
    } catch (err) { setError(err.message) }
  }
  useEffect(() => { cargar() }, [])

  const verStats = async (id) => {
    try {
      const s = await api.statsVehiculo(token, id)
      setStats(prev => ({ ...prev, [id]: s }))
    } catch (err) { }
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.marca || !form.modelo || !form.patente || !form.anio || form.capacidad_carga === '') {
      setError('Completá todos los campos'); return
    }
    try {
      if (editId) await api.editarVehiculo(token, editId, form)
      else await api.crearVehiculo(token, form)
      setForm(formInicial)
      setEditId(null)
      await cargar()
    } catch (err) { setError(err.message) }
  }

  const borrar = async (id) => {
    if (!confirm('¿Borrar vehículo?')) return
    try { await api.borrarVehiculo(token, id); cargar() }
    catch (err) { setError(err.message) }
  }

  const editar = (v) => {
    setEditId(v.id)
    setForm({ marca: v.marca, modelo: v.modelo, patente: v.patente, anio: v.anio, capacidad_carga: v.capacidad_carga })
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h3>{editId ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
        {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
        <form className="grid grid-3" onSubmit={guardar}>
          <div><label>Marca</label><input value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} required /></div>
          <div><label>Modelo</label><input value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} required /></div>
          <div><label>Patente</label><input value={form.patente} onChange={e => setForm({ ...form, patente: e.target.value.toUpperCase() })} required maxLength={10} /></div>
          <div><label>Año</label><input type="number" value={form.anio} onChange={e => setForm({ ...form, anio: e.target.value })} required min={1900} max={2030} /></div>
          <div><label>Capacidad de carga (kg)</label><input type="number" step="0.01" value={form.capacidad_carga} onChange={e => setForm({ ...form, capacidad_carga: e.target.value })} required min={0} /></div>
          <div className="flex" style={{ alignItems: 'flex-end' }}>
            <button>{editId ? 'Guardar' : 'Crear'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(formInicial) }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Listado de vehículos</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Marca</th><th>Modelo</th><th>Patente</th><th>Año</th><th>Cap. Carga (kg)</th><th>Total KM</th><th></th></tr></thead>
          <tbody>
            {lista.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td><span className="badge badge-ok">{v.patente}</span></td>
                <td>{v.anio}</td>
                <td>{v.capacidad_carga}</td>
                <td>
                  {stats[v.id] ? (
                    <span style={{ color: 'var(--primary)' }}>{stats[v.id].total_km} km ({stats[v.id].total_viajes} viajes)</span>
                  ) : (
                    <button style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => verStats(v.id)}>Ver</button>
                  )}
                </td>
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
