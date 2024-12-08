import i18n from '../../src/i18n'

describe('ItineraryPopUp', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('opens and closes the itinerary popup', () => {
    // Click the Plan Now button to open popup
    cy.contains(i18n.t('PlanNow')).click()

    // Verify popup title is visible
    cy.contains(i18n.t('generateItinerary')).should('be.visible')

    // Click close button
    cy.get('.btn-close').click()

    // Verify popup is not visible
    cy.contains(i18n.t('generateItinerary')).should('not.exist')
  })

  it('allows entering itinerary details', () => {
    // Open popup
    cy.contains(i18n.t('PlanNow')).click()

    // Fill itinerary name
    cy.get('#itinerary-name-div input')
      .type('Mi viaje a Bogotá')
      .should('have.value', 'Mi viaje a Bogotá')

    // Fill budget
    cy.get('#budget-div input')
      .type('3000')
      .should('have.value', '3000')

    // Add destination
    cy.contains('+ ' + i18n.t('add') + ' ' + i18n.t('destination')).click()
    cy.get('.destination-div input').first()
      .type('Bogotá')
      .should('have.value', 'Bogotá')
  })

  it('handles adding members', () => {
    // Open popup 
    cy.contains(i18n.t('PlanNow')).click()

    // Click add member button
    cy.contains('+ ' + i18n.t('addMember')).click()

    // Verify add member modal appears
    cy.contains(i18n.t('insertUserName')).should('be.visible')

    // Fill member username
    cy.get('#itinerary-name-input')
      .type('pedro_viajero3')
      .should('have.value', 'pedro_viajero3')
  })

  it('allows selecting preferences', () => {
    // Open popup
    cy.contains(i18n.t('PlanNow')).click()

    // Check activity preferences
    cy.get('#div-preferencias input[type="checkbox"]').first().check()
    cy.get('#div-preferencias input[type="checkbox"]').first().should('be.checked')

    // Check transport preferences  
    cy.get('#div-preferencias-transporte input[type="checkbox"]').first().check()
    cy.get('#div-preferencias-transporte input[type="checkbox"]').first().should('be.checked')
  })

  it('submits the form correctly', () => {
    // Open popup
    cy.contains(i18n.t('PlanNow')).click()

    // Fill required fields
    cy.get('#itinerary-name-div input').type('Mi viaje a Bogotá')
    cy.get('#budget-div input').type('3000')
    cy.get('.destination-div input').first().type('Bogotá')
    cy.get('#date-input-init').type('05-07-2024')
    cy.get('#date-input-end').type('28-07-2024')
    

    // Check activity preferences
    cy.get('#div-preferencias input[type="checkbox"]').first().check()

    // Check transport preferences  
    cy.get('#div-preferencias-transporte input[type="checkbox"]').first().check()

    // Click generate button
    cy.get("#create-button").click()

    // Verify popup closes after submission
    cy.contains(i18n.t('generateItinerary')).should('not.exist')
  })
})