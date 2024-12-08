import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTranslation } from 'react-i18next';
import Landing from '../landing/Landing';

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
  }));
  
  describe('Landing', () => {
    beforeEach(() => {
      useTranslation.mockReturnValue({ t: (key) => key });
    });

    test('renders the headline image and motto', () => {
        render(<Landing />);

        const image = screen.getByAltText('Vector');
        expect(image).toBeInTheDocument();

        const motto = screen.getByText('Motto');
        expect(motto).toBeInTheDocument();
    });

    test('renders the form fields with placeholders', () => {
        render(<Landing />);

        const destinationInput = screen.getByPlaceholderText('Destination');
        expect(destinationInput).toBeInTheDocument();

        const travelTypeSelect = screen.getAllByLabelText('TravelType');
        expect(travelTypeSelect[0]).toBeInTheDocument();

        const durationSelect = screen.getAllByLabelText('Duration');
        expect(durationSelect[0]).toBeInTheDocument();
    });

    test('renders the form options in dropdowns', () => {
        render(<Landing />);
        
        const travelOptions = ['business', 'pleasure', 'family', 'friends'];
        travelOptions.forEach((option) => {
            expect(screen.getByText(option)).toBeInTheDocument();
        });

        const durationOptions = [`1-3 ${'Days'}`, `4-7 ${'Days'}`];
        durationOptions.forEach((option) => {
            expect(screen.getByText(option)).toBeInTheDocument();
        });
    });

    test('renders and clicks the submit button', () => {
        render(<Landing />);

        const submitButton = screen.getByRole('button', { name: 'Send' });
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);
    });
});
