import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import ItineraryPopUp from '../itinerary/ItineraryPopUp'; // Adjust the import path accordingly
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Path to your main i18n configuration

describe("ItineraryPopUp Component", () => {
    const mockHandleClose = jest.fn();
    const mockHandleCreateItinerary = jest.fn();
    const mockHandleDeleteItinerary = jest.fn();

    // Test for rendering modal and form elements correctly
    // Test for rendering modal and form elements correctly
    test("renders modal and form elements correctly", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={true}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        // Ensure translation is being rendered correctly
        expect(screen.getByText(i18n.t('generateItinerary'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('insertItineraryName'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('budget'))).toBeInTheDocument();
    });


    // Test for handling user input for itinerary name
    test("handles itinerary name input correctly", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={true}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        const itineraryNameInput = screen.getByPlaceholderText(i18n.t('bogotaTravel'));
        fireEvent.change(itineraryNameInput, { target: { value: 'Trip to Paris' } });

        expect(itineraryNameInput.value).toBe('Trip to Paris');
    });

    // Test for adding destinations
    test("handles adding new destinations correctly", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={true}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        const addDestinationButton = screen.getByText('+ ' + i18n.t('add')+ ' ' +i18n.t('destination'));
        fireEvent.click(addDestinationButton);
    });

    // Test for handling "Add Member" button click
    test("should open AddMemberPopUp when 'Add Member' button is clicked", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={true}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        const addMemberButton = screen.getByText('+ ' + i18n.t('addMember'));
        fireEvent.click(addMemberButton);

        // Check if the AddMemberPopUp modal appears (depending on how the pop-up modal is implemented)
        expect(screen.getByText(i18n.t('insertUserName'))).toBeInTheDocument();
    });

    // Test for modal visibility when show prop is true
    test("should render modal when show prop is true", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={true}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        // Check if the modal is visible when 'show' is true
        expect(screen.getByText(i18n.t('generateItinerary'))).toBeInTheDocument();
    });

    // Test for modal visibility when show prop is false
    test("should not render modal when show prop is false", () => {
        render(
            <I18nextProvider i18n={i18n}>
                <ItineraryPopUp
                    show={false}
                    handleClose={mockHandleClose}
                    isItineraryCreated={false}
                    setIsItineraryCreated={jest.fn()}
                    handleCreateItinerary={mockHandleCreateItinerary}
                    handleDeleteItinerary={mockHandleDeleteItinerary}
                />
            </I18nextProvider>
        );

        // Check if the modal is not visible when 'show' is false
        expect(screen.queryByText(i18n.t('generateItinerary'))).toBeNull();
    });

});
