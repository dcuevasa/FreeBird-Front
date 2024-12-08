import React, { useState } from "react";
import { Modal, Button, Form} from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import "./ItineraryPopUp.css"; // Custom styles here
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AddMemberPopUp = ({ show, handleClose, onMemberAdd }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');

  const handleAddMember = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/user/by-name/${username}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        console.log('Usuario encontrado:', response.data);
        onMemberAdd(response.data);
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
    }
    handleClose();
  };

  return (
    <>
    <Modal id="add-member-popup" show={show} onHide={handleClose} centered className="custom-modal-width">
      <Modal.Header id="close-button-member" closeButton>
        <Modal.Title id="editar-itinerario-title" className="w-100 text-center">
          {t('addMember')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="itinerary-edit-form">
          <Form.Group id="itinerary-name-div" className="mb-3">
            <Form.Label>{t('insertUserName')}</Form.Label>
            <Form.Control 
              id="itinerary-name-input" 
              type="text" 
              placeholder="pedro_viajero3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="info-icon">i</i>
          </Form.Group>

          <Form.Group id="dates-div" className="mb-3">
            <Form.Label>{t('start')}</Form.Label>
            <Form.Label id="date-end-label">{t('end')}</Form.Label>
            <div className="d-flex align-items-center"> 
              <Form.Control id="date-input-init" placeholder={`${t('july')} 05`}/>
              <FaArrowRight/>
              <Form.Control id="date-input-end" placeholder={`${t('july')} 28`}/>
              </div>
          </Form.Group>

          <Form.Group id="div-preferencias" className="mb-3">
            <Form.Label className="activity-preferences-label">{t('preferedActivities')} {t('optional')}</Form.Label>
            <div className="activity-preferences">
              <Form.Check id="culture" inline label={t('culture')}  className="custom-checkbox" />
              <Form.Check id="outdoors" inline label={t('outdoors')}  className="custom-checkbox" />
              <Form.Check id="relaxing" inline label={t('relaxing')}  className="custom-checkbox" />
              <Form.Check id="wildlife" inline label={t('wildlife')}  className="custom-checkbox" />
              <Form.Check id="romantic" inline label={t('romantic')}  className="custom-checkbox" />
              <Form.Check id="religious" inline label={t('religious')}  className="custom-checkbox" />
              <Form.Check id="hiking" inline label={t('hiking')}  className="custom-checkbox" />
              <Form.Check id="music" inline label={t('music')}  className="custom-checkbox" />
              <Form.Check id="shopping" inline label={t('shopping')}  className="custom-checkbox" />
              <Form.Check id="business" inline label={t('business')}  className="custom-checkbox" />
              <Form.Check id="museum" inline label={t('museum')}  className="custom-checkbox" />
              <Form.Check id="party" inline label={t('party')}  className="custom-checkbox" />
              <Form.Check id="traditional" inline label={t('traditional')}  className="custom-checkbox" />
              <Form.Check id="march" inline label={t('march')}  className="custom-checkbox" />
              <Form.Check id="fishing" inline label={t('fishing')}  className="custom-checkbox" />
              <Form.Check id="cruise" inline label={t('cruise')}  className="custom-checkbox" />
              <Form.Check id="guided" inline label={t('guided')}  className="custom-checkbox" />
              <Form.Check id="health" inline label={t('health')}  className="custom-checkbox" />
              <Form.Check id="comodities" inline label={t('comodities')}  className="custom-checkbox" />
            </div>
          </Form.Group>

          <Form.Group id="div-preferencias-transporte" className="mb-3">
            <Form.Label className="activity-preferences-label">{t('preferedTransport')} {t('optional')}</Form.Label>
            <div className="activity-preferences">
              <Form.Check id="bicycle" inline label={t('bicycle')}  className="custom-checkbox" />
              <Form.Check id="car" inline label={t('car')}  className="custom-checkbox" />
              <Form.Check id="bus" inline label={t('bus')}  className="custom-checkbox" />
              <Form.Check id="walk" inline label={t('walk')}  className="custom-checkbox" />
              <Form.Check id="bike" inline label={t('bike')}  className="custom-checkbox" />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between">

            <Button
              variant="orange"
              type="button"
              id="add-member-button"
              className="create_button orange-button"
              onClick={handleAddMember}
            >
              {t('addMember')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default AddMemberPopUp;
