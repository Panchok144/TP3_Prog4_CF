
import React from "react";


export default function ModalFormulario({ mostrar, titulo, children, onCerrar, onGuardar }) {
  return (
    <Modal show={mostrar} onHide={onCerrar}>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
        <Button variant="primary" onClick={onGuardar}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}
