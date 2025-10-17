describe('Registro de IMC', () => {
  it('Permite registrar un usuario y ver el historial', () => {
    cy.visit('http://localhost:3000'); // Cambia el puerto si es necesario

    cy.get('#firstName').type('Juan');
    cy.get('#lastName').type('Pérez');
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#weight').type('70');
    cy.get('#height').type('175');
    cy.get('#date').type('2025-10-17');
    cy.get('.btn-primary').click();

    cy.get('#result').should('be.visible');
    cy.get('#recordsList').should('contain', 'Juan');
  });
});