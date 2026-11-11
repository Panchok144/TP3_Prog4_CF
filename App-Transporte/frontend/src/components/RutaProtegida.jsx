import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function RutaProtegida({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}
