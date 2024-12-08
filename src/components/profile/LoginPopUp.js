import { React, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ProfilePopUp.css"; // Reutilizamos los estilos
import { useTranslation } from 'react-i18next';
import ProfilePopUp from "./ProfilePopUp";
import axios from "axios";

const LoginPopUp = ({ show, handleClose, onLoginSuccess, handleDeleteProfile }) => {
    const { t } = useTranslation();

    const [ShowRegisterPopup, setShowRegisterPopup] = useState(false);
    const [isProfileCreated, setIsProfileCreated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegisterClick = () => setShowRegisterPopup(true);
    const handleCloseRegisterPopup = () => setShowRegisterPopup(false);


    const handleCreateProfile = () => {
        setShowRegisterPopup(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        try {

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


            const response2 = await fetch('http://localhost:3000/api/v1/user/by-email/' + email, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(async response2 => {
                let rta = await response2.json();
                if (!response2.ok) {
                    throw new Error(rta.message);
                }
                console.log(rta);
                return rta;
            })
            .then(async data => {
                localStorage.setItem('userID', data.id);
            })
            
            onLoginSuccess();
            handleClose();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className="custom-modal-width">
                <Modal.Header id="close-button" closeButton>
                    <Modal.Title id="login-title" className="w-100 text-center">
                        {t('welcomeBack')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="login-form" onSubmit={handleLogin}>
                        <Form.Group id="login-email-div" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <i className="info-icon">i</i>
                        </Form.Group>

                        <Form.Group id="login-password-div" className="mb-3">
                            <Form.Label>{t('password')}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i className="info-icon">i</i>
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-3 gap-4">
                            <Form.Check
                                type="checkbox"
                                label={t('rememberMe')}
                                className="custom-checkbox"
                            />
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <Button
                                variant="orange"
                                type="submit"
                                className="w-100 create_button orange-button"
                                onClick={handleLogin}
                            >
                                {t('login')}
                            </Button>

                            <div className="text-center">
                                <span className="text-muted">{t('noAccount')} </span>
                                <Button
                                    variant="link"
                                    className="p-0 text-decoration-none"
                                    style={{ color: 'var(--naranja)' }}
                                    onClick={handleRegisterClick}
                                >
                                    {t('signUpHere')}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>


            <ProfilePopUp
                show={ShowRegisterPopup}
                handleClose={handleCloseRegisterPopup}
                isProfileCreated={isProfileCreated}
                setIsProfileCreated={setIsProfileCreated}
                handleCreateProfile={handleCreateProfile}
                handleDeleteProfile={handleDeleteProfile}
                data-testid="ProfilePopUp"
            />
        </>
    );
};

export default LoginPopUp;