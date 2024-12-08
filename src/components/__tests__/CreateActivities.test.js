import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateActivities from "../activities/CreateActivities";

// Mock de `useTranslation` para evitar warnings
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key, // Retorna las claves de traducción
    }),
}));

describe("CreateActivities Component", () => {
    const mockHandleClose = jest.fn();

    it("renders the CreateActivities modal with initial empty fields", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        // Verifica que los campos estén vacíos al inicio
        const nameInput = screen.getByPlaceholderText("enterActivityName");
        expect(nameInput).toBeInTheDocument();
        expect(nameInput.value).toBe("");

        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(1);
        expect(directionInputs[0].value).toBe("");

        const hoursInput = screen.getByPlaceholderText("HH");
        const minutesInput = screen.getByPlaceholderText("MM");
        expect(hoursInput.value).toBe("");
        expect(minutesInput.value).toBe("");
    });

    it("updates the name field correctly", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        const nameInput = screen.getByPlaceholderText("enterActivityName");
        fireEvent.change(nameInput, { target: { value: "New Activity" } });
        expect(nameInput.value).toBe("New Activity");
    });

    it("adds a new direction", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        const addDirectionButton = screen.getByText("addDirection");
        fireEvent.click(addDirectionButton);

        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(2); // Ahora debería haber dos campos de dirección
    });

    it("removes a direction (if more than one exists)", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        // Añadir una dirección adicional para que podamos eliminarla
        const addDirectionButton = screen.getByText("addDirection");
        fireEvent.click(addDirectionButton);

        const removeButtons = screen.getAllByRole("button", { name: /remove/i });
        expect(removeButtons).toHaveLength(1); // Solo una dirección adicional tiene botón "Eliminar"

        fireEvent.click(removeButtons[0]); // Elimina la segunda dirección

        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(1); // Vuelve a haber solo una dirección
    });

    it("does not allow removing the last remaining direction", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        const removeButtons = screen.queryByText("remove");
        expect(removeButtons).not.toBeInTheDocument(); // No debería haber botones "Eliminar" para la única dirección
    });

    it("validates hours and minutes input correctly", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        const hoursInput = screen.getByPlaceholderText("HH");
        const minutesInput = screen.getByPlaceholderText("MM");

        // Intenta ingresar valores inválidos
        fireEvent.change(hoursInput, { target: { value: "-5" } });
        fireEvent.change(minutesInput, { target: { value: "70" } });

        // Los valores no deberían actualizarse
        expect(hoursInput.value).toBe("");
        expect(minutesInput.value).toBe("");

        // Ingresa valores válidos
        fireEvent.change(hoursInput, { target: { value: "2" } });
        fireEvent.change(minutesInput, { target: { value: "45" } });

        // Los valores deberían actualizarse correctamente
        expect(hoursInput.value).toBe("2");
        expect(minutesInput.value).toBe("45");
    });

    it("resets fields when modal is closed", () => {
        const { rerender } = render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );
    
        // Modificar campos
        const nameInput = screen.getByPlaceholderText("enterActivityName");
        fireEvent.change(nameInput, { target: { value: "New Activity" } });
    
        const addDirectionButton = screen.getByText("addDirection");
        fireEvent.click(addDirectionButton);
    
        const hoursInput = screen.getByPlaceholderText("HH");
        fireEvent.change(hoursInput, { target: { value: "2" } });
    
        // Cierra el modal
        fireEvent.click(screen.getByText("cancel"));
    
        // Reabrir el modal
        rerender(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );
    
        // Verificar que los campos se hayan restablecido
        expect(nameInput.value).toBe("");
        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(1);
        expect(directionInputs[0].value).toBe("");
        expect(hoursInput.value).toBe("");
    });
    
    it("closes the modal when the cancel button is clicked", () => {
        render(
            <CreateActivities
                show={true}
                handleClose={mockHandleClose}
            />
        );

        const cancelButton = screen.getByText("cancel");
        fireEvent.click(cancelButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });
});
