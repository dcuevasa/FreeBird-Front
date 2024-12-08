import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importar hook de internacionalización
import "./DeleteActivities.css"; // Asegúrate de crear este archivo para estilos personalizados

const DeleteActivities = ({ show, handleClose, onDelete }) => {
  const { t } = useTranslation();
  
  // Manejar confirmación de eliminación
  const handleConfirmDelete = () => {
    // Llamar a la función de eliminación
    if (onDelete) {
      onDelete();
    }
    // Cerrar el modal
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="custom-delete-modal-width">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          {/* Sin título, solo la equis para cerrar */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-body">
        <p className="font-bold modal-text" style={{ fontSize: "15px" }}>
          {t("deleteActivity.confirmation")}
        </p>
        <p className="font-light modal-text" style={{ fontSize: "14px" }}>
          {t("deleteActivity.permanentDeletion")}
        </p>
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="danger"
            onClick={handleConfirmDelete} // Cambiar a la nueva función
            className="delete_button red-button"
          >
            {t("deleteActivity.confirm")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteActivities;
