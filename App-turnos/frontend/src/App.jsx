import React from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Medicos from './pages/Medicos.jsx'
import Pacientes from './pages/Pacientes.jsx'
import Turnos from './pages/Turnos.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'

function Topbar() {
  const { isAuth, username, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header>
      <b>Gestion de Turnos </b>
      <nav className="flex">
        <NavLink to="/medicos">Medicos</NavLink>
        <NavLink to="/pacientes">Pacientes</NavLink>
        <NavLink to="/turnos">Turnos</NavLink>
      </nav>
      <div className="right">
        {isAuth ? (
          <span>👤 {username} <button onClick={() => { logout(); nav('/login') }}>Salir</button></span>
        ) : <Link to="/login">Iniciar sesion</Link>}
      </div>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Topbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/medicos" element={<RutaProtegida><Medicos /></RutaProtegida>} />
          <Route path="/pacientes" element={<RutaProtegida><Pacientes /></RutaProtegida>} />
          <Route path="/turnos" element={<RutaProtegida><Turnos /></RutaProtegida>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
