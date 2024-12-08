import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import AddMemberPopUp from '../itinerary/AddMemberPopUp';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe("AddMemberPopUp Component", () => {
  const mockHandleClose = jest.fn();
  const mockHandleSubmit = jest.fn();

  // Test for rendering modal and form elements correctly
  test("renders modal and form elements correctly", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={true} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Test placeholder text
    expect(screen.getByPlaceholderText('pedro_viajero3')).toBeInTheDocument();

    // Test translated labels and texts
    expect(screen.getByText(i18n.t('culture'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('insertUserName'))).toBeInTheDocument();
  });

  // Test for handling user input
  test("renders input and captures username", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={true} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Find the input field by its placeholder (username)
    const input = screen.getByPlaceholderText('pedro_viajero3');

    // Simulate typing into the input
    fireEvent.change(input, { target: { value: 'newUser123' } });

    // Ensure the input value has been updated correctly
    expect(input.value).toBe('newUser123');
  });

  // Test for handling form submission
  test("handles form submission correctly", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={true} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Use getByRole with the name prop to match the button by its accessible name
    const addButton = screen.getByRole('button', { name: i18n.t('addMember') });
    fireEvent.click(addButton);

    await new Promise(resolve => setTimeout(resolve, 1000));
    // Ensure the close handler was called
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });


  // Test for modal visibility when show prop is true
  test("should render modal when show prop is true", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={true} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Check if the modal is visible when 'show' is true
    expect(screen.getByText(i18n.t('insertUserName'))).toBeInTheDocument();
  });

  // Test for modal visibility when show prop is false
  test("should not render modal when show prop is false", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={false} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Check if the modal is not visible when 'show' is false
    expect(screen.queryByText(i18n.t('insertUserName'))).toBeNull();
  });

  // Test for button click behavior (Cancel button click should trigger handleClose)
  // Test for handling button click behavior
  test("should close the modal when Add Member button is clicked", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AddMemberPopUp show={true} handleClose={mockHandleClose} />
      </I18nextProvider>
    );

    // Use getByRole to select the button with the role 'button' and name 'Add Member'
    const addButton = screen.getByRole('button', { name: i18n.t('addMember') });
    fireEvent.click(addButton);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Ensure the close handler was called
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });


});
