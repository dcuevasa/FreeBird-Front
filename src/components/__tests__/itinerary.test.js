import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Itinerary from '../itinerary/Itinerary';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

const mockItineraryData = {
  destination: 'Bogotá',
  days: [
    
    {
      date: '2024-01-01',
      activities: [
        { name: 'Visit the Museum of Gold', time: '10:00', addresses: [{ address: 'Calle 16 #5-41' }], creator: 0 },
        { name: 'Hiking at Monserrate', time: '14:00', addresses: [{ address: 'Monserrate Hill' }], creator: 1 },
      ],
    },
  ],
  members: [
    { profilePic: '/path/to/profile1.jpg' },
    { profilePic: '/path/to/profile2.jpg' },
  ],
};

describe('Itinerary Component', () => {
  test('renders itinerary data correctly', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Itinerary itineraryData={mockItineraryData} />
      </I18nextProvider>
    );

    expect(screen.getByText(/Bogotá/i)).toBeInTheDocument();

    expect(screen.getByText(/Visit the Museum of Gold/i)).toBeInTheDocument();
    expect(screen.getByText(/Hiking at Monserrate/i)).toBeInTheDocument();

    expect(screen.getByText(/Monday, January 1/i)).toBeInTheDocument();
  });

  test('toggles edit mode on button click', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Itinerary itineraryData={mockItineraryData} />
      </I18nextProvider>
    );

    await screen.findByText(/Visit the Museum of Gold/i);

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(editButton.textContent).toBe(' Done ');
    fireEvent.click(editButton);

    expect(editButton.textContent).toBe(' Edit ');
  });

  test('opens modal and changes time input in edit mode', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Itinerary itineraryData={mockItineraryData} />
      </I18nextProvider>
    );

    await screen.findByText(/Visit the Museum of Gold/i);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const modalButton = screen.getAllByRole('button', { name: /edit/i })[1];
    fireEvent.click(modalButton);

    await screen.findByText(/Select Time/i);

    const timeInput = screen.getByLabelText(/Select Time/i);
    fireEvent.change(timeInput, { target: { value: '12:00' } });
    expect(timeInput.value).toBe('12:00');
  });

  test('renders member profile pictures', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Itinerary itineraryData={mockItineraryData} />
      </I18nextProvider>
    );

    await screen.findAllByAltText(/profile/i);

    const profilePics = screen.getAllByAltText(/profile/i);
    expect(profilePics.length).toBeGreaterThan(0);
    expect(profilePics[0].src).toContain(mockItineraryData.members[0].profilePic);
  });
});
