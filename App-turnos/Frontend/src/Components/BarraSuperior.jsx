import React from "react";

// Barra superior que se muestra en todas las paginas.
export default function BarraSuperior() {
  return (
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Sistema de Gestión de Turnos</h5>
      <span className="text-secondary">Usuario: Administrador</span>
    </header>
  );
}
