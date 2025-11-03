import React, { useState, useEffect } from "react";

export default function Dashboard() {
  
  const [totalTurnos, setTotalTurnos] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalMedicos, setTotalMedicos] = useState(0);

  // Ejemplo de como seria traer los datos del backend
  useEffect(() => {
   
    setTotalTurnos(5);
    setTotalPacientes(8);
    setTotalMedicos(4);
  }, []);

  return (
    <div>
      <h2 className="mb-4">Panel Principal</h2>

      {/* Tarjetas con las estadísticas principales */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Turnos Activos</h5>
              <p className="display-6 text-primary">{totalTurnos}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Pacientes Registrados</h5>
              <p className="display-6 text-success">{totalPacientes}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Médicos Disponibles</h5>
              <p className="display-6 text-danger">{totalMedicos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
