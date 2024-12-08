import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './FreeBirdNav.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ProfilePopUp from '../profile/ProfilePopUp';
import ItineraryPopUp from '../itinerary/ItineraryPopUp';
import LoginPopUp from '../profile/LoginPopUp';

function FreeBirdNav() {
    const { t } = useTranslation();

    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [isProfileCreated, setIsProfileCreated] = useState(true);
    const [isLogedIn, setIsLogedIn] = useState(false);

    const handleProfileClick = () => setShowProfilePopup(true);
    const handleCloseProfilePopup = () => setShowProfilePopup(false);

    const handleCreateProfile = () => {
      setShowProfilePopup(false); 
    };

    const handleDeleteProfile = () => {
        setIsProfileCreated(false); 
        setShowProfilePopup(false); 
        setIsLogedIn(false);
    };

    const handleLogin = () => {
        handleCloseProfilePopup();
        setIsLogedIn(true);
        setIsProfileCreated(true);
    }


    // -------------------------------------------------------- ItineraryPopUp --------------------------------------------------------
    const [showItineraryPopup, setShowItineraryPopup] = useState(false);

    const handleItineraryClick = () => setShowItineraryPopup(true);
    const handleCloseItineraryPopup = () => setShowItineraryPopup(false);

    return (
        <>
            <Navbar expand="lg" className="navbar navbar-dark">
                <Container id="cont">
                    <Navbar.Brand href="/"><img className="navbar-brand" src="/logo.svg" alt="Logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto align-items-center">
                            <Nav.Link style={{ width: 'fit-content' }} href='/' className={({ isActive }) => "underline" + (isActive ? " active page" : "")}>{t('Start')}</Nav.Link>
                            <Nav.Link style={{ width: 'fit-content' }} href='/plans' className={({ isActive }) => "underline" + (isActive ? " active page" : "")}>{t('Plans')}</Nav.Link>
                            {/* <Nav.Link style={{ width: 'fit-content' }} href='/friends' className={({ isActive }) => "underline" + (isActive ? " active page" : "")}>{t('Friends')}</Nav.Link> */}
                            <Nav.Link style={{ width: 'fit-content' }} href='/discover'>{t('Discover')}</Nav.Link>
                            <Nav.Link style={{ width: 'fit-content' }} href='/activities' className={({ isActive }) => "underline" + (isActive ? " active page" : "")}>{t('Activities')}</Nav.Link>
                        </Nav>
                        <Nav className='ml-auto align-items-center' style={{ display: 'flex' }}>
                            <Nav.Link href="#" onClick={handleProfileClick} data-testid='LoginButton'>
                                <img id="profile" src="/profile.svg" alt="Profile" />
                                <span className="navbar-text">{t('Login')}</span>
                            </Nav.Link>
                            <Nav.Link id="navRight" href="#link" onClick={handleItineraryClick}>
                                <Button id="plannow">{t('PlanNow')}</Button>
                                <span className="navbar-text">{t('Register')}</span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LoginPopUp 
                show={showProfilePopup && !isLogedIn}
                handleClose={handleCloseProfilePopup}
                onLoginSuccess={handleLogin}
            />

            <ProfilePopUp
                show={showProfilePopup && isLogedIn}
                handleClose={handleCloseProfilePopup}
                isProfileCreated={isProfileCreated}
                setIsProfileCreated={setIsProfileCreated}
                handleCreateProfile={handleCreateProfile}
                handleDeleteProfile={handleDeleteProfile}
                data-testid="ProfilePopUp"
            />
            <ItineraryPopUp
                show={showItineraryPopup}
                handleClose={handleCloseItineraryPopup}
            />
        </>
    );
}

export default FreeBirdNav;
