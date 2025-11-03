import React from "react";
import { Routes, Route } from "react-router-dom";
import BarraLateral from "./components/BarraLateral";
import BarraSuperior from "./components/BarraSuperior";
import Dashboard from "./Pages/Dashboard";
import Turnos from "./pages/Turnos";
import Pacientes from "./Pages/Pacientes";
import Medicos from "./pages/Medicos";

// Este componente organiza la estructura principal del sistema.
// Muestra la barra lateral, la barra superior y el área de contenido central.
export default function App() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Barra lateral (azul oscuro con navegación) */}
      <BarraLateral />

      {/* Contenedor principal (parte derecha) */}
      <div className="flex-grow-1 bg-light">
        {/* Barra superior blanca con el nombre del sistema */}
        <BarraSuperior />

        {/* Zona de contenido donde cambian las páginas según la ruta */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/turnos" element={<Turnos />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/medicos" element={<Medicos />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
