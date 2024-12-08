import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteActivities from "../activities/DeleteActivities";
import { I18nextProvider } from "react-i18next";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key, // Retorna la clave como texto
  }),
  I18nextProvider: ({ children }) => children,
}));

describe("DeleteActivities Component", () => {
  it("renders the modal with the correct text", () => {
    render(
      <DeleteActivities 
        show={true} 
        handleClose={jest.fn()} 
      />
    );

    // Verificar texto de confirmación
    expect(screen.getByText("deleteActivity.confirmation")).toBeInTheDocument();
    expect(screen.getByText("deleteActivity.permanentDeletion")).toBeInTheDocument();

    // Verificar que el botón de eliminar esté presente
    expect(screen.getByText("deleteActivity.confirm")).toBeInTheDocument();
  });

  it("calls handleClose when the close button is clicked", () => {
    const handleCloseMock = jest.fn();

    render(
      <DeleteActivities 
        show={true} 
        handleClose={handleCloseMock} 
      />
    );

    // Simular clic en el botón de cerrar
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Verificar que se haya llamado a handleClose
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it("calls handleClose when the confirm button is clicked", () => {
    const handleCloseMock = jest.fn();

    render(
      <DeleteActivities 
        show={true} 
        handleClose={handleCloseMock} 
      />
    );

    // Simular clic en el botón de confirmar eliminación
    const confirmButton = screen.getByText("deleteActivity.confirm");
    fireEvent.click(confirmButton);

    // Verificar que se haya llamado a handleClose
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it("does not render the modal when show is false", () => {
    render(
      <DeleteActivities 
        show={false} 
        handleClose={jest.fn()} 
      />
    );

    // Verificar que el modal no está en el documento
    expect(screen.queryByText("deleteActivity.confirmation")).not.toBeInTheDocument();
    expect(screen.queryByText("deleteActivity.confirm")).not.toBeInTheDocument();
  });
});
