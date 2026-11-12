import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext.jsx'

export default function Home() {
  const { isAuth, username } = useAuth()

  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1 style={{ color: 'var(--primary)', fontSize: 36 }}>🚛 Gestión de Transporte</h1>
      <p style={{ color: 'var(--muted)', fontSize: 18, marginBottom: 32 }}>
        Sistema de administración de vehículos, conductores y viajes
      </p>
      {isAuth ? (
        <div>
          <p style={{ color: 'var(--ok)' }}>Bienvenido, <strong>{username}</strong></p>
          <div className="flex" style={{ justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <Link to="/vehiculos"><button>🚚 Vehículos</button></Link>
            <Link to="/conductores"><button>👤 Conductores</button></Link>
            <Link to="/viajes"><button>🗺️ Viajes</button></Link>
          </div>
        </div>
      ) : (
        <div className="flex" style={{ justifyContent: 'center', gap: 16 }}>
          <Link to="/login"><button>Iniciar sesión</button></Link>
          <Link to="/registro"><button>Registrarse</button></Link>
        </div>
      )}
    </div>
  )
}
