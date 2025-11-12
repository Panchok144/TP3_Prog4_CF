import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

export default function Medicos() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [esp, setEsp] = useState([])
  const [form, setForm] = useState({ nombre:'', apellido:'', id_especialidad:'', matricula_profesional:'' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const [m, e] = await Promise.all([api.medicos(token), api.especialidades(token)])
      setLista(m); setEsp(e)
    } catch (err) { setError(err.message) }
  }
  useEffect(()=>{ cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      if (editId) await api.editarMedico(token, editId, form)
      else await api.crearMedico(token, form)
      setForm({ nombre:'', apellido:'', id_especialidad:'', matricula_profesional:'' })
      setEditId(null)
      await cargar()
    } catch (err) { setError(err.message) }
  }
  const borrar = async (id) => { if (confirm('¿Borrar médico?')) { await api.borrarMedico(token, id); cargar() } }
  const editar = (m) => { setEditId(m.id); setForm({ nombre:m.nombre, apellido:m.apellido, id_especialidad:m.id_especialidad, matricula_profesional:m.matricula_profesional }) }

  return (
    <div className="grid" style={{gap:20}}>
      <div className="card">
        <h3>{editId?'Editar médico':'Nuevo médico'}</h3>
        {error && <small style={{color:'var(--danger)'}}>{error}</small>}
        <form className="grid grid-2" onSubmit={guardar}>
          <div><label>Nombre</label><input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label>Apellido</label><input value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required/></div>
          <div><label>Especialidad</label>
            <select value={form.id_especialidad} onChange={e=>setForm({...form, id_especialidad:e.target.value})} required>
              <option value="">Elegí una especialidad...</option>
              {esp.map(x => <option key={x.id_especialidad} value={x.id_especialidad}>{x.nombre}</option>)}
            </select>
          </div>
          <div><label>Matrícula</label><input value={form.matricula_profesional} onChange={e=>setForm({...form, matricula_profesional:e.target.value})} required/></div>
          <div className="flex">
            <button>{editId ? 'Guardar cambios':'Crear'}</button>
            {editId && <button type="button" onClick={()=>{ setEditId(null); setForm({ nombre:'', apellido:'', id_especialidad:'', matricula_profesional:'' })}}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Listado</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Especialidad</th><th>Matrícula</th><th></th></tr></thead>
          <tbody>
            {lista.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.apellido}</td>
                <td>{m.especialidad || m.especialidad_nombre}</td>
                <td>{m.matricula_profesional}</td>
                <td className="flex">
                  <button onClick={()=>editar(m)}>Editar</button>
                  <button onClick={()=>borrar(m.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
