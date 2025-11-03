import React from "react";
import { NavLink } from "react-router-dom";

// Barra lateral que permite moverse entre las distintas secciones del sistema.
export default function BarraLateral() {
  return (
    <aside
      className="bg-primary text-white p-3 d-flex flex-column"
      style={{ width: "250px" }}
    >
      <h3 className="text-center mb-4">Clínica Salud+</h3>

      {/* Enlaces de navegación */}
      <nav className="nav flex-column">
        <NavLink
          to="/"
          className="nav-link text-white"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#0d6efd" : "transparent",
          })}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/turnos"
          className="nav-link text-white"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#0d6efd" : "transparent",
          })}
        >
          Turnos
        </NavLink>

        <NavLink
          to="/pacientes"
          className="nav-link text-white"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#0d6efd" : "transparent",
          })}
        >
          Pacientes
        </NavLink>

        <NavLink
          to="/medicos"
          className="nav-link text-white"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#0d6efd" : "transparent",
          })}
        >
          Médicos
        </NavLink>
      </nav>
    </aside>
  );
}
