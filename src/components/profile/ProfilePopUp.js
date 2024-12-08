import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./ProfilePopUp.css"; // Custom styles here
import DeletePopUp from '../delete/DeletePopUp';
import { useTranslation } from 'react-i18next';
import axios from "axios";

const ProfilePopUp = ({ show, handleClose, isProfileCreated, setIsProfileCreated, handleCreateProfile, handleDeleteProfile }) => {

  const { t } = useTranslation();

  // Estado para guardar los datos del perfil y el prefijo y número de teléfono por separado
  const [profileData, setProfileData] = useState({});
  const [phonePrefix, setPhonePrefix] = useState("");  // Para guardar el prefijo del teléfono
  const [phoneNumber, setPhoneNumber] = useState("");  // Para guardar el número sin el prefijo
  const [isEditable, setIsEditable] = useState(!isProfileCreated);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [checkboxes, setCheckboxes] = useState({})

  // Nuevos estados para registro
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para separar el prefijo y el número de teléfono
  const separatePhoneNumber = (fullPhoneNumber) => {
    const prefixRegex = /^\+\d+/;  // Captura el prefijo que comienza con '+'
    const prefixMatch = fullPhoneNumber.match(prefixRegex);
    if (prefixMatch) {
      const prefix = prefixMatch[0];
      const number = fullPhoneNumber.replace(prefix, "").trim();  // Remueve el prefijo del número
      setPhonePrefix(prefix);
      setPhoneNumber(number);
    }
  };

  // Fetch de datos de la API mock cuando el perfil no ha sido creado
  useEffect(() => {
    if (!isProfileCreated) {
      fetch('https://my.api.mockaroo.com/free_bird_profile.json?key=7350e8b0')
        .then(response => response.json())
        .then(data => {
          setProfileData(data);
          setCheckboxes({
            relaxing: data.relaxing || false,
            culture: data.culture || false,
            outdoors: data.outdoors || false,
            wildlife: data.wildlife || false,
            romantic: data.romantic || false,
            religious: data.religious || false,
            hiking: data.hiking || false,
            music: data.musical || false,
            shopping: data.shopping || false,
            business: data.business || false,
            museum: data.museums || false,
            party: data.party || false,
            traditional: data.traditions || false,
            march: data.walks || false,
            fishing: data.fishing || false,
            cruise: data.cruise || false,
            guided: data.guide || false,
            health: data.healthcare || false,
            comodities: data.accommodation || false,
          });

          // Separa el prefijo y el número de teléfono
          separatePhoneNumber(data.phone_number);
        })
        .catch(error => console.error("Error fetching data:", error));
    }
  }, [isProfileCreated]);

  // Para editar o crear perfil
  const handleEditClick = async () => {
    if (!isProfileCreated) {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/user', {
          name: username,
          email: email,
          phone: phoneNumber,  // Asumiendo que tienes phoneNumber como estado
          profilePic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",  // Asumiendo que tienes un estado para la imagen
          password: password
        },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });

        localStorage.setItem('userID', response.data.id);
        handleCreateProfile();
        handleClose();
      } catch (error) {
        if (error.response) {
          console.error('Error del servidor:', error.response.data);
          if (error.response.data.message[0] == 'password is not strong enough') {
            alert("La contraseña no es lo suficientemente fuerte. Debe contener al menos 10 caracteres, incluyendo mayúsculas, minúsculas y números.");
          }
        } else if (error.request) {
          console.error('Error de conexión:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      }

      const response = await fetch('http://localhost:3000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      }).then(async response => {
        let rta = await response.json();
        if (!response.ok) {
          throw new Error(rta.message);
        }
        return rta;
      })
        .then(async data => {
          localStorage.setItem('token', data.token);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          alert(error.message);
        });
    } else {
      setIsEditable(!isEditable);
    }
  };

  const handleOpenDeletePopup = () => setShowDeletePopup(true);
  const handleCloseDeletePopup = () => setShowDeletePopup(false);

  const handleDeleteProfileDeletePopup = () => {
    handleCloseDeletePopup();  // Cierra el DeletePopUp
    handleDeleteProfile();  // Cierra el ProfilePopUp
    setIsEditable(true);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    console.log(name, checked);
    setCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="custom-modal-width">
        <Modal.Header id="close-button" closeButton alt="close-button">
          <Modal.Title id="editar-perfil-title" className="w-100 text-center">
            {isProfileCreated ? t('editProfile') : t('createProfile')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="user-edit-form">
            <Form.Group id="user-name-div" className="mb-3">
              <Form.Label>{t('userName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Juan Pérez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={!isEditable}
              />
              <i className="info-icon">i</i>
            </Form.Group>

            <Form.Group id="email-div" className="mb-3">
              <Form.Label>{t('email')}</Form.Label>
              <Form.Control
                type="email"
                placeholder="user.example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!isEditable}
              />
              <i className="info-icon">i</i>
            </Form.Group>

            <Form.Group id="numero-telefono-div" className="mb-3">
              <Row>
                <Col xs={4} id="columna-input-prefijo-telefono">
                  <div id="numero-telefono-input-div">
                    <Form.Label>{t('prefix')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={phonePrefix}
                      readOnly={!isEditable}
                      placeholder="+57"
                      onChange={(e) => setPhonePrefix(e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs={8} id="columna-input-numero-telefono">
                  <div id="numero-telefono-input-div">
                    <Form.Label>{t('phoneNumber')}</Form.Label>
                    <Form.Control
                      id="input-numero-telefono"
                      type="text"
                      placeholder="302 347 95 44"
                      value={phoneNumber}
                      readOnly={!isEditable}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <i id="input-info" className="info-icon">i</i>
                  </div>
                </Col>
              </Row>
            </Form.Group>

            {!isProfileCreated && (
              <Form.Group id="password-div" className="mb-3">
                <Form.Label>{t('password')}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  readOnly={!isEditable}
                />
                <i className="info-icon">i</i>
              </Form.Group>
            )}

            <Form.Group id="div-preferencias" className="mb-3">
              <Form.Label role="none" className="activity-preferences-label">{t('preferedActivities')} {t('optional')}</Form.Label>
              <div className="activity-preferences">
                <Form.Check
                  inline
                  label={t('culture')}
                  disabled={!isEditable}
                  checked={checkboxes.culture || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="culture"
                  className="custom-checkbox"
                  placeholder="culture"
                />
                <Form.Check
                  inline
                  label={t('outdoors')}
                  disabled={!isEditable}
                  checked={checkboxes.outdoors || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="outdoors"
                  className="custom-checkbox"
                  placeholder="outdoors"
                />
                <Form.Check
                  inline
                  label={t('relaxing')}
                  disabled={!isEditable}
                  checked={checkboxes.relaxing || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="relaxing"
                  className="custom-checkbox"
                  placeholder="relaxing"
                />
                <Form.Check
                  inline
                  label={t('wildlife')}
                  disabled={!isEditable}
                  checked={checkboxes.wildlife || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="wildlife"
                  className="custom-checkbox"
                  placeholder="wildlife"
                />
                <Form.Check
                  inline
                  label={t('romantic')}
                  disabled={!isEditable}
                  checked={checkboxes.romantic || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="romantic"
                  className="custom-checkbox"
                  placeholder="romantic"
                />
                <Form.Check
                  inline
                  label={t('religious')}
                  disabled={!isEditable}
                  checked={checkboxes.religious || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="religious"
                  className="custom-checkbox"
                  placeholder="religious"
                />
                <Form.Check
                  inline
                  label={t('hiking')}
                  disabled={!isEditable}
                  checked={checkboxes.hiking || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="hiking"
                  className="custom-checkbox"
                  placeholder="hiking"
                />
                <Form.Check
                  inline
                  label={t('music')}
                  disabled={!isEditable}
                  checked={checkboxes.musical || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="musical"
                  className="custom-checkbox"
                  placeholder="music"
                />
                <Form.Check
                  inline
                  label={t('shopping')}
                  disabled={!isEditable}
                  checked={checkboxes.shopping || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="shopping"
                  className="custom-checkbox"
                  placeholder="shopping"
                />
                <Form.Check
                  inline
                  label={t('business')}
                  disabled={!isEditable}
                  checked={checkboxes.business || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="business"
                  className="custom-checkbox"
                  placeholder="business"
                />
                <Form.Check
                  inline
                  label={t('museum')}
                  disabled={!isEditable}
                  checked={checkboxes.museums || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="museums"
                  className="custom-checkbox"
                  placeholder="museum"
                />
                <Form.Check
                  inline
                  label={t('party')}
                  disabled={!isEditable}
                  checked={checkboxes.party || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="party"
                  className="custom-checkbox"
                  placeholder="party"
                />
                <Form.Check
                  inline
                  label={t('traditional')}
                  disabled={!isEditable}
                  checked={checkboxes.traditions || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="traditions"
                  className="custom-checkbox"
                  placeholder="traditional"
                />
                <Form.Check
                  inline
                  label={t('march')}
                  disabled={!isEditable}
                  checked={checkboxes.walks || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="walks"
                  className="custom-checkbox"
                  placeholder="march"
                />
                <Form.Check
                  inline
                  label={t('fishing')}
                  disabled={!isEditable}
                  checked={checkboxes.fishing || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="fishing"
                  className="custom-checkbox"
                  placeholder="fishing"
                />
                <Form.Check
                  inline
                  label={t('cruise')}
                  disabled={!isEditable}
                  checked={checkboxes.cruise || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="cruise"
                  className="custom-checkbox"
                  placeholder="cruise"
                />
                <Form.Check
                  inline
                  label={t('guided')}
                  disabled={!isEditable}
                  checked={checkboxes.guide || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="guide"
                  className="custom-checkbox"
                  placeholder="guided"
                />
                <Form.Check
                  inline
                  label={t('health')}
                  disabled={!isEditable}
                  checked={checkboxes.healthcare || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="healthcare"
                  className="custom-checkbox"
                  placeholder="health"
                />
                <Form.Check
                  inline
                  label={t('comodities')}
                  disabled={!isEditable}
                  checked={checkboxes.accommodation || false}
                  onChange={handleCheckboxChange}
                  onClick={handleCheckboxChange}
                  name="accommodation"
                  className="custom-checkbox"
                  placeholder="comodities"
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between">
              {isProfileCreated && (
                <Button
                  variant="red"
                  type="button"
                  className="delete_button red-button"
                  onClick={handleOpenDeletePopup}
                >
                  {t('deleteProfile')}
                </Button>
              )}

              <Button
                variant="orange"
                type="button"
                className="create_button orange-button"
                onClick={handleEditClick}
              >
                {isProfileCreated ? (isEditable ? t('saveChanges') : t('editProfile')) : t('createProfile')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {showDeletePopup && (
        <DeletePopUp
          show={showDeletePopup}
          handleClose={handleCloseDeletePopup}
          handleDelete={handleDeleteProfileDeletePopup}
        />
      )}
    </>
  );
};

export default ProfilePopUp;
