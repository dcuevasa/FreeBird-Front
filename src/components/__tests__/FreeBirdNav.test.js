import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FreeBirdNav from '../freeBirdNav/FreeBirdNav';
import { useTranslation } from 'react-i18next';


jest.mock('../profile/ProfilePopUp', () => ({ show, handleClose }) => (
  show ? <div data-testid="ProfilePopUp" onClick={handleClose}>Profile Popup</div> : null
));
jest.mock('../itinerary/ItineraryPopUp', () => ({ show, handleClose }) => (
  show ? <div data-testid="ItineraryPopUp" onClick={handleClose}>Itinerary Popup</div> : null
));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('FreeBirdNav', () => {
  beforeEach(() => {
    useTranslation.mockReturnValue({ t: (key) => key });
  });

  test('renders the FreeBirdNav component', () => {
    render(<FreeBirdNav />);

    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Plans')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('PlanNow')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('opens and closes ProfilePopUp when profile link is clicked', () => {
    render(<FreeBirdNav />);

    const profileButton = screen.getByText('Login');
    
    fireEvent.click(profileButton);
    expect(screen.getByTestId('ProfilePopUp')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('ProfilePopUp')); 
    expect(screen.queryByTestId('ProfilePopUp')).not.toBeInTheDocument();
  });

  test('opens and closes ItineraryPopUp when itinerary button is clicked', () => {
    render(<FreeBirdNav />);

    const itineraryButton = screen.getByText('PlanNow');
    
    fireEvent.click(itineraryButton);
    expect(screen.getByTestId('ItineraryPopUp')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('ItineraryPopUp')); 
    expect(screen.queryByTestId('ItineraryPopUp')).not.toBeInTheDocument();
  });

  test('Plans navigates to right path', () => {
    render(<FreeBirdNav />);
  
    const link = screen.getByText('Plans');
    expect(link).toHaveAttribute('href', '/plans');
  });

  test('Friends navigates to right path', () =>{
    render(<FreeBirdNav />);
  
    const link = screen.getByText('Friends');
    expect(link).toHaveAttribute('href', '/friends');
  });

  test('Activities navigates to right path', () =>{
    render(<FreeBirdNav />);
  
    const link = screen.getByText('Activities');
    expect(link).toHaveAttribute('href', '/activities');
  });
});
