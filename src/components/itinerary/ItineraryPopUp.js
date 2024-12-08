import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import AddMemberPopUp from "./AddMemberPopUp";
import "./ItineraryPopUp.css"; // Custom styles here
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ItineraryPopUp = ({ show, handleClose}) => {
  const { t } = useTranslation();

  const [destinations, setDestinations] = useState([""]);
  const [showAddMemberPopUp, setShowAddMemberPopUp] = useState(false);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [transport, setTransport] = useState('');
  const [members, setMembers] = useState([]);

  const addMember = (member) => {
    setMembers([...members, member]);
  };

  const addDestination = () => {
    setDestinations([...destinations, ""]);
  };

  const handleDestinationChange = (index, event) => {
    const newDestinations = [...destinations];
    newDestinations[index] = event.target.value;
    setDestinations(newDestinations);
    setDestination(event.target.value);
  };

  const handleAddMemberClick = () => {
    setShowAddMemberPopUp(true);
  };

  const handleCloseAddMemberPopUp = () => {
    setShowAddMemberPopUp(false);
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const handleCreateItinerary = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/itinerary', {
        name: name,
        budget: Number(budget),
        destination: destination,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        preferences: preferences,
        transport: transport
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        alert(t('itineraryCreated'));
        console.log('Itinerario creado:', response.data);
        console.log('Miembros:', members);
        for (const member of members) {
          const memberResponse = await axios.post(`http://localhost:3000/api/v1/itineraries/${response.data.id}/users/${member.id}`, {
            userId: member.id
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('Miembro añadido:', memberResponse.data);
        }
      }
    } catch (error) {
      console.error('Error al crear itinerario:', error);
      if (error.response) {
        alert(error.response.data.message);
      }
    }
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="custom-modal-width">
        <Modal.Header id="close-button" closeButton>
          <Modal.Title id="editar-itinerario-title" className="w-100 text-center">
            {t('generateItinerary')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="itinerary-edit-form">
            <Form.Group id="itinerary-name-div" className="mb-3">
              <Form.Label>{t('insertItineraryName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('bogotaTravel')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group id="budget-div" className="mb-3">
              <Form.Label>{t('budget')}</Form.Label>
              <Form.Control type="number" placeholder="USD 3000" value={budget}
                onChange={(e) => setBudget(e.target.value)} />
              <i className="info-icon">i</i>
            </Form.Group>


            <Form.Group className="mb-3 destination-div">
              <Form.Label className="activity-preferences-label">{t('destination')} #1 </Form.Label>
              {destinations.map((destination, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder={`${t('destination')} #${index + 1}`}
                  value={destination}
                  onChange={(event) => handleDestinationChange(index, event)}
                  className="mb-2"
                />
              ))}
              <Form.Label
                className="activity-preferences-label text-primary"
                style={{ cursor: "pointer" }}
                onClick={addDestination}
              >
                {'+ ' + t('add') + ' ' + t('destination')}
              </Form.Label>
              <Form.Label className="activity-preferences-label" style={{ cursor: "pointer" }} onClick={handleAddMemberClick}>{'+ ' + t('addMember')}</Form.Label>
            </Form.Group>

            <Form.Group id="dates-div" className="mb-3">
              <Form.Label>{t('start')}</Form.Label>
              <Form.Label id="date-end-label">{t('end')}</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control id="date-input-init" placeholder={`${t('july')} 28`}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} />
                <FaArrowRight />
                <Form.Control id="date-input-end" placeholder={`${t('july')} 28`}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </Form.Group>

            <Form.Group id="div-preferencias" className="mb-3">
              <Form.Label className="activity-preferences-label">{t('preferedActivities')} {t('optional')}</Form.Label>
              <div className="activity-preferences">
                <Form.Check inline label={t('culture')} className="custom-checkbox" aria-label="culture" checked={preferences.includes('culture')}
                  onChange={() => handlePreferenceChange('culture')} />
                <Form.Check inline label={t('outdoors')} className="custom-checkbox" aria-label="outdoors" checked={preferences.includes('outdoors')}
                  onChange={() => handlePreferenceChange('outdoors')} />
                <Form.Check inline label={t('relaxing')} className="custom-checkbox" aria-label="relaxing" checked={preferences.includes('relaxing')}
                  onChange={() => handlePreferenceChange('relaxing')} />
                <Form.Check inline label={t('wildlife')} className="custom-checkbox" aria-label="wildlife" checked={preferences.includes('wildlife')}
                  onChange={() => handlePreferenceChange('wildlife')} />
                <Form.Check inline label={t('romantic')} className="custom-checkbox" aria-label="romantic" checked={preferences.includes('romantic')}
                  onChange={() => handlePreferenceChange('romantic')} />
                <Form.Check inline label={t('religious')} className="custom-checkbox" aria-label="religious" checked={preferences.includes('religious')}
                  onChange={() => handlePreferenceChange('religious')} />
                <Form.Check inline label={t('hiking')} className="custom-checkbox" aria-label="hiking" checked={preferences.includes('hiking')}
                  onChange={() => handlePreferenceChange('hiking')} />
                <Form.Check inline label={t('music')} className="custom-checkbox" aria-label="music" checked={preferences.includes('music')}
                  onChange={() => handlePreferenceChange('music')} />
                <Form.Check inline label={t('shopping')} className="custom-checkbox" aria-label="shopping" checked={preferences.includes('shopping')}
                  onChange={() => handlePreferenceChange('shopping')} />
                <Form.Check inline label={t('business')} className="custom-checkbox" aria-label="business" checked={preferences.includes('business')}
                  onChange={() => handlePreferenceChange('business')} />
                <Form.Check inline label={t('museum')} className="custom-checkbox" aria-label="museum" checked={preferences.includes('museum')}
                  onChange={() => handlePreferenceChange('museum')} />
                <Form.Check inline label={t('party')} className="custom-checkbox" aria-label="party" checked={preferences.includes('party')}
                  onChange={() => handlePreferenceChange('party')} />
                <Form.Check inline label={t('traditional')} className="custom-checkbox" aria-label="traditional" checked={preferences.includes('traditional')}
                  onChange={() => handlePreferenceChange('traditional')} />
                <Form.Check inline label={t('march')} className="custom-checkbox" aria-label="march" checked={preferences.includes('march')}
                  onChange={() => handlePreferenceChange('march')} />
                <Form.Check inline label={t('fishing')} className="custom-checkbox" aria-label="fishing" checked={preferences.includes('fishing')}
                  onChange={() => handlePreferenceChange('fishing')} />
                <Form.Check inline label={t('cruise')} className="custom-checkbox" aria-label="cruise" checked={preferences.includes('cruise')}
                  onChange={() => handlePreferenceChange('cruise')} />
                <Form.Check inline label={t('guided')} className="custom-checkbox" aria-label="guided" checked={preferences.includes('guided')}
                  onChange={() => handlePreferenceChange('guided')} />
                <Form.Check inline label={t('health')} className="custom-checkbox" aria-label="health" checked={preferences.includes('health')}
                  onChange={() => handlePreferenceChange('health')} />
                <Form.Check inline label={t('comodities')} className="custom-checkbox" aria-label="comodities" checked={preferences.includes('comodities')}
                  onChange={() => handlePreferenceChange('comodities')} />
              </div>
            </Form.Group>

            <Form.Group id="div-preferencias-transporte" className="mb-3">
              <Form.Label className="activity-preferences-label">{t('preferedTransport')} {t('optional')}</Form.Label>
              <div className="activity-preferences">
                <Form.Check inline label={t('bicycle')} className="custom-checkbox" aria-label="bicycle" checked={transport === 'bicycle'}
                  onChange={() => setTransport('bicycle')} />
                <Form.Check inline label={t('car')} className="custom-checkbox" aria-label="car" checked={transport === 'car'}
                  onChange={() => setTransport('car')} />
                <Form.Check inline label={t('bus')} className="custom-checkbox" aria-label="bus" checked={transport === 'bus'}
                  onChange={() => setTransport('bus')} />
                <Form.Check inline label={t('walk')} className="custom-checkbox" aria-label="walk" checked={transport === 'walk'}
                  onChange={() => setTransport('walk')} />
                <Form.Check inline label={t('bike')} className="custom-checkbox" aria-label="bike" checked={transport === 'bike'}
                  onChange={() => setTransport('bike')} />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between">

              <Button
                variant="orange"
                type="button"
                id="create-button"
                className="create_button orange-button"
                onClick={handleCreateItinerary}
              >
                {t('generate')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <AddMemberPopUp show={showAddMemberPopUp} handleClose={handleCloseAddMemberPopUp}  onMemberAdd={addMember}/>
    </>
  );
};

export default ItineraryPopUp;
