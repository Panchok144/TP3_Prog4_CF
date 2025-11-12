import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'

export default function Registro() {
  const [form, setForm] = useState({ username:'', email:'', password:'' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    try {
      await api.registro(form)
      setMsg('¡Usuario creado! Ya podés iniciar sesión.')
      setTimeout(()=> nav('/login'), 800)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
      <h2>Registro</h2>
      <form className="grid" onSubmit={submit}>
        <label>Usuario</label>
        <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <label>Contraseña</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        {msg && <small style={{color:'var(--ok)'}}>{msg}</small>}
        {error && <small style={{color:'var(--danger)'}}>{error}</small>}
        <button>Crear cuenta</button>
      </form>
      <small className="muted">¿Ya tenés cuenta? <Link to="/login">Entrá</Link></small>
    </div>
  )
}
