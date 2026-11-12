import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import { useAuth } from '../components/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) { setError('Completá todos los campos'); return }
    try {
      const res = await api.login(form)
      login(res.token, res.username)
      nav('/vehiculos')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2>Iniciar sesión</h2>
      <form className="grid" onSubmit={submit}>
        <div>
          <label>Usuario</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%' }} />
        </div>
        {error && <small style={{ color: 'var(--danger)' }}>{error}</small>}
        <button style={{ marginTop: 4 }}>Entrar</button>
      </form>
      <small className="muted">¿No tenés cuenta? <Link to="/registro">Registrate</Link></small>
    </div>
  )
}
