import i18n from '../../src/i18n'

describe('AddMemberPopUp', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Abrir el popup de itinerario primero
    cy.contains(i18n.t('PlanNow')).click()
    // Luego abrir el popup de añadir miembro
    cy.contains('+ ' + i18n.t('addMember')).click()
  })

  it('opens and closes add member popup', () => {
    // Verificar que el título del popup sea visible
    cy.contains(i18n.t('insertUserName')).should('be.visible')

    // Cerrar popup
    cy.get("#close-button-member .btn-close").click()

    // Verificar que el popup no sea visible
    cy.contains(i18n.t('insertUserName')).should('not.exist')
  })

  it('allows entering member username', () => {
    // Ingresar nombre de usuario
    cy.get('#itinerary-name-input')
      .type('pedro_viajero3')
      .should('have.value', 'pedro_viajero3')
  })

  it('allows selecting dates', () => {
    // Ingresar fecha inicial
    cy.get('#add-member-popup #date-input-init')
      .type('July 05')
      .should('have.value', 'July 05')

    // Ingresar fecha final
    cy.get('#add-member-popup #date-input-end')
      .type('July 28')
      .should('have.value', 'July 28')
  })

  it('allows selecting activity preferences', () => {
    // Seleccionar algunas actividades
    cy.get('#add-member-popup #div-preferencias #culture')
      .click()
      .should('be.checked')

    cy.get('#add-member-popup #div-preferencias #museum')
      .click()
      .should('be.checked')
  })

  it('allows selecting transport preferences', () => {
    // Seleccionar algunos transportes
    cy.get('#add-member-popup #div-preferencias-transporte #bus')
      .click()
      .should('be.checked')

    cy.get('#add-member-popup #div-preferencias-transporte #bicycle')
      .click()
      .should('be.checked')
  })

  it('submits the form with complete information', () => {
    // Llenar todos los campos
    cy.get('#itinerary-name-input').type('pedro_viajero3')
    cy.get('#add-member-popup #date-input-init').type('July 05')
    cy.get('#add-member-popup #date-input-end').type('July 28')
    
    // Seleccionar preferencias
    cy.get('#add-member-popup #div-preferencias #culture').click()
    cy.get('#add-member-popup #div-preferencias-transporte #bicycle').click()

    // Enviar formulario
    cy.get("#add-member-button").click()

    // Verificar que el popup se cierra
    cy.contains(i18n.t('insertUserName')).should('not.exist')
  })
})