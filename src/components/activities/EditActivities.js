import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./EditActivities.css";
import { useTranslation } from "react-i18next";

// Componente para editar actividades existentes
const EditActivities = ({ show, handleClose, activity, onSave }) => {
    const { t } = useTranslation(); // Hook para traducciones

    // Estados para manejar los diferentes campos de la actividad
    const [name, setName] = useState(""); // Nombre de la actividad
    const [hours, setHours] = useState(""); // Horas de duración
    const [minutes, setMinutes] = useState(""); // Minutos de duración
    const [directions, setDirections] = useState([""]); // Arreglo de direcciones

    // Efecto para cargar los datos de la actividad cuando se abre el modal
    useEffect(() => {
        if (activity) {
            // Inicializa los estados con los datos de la actividad
            setName(activity.name || "");
            // Extrae horas del formato "Xh Y min"
            setHours(activity.time ? activity.time.split("h")[0] : "");
            // Extrae minutos del formato "Xh Y min"
            setMinutes(activity.time ? activity.time.split(" ")[1]?.split("m")[0] : "");
            // Establece las direcciones o un arreglo vacío si no hay
            setDirections(activity.addressess || [""]);
        }
    }, [activity]); // Se ejecuta cuando cambia la actividad

    // Validación y control de horas
    const handleHoursChange = (e) => {
        const value = e.target.value;
        // Permite solo números enteros positivos
        if (/^\d*$/.test(value) && parseInt(value) >= 0) {
            setHours(value === "" ? "" : Math.max(0, parseInt(value, 10)).toString());
        }
    };

    // Validación y control de minutos
    const handleMinutesChange = (e) => {
        const value = e.target.value;
        // Permite solo números entre 0 y 59
        if (/^\d*$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 59) {
            setMinutes(value === "" ? "" : Math.min(parseInt(value, 10), 59).toString());
        }
    };

    // Actualiza una dirección específica en el arreglo de direcciones
    const handleDirectionChange = (index, value) => {
        const newDirections = [...directions];
        newDirections[index] = value;
        setDirections(newDirections);
    };

    // Añade una nueva dirección al arreglo
    const handleAddDirection = () => {
        setDirections([...directions, ""]);
    };

    // Elimina una dirección del arreglo (manteniendo al menos una)
    const handleRemoveDirection = (index) => {
        if (directions.length > 1) {
            const newDirections = directions.filter((_, i) => i !== index);
            setDirections(newDirections);
        }
    };

    return (
        // Modal de edición de actividades
        <Modal show={show} onHide={handleClose} centered className="custom-modal-width">
            <Modal.Header id="close-button" closeButton>
                <Modal.Title id="editar-itinerario-title" className="w-100 text-center">
                    {t("editActivity")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="itinerary-edit-form">
                    {/* Campo de nombre de la actividad */}
                    <Form.Group id="itinerary-name-div" className="mb-3">
                        <Form.Label>{t("name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t("enterActivityName")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <i className="info-icon">i</i>
                    </Form.Group>

                    {/* Sección de direcciones con capacidad de agregar/eliminar */}
                    <Form.Group id="directions-div" className="mb-3">
                        <Form.Label>{t("directions")}</Form.Label>
                        {directions.map((direction, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder={`${t("direction")} ${index + 1}`}
                                    value={direction}
                                    onChange={(e) => handleDirectionChange(index, e.target.value)}
                                    className="flex-grow-1"
                                />
                                {index > 0 && ( // Botón de eliminar solo para direcciones adicionales
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
                        {/* Botón para añadir nueva dirección */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddDirection}
                            className="mt-2"
                        >
                            {t("addDirection")}
                        </Button>
                    </Form.Group>

                    {/* Sección de tiempo de la actividad */}
                    <Form.Group id="time-div" className="mb-3">
                        <Form.Label>{t("time")}</Form.Label>
                        <div className="d-flex align-items-center">
                            {/* Input para horas */}
                            <Form.Control
                                type="number"
                                placeholder="HH"
                                style={{ width: "50px", background: "#f0f0f0" }}
                                value={hours}
                                onChange={handleHoursChange}
                            />
                            <span className="mx-2">hora</span>
                            {/* Input para minutos */}
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

                    {/* Botones de acción */}
                    <div className="d-flex justify-content-center gap-2">
                        {/* Botón de cancelar */}
                        <Button
                            className="cancel_button"
                            type="button"
                            onClick={handleClose}
                        >
                            {t("cancel")}
                        </Button>
                        
                        {/* Botón de guardar */}
                        <Button
                            type="button"
                            className="saveActivity_button"
                            data-testid="save-activity-button" // Agrega un identificador único
                            onClick={() => {
                                const totalDurationMins = (parseInt(hours || 0) * 60) + parseInt(minutes || 0);

                                // Validar campos
                                if (!name.trim() || directions.every(dir => dir.trim() === '') || totalDurationMins <= 0) {
                                    alert('Please fill all required fields and ensure duration is greater than 0 minutes.');
                                    return;
                                }
                        
                                // Crear objeto actualizado
                                const updatedActivity = {
                                    id: activity.id, // Asegúrate de incluir el ID
                                    name: name.trim(),
                                    addressess: directions.filter(dir => dir.trim()), // Filtrar direcciones no vacías
                                    durationMins: totalDurationMins, // Duración total en minutos
                                };
                        
                                console.log('Updated activity:', updatedActivity);
                                onSave(updatedActivity);
                            }}
                        >
                            {t("save")}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditActivities;