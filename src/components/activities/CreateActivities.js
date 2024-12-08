// Importaciones necesarias de React, componentes de react-bootstrap, CSS y librería de traducción
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./EditActivities.css";
import { useTranslation } from "react-i18next";

// Componente funcional CreateActivities que recibe props para mostrar/ocultar el modal
const CreateActivities = ({ show, handleClose, onSave }) => {
    // Hook de traducción para internacionalización
    const { t } = useTranslation();

    // Estados locales para manejar los campos del formulario
    // - name: nombre de la actividad
    // - hours: horas de la actividad
    // - minutes: minutos de la actividad
    // - directions: array de direcciones (permite múltiples direcciones)
    const [name, setName] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [directions, setDirections] = useState([""]);

    const baseURL = "http://localhost:3000/api/v1";


    // Función para restablecer todos los campos del formulario
    const resetFields = () => {
        setName("");
        setHours("");
        setMinutes("");
        setDirections([""]);
    };

    // Función que combina el cierre del modal y el reseteo de campos
    const handleCloseWithReset = () => {
        resetFields();
        handleClose();
    };

    // Validación y manejo del campo de horas
    // Solo permite números positivos
    const handleHoursChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && parseInt(value) >= 0) {
            setHours(value === "" ? "" : Math.max(0, parseInt(value, 10)).toString());
        }
    };

    // Validación y manejo del campo de minutos
    // Solo permite números entre 0 y 59
    const handleMinutesChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 59) {
            setMinutes(value === "" ? "" : parseInt(value, 10).toString());
        }
    };

    // Manejar cambios en los campos de direcciones
    const handleDirectionChange = (index, value) => {
        const newDirections = [...directions];
        newDirections[index] = value;
        setDirections(newDirections);
    };

    // Añadir un nuevo campo de dirección
    const handleAddDirection = () => {
        setDirections([...directions, ""]);
    };

    // Eliminar un campo de dirección específico
    const handleRemoveDirection = (index) => {
        const newDirections = directions.filter((_, i) => i !== index);
        setDirections(newDirections);
    };

    // Renderizado del componente
    return (
        <Modal show={show} onHide={handleCloseWithReset} centered className="custom-modal-width">
            {/* Encabezado del modal */}
            <Modal.Header id="close-button" closeButton>
                <Modal.Title id="crear-actividad-title" className="w-100 text-center">
                    {t("createActivity")}
                </Modal.Title>
            </Modal.Header>

            {/* Cuerpo del modal con el formulario */}
            <Modal.Body>
                <Form id="activity-create-form">
                    {/* Campo para el nombre de la actividad */}
                    <Form.Group id="activity-name-div" className="mb-3">
                        <Form.Label>{t("name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t("enterActivityName")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <i className="info-icon">i</i>
                    </Form.Group>

                    {/* Campos de direcciones dinámicos */}
                    <Form.Group id="directions-div" className="mb-3">
                        <Form.Label>{t("directions")}</Form.Label>
                        {/* Mapeo de direcciones con posibilidad de añadir/eliminar */}
                        {directions.map((direction, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder={`${t("direction")} ${index + 1}`}
                                    value={direction}
                                    onChange={(e) => handleDirectionChange(index, e.target.value)}
                                    className="flex-grow-1"
                                />
                                {/* Botón para eliminar direcciones (excepto la primera) */}
                                {index > 0 && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleRemoveDirection(index)}
                                    >
                                        {t("remove")}
                                    </Button>
                                )}
                            </div>
                        ))}
                        {/* Botón para añadir nuevas direcciones */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddDirection}
                            className="mt-2"
                        >
                            {t("addDirection")}
                        </Button>
                    </Form.Group>

                    {/* Campo para tiempo de la actividad */}
                    <Form.Group id="time-div" className="mb-3">
                        <Form.Label>{t("time")}</Form.Label>
                        <div className="d-flex align-items-center">
                            {/* Campos de horas y minutos con validación */}
                            <Form.Control
                                type="number"
                                placeholder="HH"
                                style={{ width: "50px", background: "#f0f0f0" }}
                                value={hours}
                                onChange={handleHoursChange}
                            />
                            <span className="mx-2">hora</span>
                            <Form.Control
                                type="number"
                                placeholder="MM"
                                style={{ width: "50px", background: "#f0f0f0" }}
                                value={minutes}
                                onChange={handleMinutesChange}
                            />
                            <span className="mx-2">minutos</span>
                        </div>
                        <i className="info-icon">i</i>
                    </Form.Group>

                    {/* Botones de acción: Cancelar y Crear */}
                    <div className="d-flex justify-content-center gap-2">
                        <Button
                            className="cancel_button"
                            type="button"
                            onClick={handleCloseWithReset}
                        >
                            {t("cancel")}
                        </Button>

                        <Button
                            type="button"
                            className="saveActivity_button"
                            data-testid="create-activity-button" // Añade un identificador único aquí
                            onClick={() => {
                                
                                const totalDurationMins = (parseInt(hours || 0) * 60) + parseInt(minutes || 0);

                                // Validar que los campos no estén vacíos
                                if (name.trim() && directions.some(dir => dir.trim()) && (hours || minutes)) {
                                    // Crear el objeto de actividad

                                    console.log("directions filtered", directions.filter(dir => dir.trim()));

                                    const newActivity = {
                                        id: Date.now(), // Generar un ID único
                                        name: name.trim(),
                                        addressess: directions.filter(dir => dir.trim()),
                                        durationMins: totalDurationMins
                                    };

                                    // Llamar a onSave si está definido
                                    if (onSave) {
                                        onSave(newActivity);
                                    }

                                    // Cerrar el modal
                                    handleCloseWithReset();
                                } else {
                                    // Opcionalmente, mostrar un mensaje de error
                                    alert('Por favor complete todos los campos');
                                }
                            }}
                        >
                            {t("create")}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateActivities;