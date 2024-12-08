import i18n from '../../src/i18n';

describe('Activity Section', () => {
  beforeEach(() => {
    // Visit the home page
    // Cambiar a 3001 si es necesario (se está corrinedo el back en 3000)
    cy.visit('http://localhost:3001');
    // Navigate to the Activities section
    cy.contains(i18n.t('Activities')).click();
    // Verify that the Activities page loads
    cy.url().should('include', '/activities');
    cy.contains(i18n.t('Activities')).should('be.visible');
  });
  
  it('should create a new activity', () => {
    // Click the "Add" button to create a new activity
    cy.contains(i18n.t('add')).click();

    // Fill out the form
    cy.get('input[placeholder="' + i18n.t('enterActivityName') + '"]').type('New Activity');
    cy.get('input[placeholder="HH"]').type('1');
    cy.get('input[placeholder="MM"]').type('30');
    cy.get('input[placeholder="' + i18n.t('direction') + ' 1"]').type('123 Test Street');

    // Submit the form using the test ID for the button
    cy.get('[data-testid="create-activity-button"]').click();

    // Verify the new activity appears in the list
    cy.contains('New Activity').should('be.visible');
    cy.contains('123 Test Street').should('be.visible');
    cy.contains('1h 30 min').should('be.visible');
});




it('should edit an existing activity', () => {
  // Seleccionar la primera actividad de la lista
  cy.get('.border-bottom').first().within(() => {
      // Verifica que la actividad sea visible
      cy.get('[data-testid="edit-icon"]').click();
  });

  // Editar los campos del formulario
  cy.get('input[placeholder="' + i18n.t('enterActivityName') + '"]').clear().type('Updated Activity');

  // Editar el campo de dirección
  cy.get('input[placeholder="' + i18n.t('direction') + ' 1"]').clear().type('456 Updated Street');

  // Enviar el formulario
  cy.get('[data-testid="save-activity-button"]').click(); // Asegúrate de tener este atributo en el botón "Guardar"

  // Verifica que la actividad fue actualizada correctamente
  cy.contains('Updated Activity').should('be.visible');
  cy.contains('456 Updated Street').should('be.visible');
});

it('should delete the first activity and verify it is no longer listed', () => {
  // Guarda el nombre de la primera actividad antes de eliminarla
  cy.get('.border-bottom').first().within(() => {
      cy.get('div.col-10').invoke('text').as('activityName'); // Ajusta el selector para encontrar el nombre correctamente
  });

  // Haz clic en el ícono de eliminar de la primera actividad
  cy.get('.border-bottom').first().within(() => {
      cy.get('[data-testid="delete-icon"]').click();
  });

  // Confirma la eliminación en el modal
  cy.get('button.delete_button').click();

  // Verifica que el nombre de la actividad eliminada ya no está presente
  cy.get('@activityName').then((activityName) => {
      cy.contains(activityName).should('not.exist');
  });
});


});
