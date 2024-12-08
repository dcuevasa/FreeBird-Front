import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./DeletePopUp.css"; // Asegúrate de crear este archivo para estilos personalizados

const DeletePopUp = ({ show, handleClose, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-delete-modal-width">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          {/* Sin título, solo la equis para cerrar */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-body">
        <p className="font-bold modal-text" style={{ fontSize: "15px" }}>
          ¿Estás seguro de borrar tu perfil?
        </p>
        <p className="font-light modal-text" style={{ fontSize: "14px" }}>
          Toda tu información será eliminada permanentemente
        </p>
        <div className="d-flex justify-content-center mt-4">
          <Button 
            variant="danger" 
            onClick={handleDelete}
            className="delete_button red-button"
          >
            Borrar perfil
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeletePopUp;
