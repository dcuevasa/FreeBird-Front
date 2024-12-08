import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EditActivities from "../activities/EditActivities";

// Mock de `useTranslation` para evitar warnings
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key, // Retorna las claves de traducción
    }),
}));

describe("EditActivities Component", () => {
    const mockHandleClose = jest.fn();
    const activityMock = {
        name: "Test Activity",
        addressess: ["Address 1", "Address 2", "Address 3"], // Asegúrate de tener más de una dirección
        time: "2h 30m",
    };

    it("renders the EditActivities modal with initial data", () => {
        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={activityMock}
            />
        );

        // Verifica que el nombre esté renderizado correctamente
        const nameInput = screen.getByPlaceholderText("enterActivityName");
        expect(nameInput).toBeInTheDocument();
        expect(nameInput.value).toBe(activityMock.name);

        // Verifica las direcciones
        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(activityMock.addressess.length);
        expect(directionInputs[0].value).toBe(activityMock.addressess[0]);
        expect(directionInputs[1].value).toBe(activityMock.addressess[1]);

        // Verifica las horas y minutos
        const hoursInput = screen.getByPlaceholderText("HH");
        const minutesInput = screen.getByPlaceholderText("MM");
        expect(hoursInput.value).toBe("2");
        expect(minutesInput.value).toBe("30");
    });

    it("updates the name field correctly", () => {
        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={activityMock}
            />
        );

        const nameInput = screen.getByPlaceholderText("enterActivityName");
        fireEvent.change(nameInput, { target: { value: "Updated Activity" } });
        expect(nameInput.value).toBe("Updated Activity");
    });

    it("adds a new direction", () => {
        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={activityMock}
            />
        );

        const addDirectionButton = screen.getByText("addDirection");
        fireEvent.click(addDirectionButton);

        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(activityMock.addressess.length + 1);
    });

    it("removes a direction (if more than one exists)", () => {
        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={activityMock}
            />
        );
    
        // Buscar los botones de "Eliminar"
        const removeButtons = screen.getAllByRole("button", { name: /remove/i });
        expect(removeButtons).toHaveLength(2); // Asegúrate de que haya dos botones antes de hacer clic
    
        // Hacer clic en el segundo botón
        fireEvent.click(removeButtons[0]);
    
        // Verificar que el número de direcciones se ha reducido
        const directionInputs = screen.getAllByPlaceholderText(/Direction/i);
        expect(directionInputs.length).toBe(2); // Ahora debe haber solo una dirección
    });
    

    it("does not allow removing the last remaining direction", () => {
        const singleDirectionActivity = {
            ...activityMock,
            addressess: ["Only Address"], // Solo una dirección
        };

        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={singleDirectionActivity}
            />
        );

        const removeButtons = screen.queryByText("remove");
        expect(removeButtons).not.toBeInTheDocument(); // No debería haber botones "Eliminar"
    });

    it("closes the modal when the cancel button is clicked", () => {
        render(
            <EditActivities
                show={true}
                handleClose={mockHandleClose}
                activity={activityMock}
            />
        );

        const cancelButton = screen.getByText("cancel");
        fireEvent.click(cancelButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });


    
});
