import i18n from '../../src/i18n'

describe('Itinerary', () => {
    beforeEach(() => {
        // Load the page where Itinerary component is rendered
        cy.visit('http://localhost:3000/plans'); 
    });

    it('should render the Itinerary page with translated titles', () => {
        // Ensure the page has loaded and i18n is working
        cy.get('h1').should('contain.text', i18n.t('urTrips'));
    });

    it('should toggle the accordion to reveal day details', () => {
        // Ensure the accordion is initially collapsed
        cy.get('.accItem').first().within(() => {
            cy.get('.accBody').should('not.be.visible');
        });

        // Click to expand
        cy.get('.accItem .accHeader').first().click();

        // Validate the content is visible
        cy.get('.accItem').first().within(() => {
            cy.get('.accBody').should('be.visible');
        });
    });

    it('should edit an event and save changes', () => {
        // Expand the first day
        cy.get('.accItem .accHeader').first().click();

        // Click edit button for the first event
        cy.get('.accBody').first().within(() => {
            cy.get('button').contains(i18n.t('edit')).click();
        });

        cy.get('button img[alt="edit"]').first().click();

        // Interact with modal form
        cy.get('.modal').should('be.visible');
        cy.get('.modal').first().within(() => {
            cy.get('select').select('Visit the Botero Museum'); // Change activity
            cy.get('input[type="time"]').type('15:30'); // Change time
            cy.get('button').contains(i18n.t('save')).click();
        });

        // Verify the modal is closed
        cy.get('.modal').should('not.exist');

        cy.get('.accBody').first().within(() => {
            cy.get('button').contains(i18n.t('save')).click();
        });

    });

    it('should provide correct directions links', () => {
        // Expand the first day
        cy.get('.accItem .accHeader').first().click();

        // Check that Google Maps link exists and is correct
        cy.get('.event').first().within(() => {
            cy.get('a').contains('Directions').should('have.attr', 'href').and('include', 'https://maps.google.com/?q=');
        });
    });
});

describe('Group Itinerary', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/friends'); 
    });
  
    it('should display profile pictures for each event', () => {
    cy.get('.accItem .accHeader').each(($header) => {
      cy.wrap($header).click();
      cy.get('img[alt="profile"]') 
        .should('exist') 
        .each((img) => {
          cy.wrap(img)
            .should('be.visible') 
        });
    });

    });
  });
  