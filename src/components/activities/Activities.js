import './Activities.css';
import '../../index.css';
// Importación de componentes de Bootstrap y librerías de React
import { Row, Col, Form, Container, Card, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // Librería para internacionalización
import { useState, useEffect } from 'react';
// Importación de iconos de diferentes librerías
import { FaSearch } from 'react-icons/fa';
import { FaRegTrashCan } from "react-icons/fa6";
import { TiCogOutline } from "react-icons/ti";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
// Importación de componentes de modal para crear, editar y eliminar actividades
import EditActivities from './EditActivities';
import CreateActivities from './CreateActivities';
import DeleteActivities from './DeleteActivities';
import axios from 'axios';

// Componente para renderizar una actividad individual
function Activity({ id, name, addressess, time, onUpdateActivity, onDeleteActivity }) {
    // Estados para controlar la visualización de modales de edición y eliminación
    const [showEditActivies, setshowEditActivies] = useState(false);
    const [showDeleteActivies, setshowDeleteActivies] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);

    // Función para cerrar el modal de edición
    const handleCloseEditActivites = () => {
        setshowEditActivies(false);
    };

    // Función para abrir el modal de edición y preparar los datos de la actividad
    const handleEditActivities = () => {
        setshowEditActivies(true);
        setActivityToEdit({
            id,
            name,
            addressess,
            time,
        });
    };

    // Función para cerrar el modal de eliminación
    const handleCloseDeleteActivites = () => {
        setshowDeleteActivies(false);
    };

    // Función para abrir el modal de eliminación
    const handleDeleteActivities = () => {
        setshowDeleteActivies(true);
    };

    // Función para actualizar una actividad y cerrar el modal de edición
    const handleUpdateActivity = (updatedActivity) => {
        onUpdateActivity(updatedActivity);
        handleCloseEditActivites();
    };

    return (
        // Tarjeta de actividad con nombre, direcciones y tiempo
        <div className="border-bottom border-gray" style={{ paddingBottom: '10px', paddingTop: '10px', marginLeft: '20px', marginRight: '20px' }}>
            <Row style={{ minWidth: '100%' }} className="d-flex align-items-center">
                {/* Nombre de la actividad */}
                <Col xs={10} md={10} lg={10} style={{ fontFamily: 'Volkhov', minWidth: 'fit-content', textAlign: 'left' }}>
                    {name}
                </Col>
                {/* Iconos de edición y eliminación */}
                <Col xs={2} md={2} lg={2} className="d-flex justify-content-end">
                    <TiCogOutline data-testid="edit-icon" style={{ color: 'grey', fontSize: '1.3rem', marginRight: '0.5rem', cursor: 'pointer', }} onClick={handleEditActivities} />
                    
                    <FaRegTrashCan data-testid="delete-icon" style={{ color: 'var(--naranja)', fontSize: '1.3rem', cursor: 'pointer', }} onClick={handleDeleteActivities} />
                </Col>
            </Row>
            {/* Renderizado de direcciones */}
            {addressess.map((address, index) => (
                <Row key={index} style={{ alignItems: 'center' }}>
                    <Col style={{ maxWidth: 'fit-content', display: 'flex', alignItems: 'center' }}>
                        <img src={'/pin_icon.svg'} alt="pin" />
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                        <p style={{ margin: 0 }}>{address}</p>
                    </Col>
                </Row>
            ))}
            {/* Renderizado del tiempo de la actividad */}
            <Row style={{ alignItems: 'center' }}>
                <Col style={{ maxWidth: 'fit-content', display: 'flex', alignItems: 'center' }}>
                    <MdOutlineWatchLater style={{ color: 'var(--naranja)', fontSize: '1rem' }} />
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                    <p style={{ margin: 0 }}>{time}</p>
                </Col>
            </Row>

            {/* Modales de edición y eliminación */}
            {showEditActivies && (
                <EditActivities 
                    show={showEditActivies} 
                    handleClose={() => setshowEditActivies(false)} 
                    activity={activityToEdit}
                    onSave={handleUpdateActivity}
                />
            )}

            <DeleteActivities 
                show={showDeleteActivies} 
                handleClose={handleCloseDeleteActivites} 
                onDelete={() => onDeleteActivity(id)} // Añadir prop onDelete
            />
        </div>
    )
}

// Componente principal de lista de actividades
function ActivityList() {
    const { t } = useTranslation(); // Hook para traducción
    const [query, setQuery] = useState(''); // Estado para búsqueda
    const [showCreateActivies, setshowCreateActivies] = useState(false); // Estado para modal de crear actividad
    const [activities, setActivities] = useState([]); // Estado para almacenar actividades
    const [loading, setLoading] = useState(true); // Estado de carga inicial

    const baseURL = 'http://localhost:3000/api/v1';


    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${baseURL}/activity`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
    
                // Formatear las actividades para incluir la duración en horas y minutos
                const formattedActivities = response.data.map(activity => ({
                    id: activity.id,
                    name: activity.name,
                    addressess: activity.addressess,
                    time: `${Math.floor(activity.durationMins / 60)}h ${activity.durationMins % 60} min`
                }));
    
                setActivities(formattedActivities);
            } catch (error) {
                console.error('Error fetching activities:', error);
                const errorMessage = error.response?.data?.message || 'Error fetching activities';
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
    
        fetchActivities();
    }, []);

    const handleUpdateActivity = async (updatedActivity) => {
        try {
            console.log('Updating activity:', updatedActivity);
    
            const response = await axios.put(
                `${baseURL}/activity/${updatedActivity.id}`,
                {
                    name: updatedActivity.name,
                    addressess: updatedActivity.addressess,
                    durationMins: updatedActivity.durationMins,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            const updatedData = response.data;
    
            // Formatear la actividad actualizada para incluir `time`
            const formattedActivity = {
                ...updatedData,
                time: `${Math.floor(updatedData.durationMins / 60)}h ${updatedData.durationMins % 60} min`,
            };
    
            // Actualizar la lista de actividades en el frontend
            setActivities(prevActivities =>
                prevActivities.map(activity =>
                    activity.id === updatedActivity.id ? formattedActivity : activity
                )
            );
    
            console.log('Activity updated successfully:', formattedActivity);
        } catch (error) {
            console.error('Error updating activity:', error);
            const errorMessage = error.response?.data?.message || 'Error updating activity. Please try again.';
            alert(errorMessage);
        }
    };

    // Función para crear una nueva actividad
    const handleCreateActivity = async (newActivity) => {
        try {
            const activityData = {
                name: newActivity.name,
                durationMins: newActivity.durationMins,
                addressess: newActivity.addressess,
            };
    
            console.log(activityData);
    
            const response = await axios.post('http://localhost:3000/api/v1/activity', activityData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            // Access the data directly from axios response
            const createdActivity = response.data;
    
            // Convertir la duración a formato "Xh Ym"
            const formattedActivity = {
                ...createdActivity,
                time: `${Math.floor(createdActivity.durationMins / 60)}h ${createdActivity.durationMins % 60} min`,
            };
    
            // Agregar la nueva actividad al estado
            setActivities(prevActivities => [...prevActivities, formattedActivity]);
            setshowCreateActivies(false); // Cerrar el modal
    
        } catch (error) {
            console.error('Error al crear itinerario:', error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('Error creating activity. Please try again.');
            }
        }
    };


    const handleDeleteActivity0 = async (activityId) => {
        try {
            console.log('Deleting activity with ID:', activityId);
    
            const response = await fetch(`${baseURL}/activity/${activityId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error: ${error.message || response.statusText}`);
            }
    
            // Actualizar la lista de actividades en el frontend
            setActivities(prevActivities =>
                prevActivities.filter(activity => activity.id !== activityId)
            );
    
            console.log('Activity deleted successfully');
        } catch (error) {
            console.error('Error deleting activity:', error.message);
            alert(error.message || 'Error deleting activity. Please try again.');
        }
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            console.log('Deleting activity with ID:', activityId);
    
            await axios.delete(`${baseURL}/activity/${activityId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            // Actualizar la lista de actividades en el frontend
            setActivities(prevActivities =>
                prevActivities.filter(activity => activity.id !== activityId)
            );
    
            console.log('Activity deleted successfully');
        } catch (error) {
            console.error('Error deleting activity:', error);
            const errorMessage = error.response?.data?.message || 'Error deleting activity. Please try again.';
            alert(errorMessage);
        }
    };

    // Función para limpiar búsqueda
    const handleClear = () => {
        setQuery('');
    };

    // Función para cerrar modal de crear actividad
    const handleCloseCreateActivites = () => {
        setshowCreateActivies(false);
    };

    // Función para abrir modal de crear actividad
    const handleCreateActivities = () => {
        setshowCreateActivies(true);
    };

    // Filtrado de actividades basado en la búsqueda
    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        // Contenedor principal de lista de actividades
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '90vw' }}>
            <Card centered className="custom-modal-width text-center" style={{ width: '45vw', maxHeight: '90vh', overflow: 'hidden' }}>

                {/* Encabezado de la tarjeta */}
                <Card.Header id="close-button" style={{ border: 'none', backgroundColor: 'transparent', position: 'relative' }}>
                    <Card.Title id="editar-perfil-title" className="w-100 text-center">
                        {t('Activities')}
                    </Card.Title>
                    {/* Botón para agregar nueva actividad */}
                    <Button
                        variant="primary"
                        onClick={handleCreateActivities}
                        style={{
                            position: 'absolute',
                            top: '0px',
                            right: '10px',
                        }}
                    >
                        {t('add')}
                    </Button>
                </Card.Header>

                <Card.Body style={{ marginTop: '0px', maxHeight: '50vh', overflowY: 'auto', padding: '10px 20px' }}>
                    {/* Barra de búsqueda */}
                    <div style={{ margin: '0 5%', width: '90%' }}>
                        <InputGroup className="mb-3" style={{ borderRadius: '0.5rem', overflow: 'hidden', marginLeft: '0px' }}>
                            <InputGroup.Text style={{ background: '#f0f0f0', border: 'transparent', borderRight: 'none' }}>
                                <FaSearch style={{ cursor: 'pointer' }} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder={t('search')}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '0',
                                    border: 'Transparent',
                                    outline: 'none'
                                }}
                            />
                            {/* Ícono para limpiar búsqueda */}
                            <InputGroup.Text
                                onClick={handleClear}
                                style={{
                                    cursor: 'pointer',
                                    background: '#f0f0f0',
                                    border: 'transparent',
                                }}
                            >
                                <IoCloseCircle />
                            </InputGroup.Text>
                        </InputGroup>
                    </div>
                    
                    {/* Renderizado condicional de actividades */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        filteredActivities.length > 0 ? (
                            filteredActivities.map(activity => (
                                <Activity
                                    id={activity.id}
                                    name={activity.name} 
                                    addressess={activity.addressess} 
                                    time={activity.time}
                                    onUpdateActivity={handleUpdateActivity}  // Pasando la función correctamente
                                    onDeleteActivity={handleDeleteActivity} // Añadir prop
                                />
                            ))
                        ) : (
                            <div>No hay actividades disponibles.</div>
                        )
                    )}
                </Card.Body>
            </Card>
            {/* Modal para crear nuevas actividades */}
            <CreateActivities 
                show={showCreateActivies} 
                handleClose={handleCloseCreateActivites} 
                onSave={handleCreateActivity}
            />
        </div>
    );
}

// Componente contenedor de Activities
function Activities() {
    return (
        <Container id='contActivities' className="vh-100">
            <Container>
                <ActivityList />
            </Container>
        </Container>
    );
}

export default Activities;