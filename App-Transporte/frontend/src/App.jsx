import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Home from './pages/Home.jsx'
import Vehiculos from './pages/Vehiculos.jsx'
import Conductores from './pages/Conductores.jsx'
import Viajes from './pages/Viajes.jsx'

function Nav() {
  const { isAuth, username, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <header>
      <strong style={{ color: 'var(--primary)', fontSize: 18 }}>🚛 Transporte</strong>
      <nav className="flex">
        <NavLink to="/">Inicio</NavLink>
        {isAuth && (
          <>
            <NavLink to="/vehiculos">Vehículos</NavLink>
            <NavLink to="/conductores">Conductores</NavLink>
            <NavLink to="/viajes">Viajes</NavLink>
          </>
        )}
      </nav>
      <div className="flex right">
        {isAuth ? (
          <>
            <small style={{ color: 'var(--muted)' }}>{username}</small>
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <>
            <NavLink to="/login"><button>Ingresar</button></NavLink>
            <NavLink to="/registro"><button>Registrarse</button></NavLink>
          </>
        )}
      </div>
    </header>
  )
}

function AppContent() {
  return (
    <>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/vehiculos" element={<RutaProtegida><Vehiculos /></RutaProtegida>} />
          <Route path="/conductores" element={<RutaProtegida><Conductores /></RutaProtegida>} />
          <Route path="/viajes" element={<RutaProtegida><Viajes /></RutaProtegida>} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
