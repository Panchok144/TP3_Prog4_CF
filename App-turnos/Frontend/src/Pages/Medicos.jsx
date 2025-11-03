import React, { useEffect, useState } from "react";

export default function Medicos() {
  // Estado que guarda la lista de medicos registrados
  const [medicos, setMedicos] = useState([]);

  // Estado para manejar los datos del formulario
  const [nuevoMedico, setNuevoMedico] = useState({
    nombre: "",
    apellido: "",
    matricula: "",
    especialidad: "",
  });

  // Estado para controlar si el modal está abierto o no
  const [mostrarModal, setMostrarModal] = useState(false);

  // Medicos de ejemplo al iniciar la pagina
  useEffect(() => {
    const medicosEjemplo = [
      {
        id: 1,
        nombre: "María",
        apellido: "López",
        matricula: "12345",
        especialidad: "Cardiología",
      },
      {
        id: 2,
        nombre: "Carlos",
        apellido: "Fernández",
        matricula: "67890",
        especialidad: "Pediatría",
      },
    ];
    setMedicos(medicosEjemplo);
  }, []);

  // Maneja los cambios en los inputs del formulario
  const manejarCambio = (e) => {
    setNuevoMedico({ ...nuevoMedico, [e.target.name]: e.target.value });
  };

  // Agrega un nuevo medico a la tabla
  const agregarMedico = (e) => {
    e.preventDefault();

    // Se crea un nuevo objeto medico con ID unico
    const nuevo = { id: Date.now(), ...nuevoMedico };

    // Se actualiza la lista de medicos
    setMedicos([...medicos, nuevo]);

    // Se limpia el formulario
    setNuevoMedico({
      nombre: "",
      apellido: "",
      matricula: "",
      especialidad: "",
    });

    // Se cierra el modal
    setMostrarModal(false);
  };

  // Elimina un medico según su ID
  const eliminarMedico = (id) => {
    const filtrados = medicos.filter((m) => m.id !== id);
    setMedicos(filtrados);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestion de Médicos</h2>

      {/* Boton para abrir el modal */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setMostrarModal(true)}
      >
        + Nuevo Médico
      </button>

      {/* Tabla de medicos */}
      <table className="table table-striped table-hover">
        <thead className="table-info">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Matrícula</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay medicos registrados
              </td>
            </tr>
          ) : (
            medicos.map((m) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.apellido}</td>
                <td>{m.matricula}</td>
                <td>{m.especialidad}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarMedico(m.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Bootstrap para agregar medico */}
      {mostrarModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={agregarMedico}>
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Médico</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={nuevoMedico.nombre}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      className="form-control"
                      value={nuevoMedico.apellido}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Matrícula</label>
                    <input
                      type="text"
                      name="matricula"
                      className="form-control"
                      value={nuevoMedico.matricula}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Especialidad</label>
                    <input
                      type="text"
                      name="especialidad"
                      className="form-control"
                      value={nuevoMedico.especialidad}
                      onChange={manejarCambio}
                      required
                    />
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
                    Guardar Médico
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
