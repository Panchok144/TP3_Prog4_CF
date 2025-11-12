import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext.jsx'
import { api } from '../services/api.js'

export default function Pacientes() {
  const { token } = useAuth()
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({ nombre:'', apellido:'', dni:'', fecha_nacimiento:'', obra_social:'' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try { setLista(await api.pacientes(token)) } catch (err) { setError(err.message) }
  }
  useEffect(()=>{ cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      if (editId) await api.editarPaciente(token, editId, form)
      else await api.crearPaciente(token, form)
      setForm({ nombre:'', apellido:'', dni:'', fecha_nacimiento:'', obra_social:'' })
      setEditId(null)
      await cargar()
    } catch (err) { setError(err.message) }
  }
  const borrar = async (id) => { if (confirm('¿Borrar paciente?')) { await api.borrarPaciente(token, id); cargar() } }
  const editar = (p) => { setEditId(p.id); setForm({ nombre:p.nombre, apellido:p.apellido, dni:p.dni, fecha_nacimiento:p.fecha_nacimiento?.slice(0,10)||'', obra_social:p.obra_social }) }

  return (
    <div className="grid" style={{gap:20}}>
      <div className="card">
        <h3>{editId?'Editar paciente':'Nuevo paciente'}</h3>
        {error && <small style={{color:'var(--danger)'}}>{error}</small>}
        <form className="grid grid-3" onSubmit={guardar}>
          <div><label>Nombre</label><input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label>Apellido</label><input value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required/></div>
          <div><label>DNI</label><input value={form.dni} onChange={e=>setForm({...form, dni:e.target.value})} required/></div>
          <div><label>Fecha nac.</label><input type="date" value={form.fecha_nacimiento} onChange={e=>setForm({...form, fecha_nacimiento:e.target.value})} required/></div>
          <div><label>Obra social</label><input value={form.obra_social} onChange={e=>setForm({...form, obra_social:e.target.value})} required/></div>
          <div className="flex"><button>{editId?'Guardar':'Crear'}</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Listado</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>DNI</th><th>Obra social</th><th></th></tr></thead>
          <tbody>
            {lista.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.nombre}</td><td>{p.apellido}</td><td>{p.dni}</td><td>{p.obra_social}</td>
                <td className="flex">
                  <button onClick={()=>editar(p)}>Editar</button>
                  <button onClick={()=>borrar(p.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
