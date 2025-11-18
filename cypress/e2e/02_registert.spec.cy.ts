import '@testing-library/cypress/add-commands';

describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}/register`);
  });

  it('Checks if all elements are visible on the screen', () => {
    cy.findByRole('img', { name: /ng\.cash/i }).should('exist');
    cy.findByText('Create Account').should('exist');
    cy.findByPlaceholderText('Username').should('exist');
    cy.findByPlaceholderText('Password').should('exist');
    cy.findByRole('button', { name: /submit/i }).should('exist');

    cy.findByText(
      /full stack project developed with next\.js and node\.js/i
    ).should('exist');

    cy.findByText(
      /password must be at least 8 characters long, contain a number and an uppercase letter\./i
    ).should('not.exist');
  });

  it('Shows error message when password does not meet security rules', () => {
    cy.findByPlaceholderText('Username').type(
      `mileycyrus${Date.now().toFixed().slice(0, 8)}`
    );
    cy.findByPlaceholderText('Password').type('any_password_123');
    cy.findByRole('button', { name: /submit/i }).click();

    cy.findByText(
      /password must be at least 8 characters long, contain a number and an uppercase letter\./i
    ).should('exist');
  });

  it('Shows success modal and redirects to login page', () => {
    cy.findByPlaceholderText('Username').type(
      `mileycyrus${Date.now().toFixed().slice(0, 8)}1`
    );
    cy.findByPlaceholderText('Password').type('Valid_password_123');
    cy.findByRole('button', { name: /submit/i }).click();

    cy.findByText(/user created successfully!/i).should('exist');
    cy.findByRole('button', { name: /login/i }).should('exist');

    cy.findByRole('button', { name: /login/i }).click();

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });
});
