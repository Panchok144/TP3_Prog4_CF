import React, { useEffect, useState } from "react";

export default function Turnos() {
  
  const [turnos, setTurnos] = useState([]);

  // Formulario de nuevo turno
  const [nuevoTurno, setNuevoTurno] = useState({
    paciente: "",
    medico: "",
    fecha: "",
    hora: "",
    estado: "Pendiente",
  });

  // Estado para saber si el modal está abierto o cerrado
  const [mostrarModal, setMostrarModal] = useState(false);

 
  useEffect(() => {
    // Datos de ejemplo
    const turnosEjemplo = [
      {
        id: 1,
        paciente: "Juan Perez",
        medico: "Dra. Lopez",
        fecha: "2025-11-02",
        hora: "09:00",
        estado: "Confirmado",
      },
      {
        id: 2,
        paciente: "Ana García",
        medico: "Dr. Fernández",
        fecha: "2025-11-03",
        hora: "11:30",
        estado: "Pendiente",
      },
    ];
    setTurnos(turnosEjemplo);
  }, []);

  // Maneja el cambio en los campos del formulario
  const manejarCambio = (e) => {
    setNuevoTurno({ ...nuevoTurno, [e.target.name]: e.target.value });
  };

  // Agrega un nuevo turno a la tabla
  const agregarTurno = (e) => {
    e.preventDefault();

    // Se crea un nuevo objeto con un id único
    const nuevo = { id: Date.now(), ...nuevoTurno };

    // Se actualiza el estado agregando el nuevo turno
    setTurnos([...turnos, nuevo]);

    // Se limpia el formulario
    setNuevoTurno({
      paciente: "",
      medico: "",
      fecha: "",
      hora: "",
      estado: "Pendiente",
    });

    // Se cierra el modal
    setMostrarModal(false);
  };

  // Elimina un turno según su ID
  const eliminarTurno = (id) => {
    const filtrados = turnos.filter((t) => t.id !== id);
    setTurnos(filtrados);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Turnos</h2>

      {/* Botón para abrir el modal de nuevo turno */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setMostrarModal(true)}
      >
        + Nuevo Turno
      </button>

      {/* Tabla de turnos */}
      <table className="table table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay turnos registrados
              </td>
            </tr>
          ) : (
            turnos.map((t) => (
              <tr key={t.id}>
                <td>{t.paciente}</td>
                <td>{t.medico}</td>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>{t.estado}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarTurno(t.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal para agregar turno */}
      {mostrarModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={agregarTurno}>
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Turno</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Paciente</label>
                    <input
                      type="text"
                      name="paciente"
                      className="form-control"
                      value={nuevoTurno.paciente}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Médico</label>
                    <input
                      type="text"
                      name="medico"
                      className="form-control"
                      value={nuevoTurno.medico}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Fecha</label>
                      <input
                        type="date"
                        name="fecha"
                        className="form-control"
                        value={nuevoTurno.fecha}
                        onChange={manejarCambio}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hora</label>
                      <input
                        type="time"
                        name="hora"
                        className="form-control"
                        value={nuevoTurno.hora}
                        onChange={manejarCambio}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={nuevoTurno.estado}
                      onChange={manejarCambio}
                    >
                      <option>Pendiente</option>
                      <option>Confirmado</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar Turno
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
