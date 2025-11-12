import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')

  const login = (t, u) => {
    setToken(t); setUsername(u);
    localStorage.setItem('token', t)
    localStorage.setItem('username', u ?? '')
  }
  const logout = () => {
    setToken(''); setUsername('')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }
  const value = { token, username, login, logout, isAuth: Boolean(token) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
