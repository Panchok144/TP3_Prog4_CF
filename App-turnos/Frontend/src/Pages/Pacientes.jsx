import React, { useEffect, useState } from "react";


export default function Pacientes() {
 
  const [pacientes, setPacientes] = useState([]);

  // Estado para manejar los datos del formulario del nuevo paciente
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    obra_social: "",
  });

  // Estado para mostrar o ocultar el modal
  const [mostrarModal, setMostrarModal] = useState(false);

// Pacientes de ejemplo al iniciar la pagina
  useEffect(() => {
    const pacientesEjemplo = [
      {
        id: 1,
        nombre: "Juan",
        apellido: "Perez",
        dni: "40500220",
        fecha_nacimiento: "1990-05-15",
        obra_social: "IVA",
      },
      {
        id: 2,
        nombre: "Ana",
        apellido: "Garcia",
        dni: "39500210",
        fecha_nacimiento: "1985-03-22",
        obra_social: "APOS",
      },
    ];
    setPacientes(pacientesEjemplo);
  }, []);

  // Funcion que actualiza los valores del formulario cuando el usuario escribe
  const manejarCambio = (e) => {
    setNuevoPaciente({ ...nuevoPaciente, [e.target.name]: e.target.value });
  };

  // Funcion para agregar un nuevo paciente
  const agregarPaciente = (e) => {
    e.preventDefault();

    // Creamos un nuevo objeto paciente con un ID único
    const nuevo = { id: Date.now(), ...nuevoPaciente };

    // Se agrega el nuevo paciente al estado actual
    setPacientes([...pacientes, nuevo]);

    // Se limpia el formulario
    setNuevoPaciente({
      nombre: "",
      apellido: "",
      dni: "",
      fecha_nacimiento: "",
      obra_social: "",
    });

    // Se cierra el modal
    setMostrarModal(false);
  };

  // Funcion para eliminar un paciente por su ID
  const eliminarPaciente = (id) => {
    const filtrados = pacientes.filter((p) => p.id !== id);
    setPacientes(filtrados);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Pacientes</h2>

      {/* Boton para abrir el modal */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setMostrarModal(true)}
      >
        + Nuevo Paciente
      </button>

      {/* Tabla de pacientes */}
      <table className="table table-striped table-hover">
        <thead className="table-success">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay pacientes registrados
              </td>
            </tr>
          ) : (
            pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.dni}</td>
                <td>{p.fecha_nacimiento}</td>
                <td>{p.obra_social}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarPaciente(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Bootstrap para agregar paciente */}
      {mostrarModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={agregarPaciente}>
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Paciente</h5>
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
                      value={nuevoPaciente.nombre}
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
                      value={nuevoPaciente.apellido}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      className="form-control"
                      value={nuevoPaciente.dni}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      className="form-control"
                      value={nuevoPaciente.fecha_nacimiento}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Obra Social</label>
                    <input
                      type="text"
                      name="obra_social"
                      className="form-control"
                      value={nuevoPaciente.obra_social}
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
                    Guardar Paciente
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
