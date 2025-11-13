import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

export default function Turnos() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [form, setForm] = useState({ paciente_id:'', medico_id:'', fecha:'', hora:'', estado:'pendiente', observaciones:'' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const [t, m, p] = await Promise.all([api.turnos(token), api.medicos(token), api.pacientes(token)])
      setLista(t); setMedicos(m); setPacientes(p)
    } catch (err) { setError(err.message) }
  }
  useEffect(()=>{ cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      if (editId) await api.editarTurno(token, editId, form)
      else await api.crearTurno(token, form)
      setForm({ paciente_id:'', medico_id:'', fecha:'', hora:'', estado:'pendiente', observaciones:'' })
      setEditId(null); await cargar()
    } catch (err) { setError(err.message) }
  }
  const borrar = async (id) => { if (confirm('¿Borrar turno?')) { await api.borrarTurno(token, id); cargar() } }
  const editar = (t) => { setEditId(t.id); setForm({ paciente_id:t.paciente_id, medico_id:t.medico_id, fecha:t.fecha?.slice(0,10)||'', hora:t.hora, estado:t.estado, observaciones:t.observaciones||'' }) }

  return (
    <div className="grid" style={{gap:20}}>
      <div className="card">
        <h3>{editId?'Editar turno':'Nuevo turno'}</h3>
        {error && <small style={{color:'var(--danger)'}}>{error}</small>}
        <form className="grid grid-3" onSubmit={guardar}>
          <div><label>Paciente</label>
            <select value={form.paciente_id} onChange={e=>setForm({...form, paciente_id:e.target.value})} required>
              <option value="">Elegí un paciente</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.apellido}, {p.nombre}</option>)}
            </select>
          </div>
          <div><label>Médico</label>
            <select value={form.medico_id} onChange={e=>setForm({...form, medico_id:e.target.value})} required>
              <option value="">Elegí un médico</option>
              {medicos.map(m => <option key={m.id} value={m.id}>{m.apellido}, {m.nombre}</option>)}
            </select>
          </div>
          <div><label>Fecha</label><input type="date" value={form.fecha} onChange={e=>setForm({...form, fecha:e.target.value})} required/></div>
          <div><label>Hora</label><input type="time" value={form.hora} onChange={e=>setForm({...form, hora:e.target.value})} required/></div>
          <div><label>Estado</label>
            <select value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
              <option value="pendiente">pendiente</option>
              <option value="atendido">atendido</option>
              <option value="cancelado">cancelado</option>
            </select>
          </div>
          <div className="grid" style={{gridTemplateColumns:'1fr'}}>
            <label>Observaciones</label>
            <textarea rows="3" value={form.observaciones} onChange={e=>setForm({...form, observaciones:e.target.value})} />
          </div>
          <div className="flex">
            <button>{editId?'Guardar':'Crear'}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Listado</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Paciente</th><th>Medico</th><th>Fecha</th><th>Hora</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {lista.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.paciente_apellido ? `${t.paciente_apellido}, ${t.paciente_nombre}` : t.paciente_id}</td>
                <td>{t.medico_apellido ? `${t.medico_apellido}, ${t.medico_nombre}` : t.medico_id}</td>
                <td>{t.fecha?.slice(0,10)}</td>
                <td>{t.hora}</td>
                <td>{t.estado}</td>
                <td className="flex">
                  <button onClick={()=>editar(t)}>Editar</button>
                  <button onClick={()=>borrar(t.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
