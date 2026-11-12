import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'

export default function Registro() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (!form.username || !form.email || !form.password) { setError('Completá todos los campos'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres y un número'); return }
    try {
      await api.registro(form)
      setMsg('¡Usuario creado! Ya podés iniciar sesión.')
      setTimeout(() => nav('/login'), 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480, margin: '60px auto' }}>
      <h2>Crear cuenta</h2>
      <form className="grid" onSubmit={submit}>
        <div>
          <label>Usuario</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Contraseña (mín. 8 caracteres con un número)</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%' }} />
        </div>
        {msg && <small style={{ color: 'var(--ok)' }}>{msg}</small>}
        {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
        <button style={{ marginTop: 4 }}>Crear cuenta</button>
      </form>
      <small className="muted">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></small>
    </div>
  )
}
