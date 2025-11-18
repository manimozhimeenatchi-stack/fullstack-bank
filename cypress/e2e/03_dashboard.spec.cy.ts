import '@testing-library/cypress/add-commands';

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(Cypress.config('baseUrl'));

    cy.findByPlaceholderText('Username').type('raphaelmartins');
    cy.findByPlaceholderText('Password').type('Bank_secret_123');
    cy.findByRole('button', { name: /submit/i }).click();
  });

  it('Checks if dashboard UI elements are visible', () => {
    cy.findByRole('heading', { name: /hello @raphaelmartins/i }).should('be.visible');
    cy.findByRole('button', { name: /logout/i }).should('be.visible');
    cy.findByRole('button', { name: /refresh/i }).should('be.visible');
    cy.findByRole('heading', { name: /available balance:/i }).should('be.visible');
    cy.findByRole('heading', { name: /transfer/i }).should('be.visible');
  });

  it('Checks logout button functionality', () => {
    cy.findByRole('button', { name: /logout/i }).click();

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });
});
