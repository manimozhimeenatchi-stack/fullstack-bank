import '@testing-library/cypress/add-commands';

describe('Login Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(Cypress.config('baseUrl'));
  });

  it('Checks if all elements are visible on the screen', () => {
    cy.findByRole('img', { name: /ng\.cash/i }).should('exist');
    cy.findByText('Login').should('exist');
    cy.findByPlaceholderText('Username').should('exist');
    cy.findByPlaceholderText('Password').should('exist');
    cy.findByRole('button', { name: /submit/i }).should('exist');
    cy.findByRole('button', { name: /create account/i }).should('exist');
    cy.findByText(
      /full stack project developed with next\.js and node\.js/i
    ).should('exist');

    cy.findByText(/the username or password is incorrect/i).should('not.exist');
  });

  it('Shows error message when login fails', () => {
    cy.findByPlaceholderText('Username').type('beyonceknowles');
    cy.findByPlaceholderText('Password').type('Any_password_123');
    cy.findByRole('button', { name: /submit/i }).click();

    cy.findByText(/the username or password is incorrect/i).should('exist');
  });

  it('Redirects to dashboard after successful login', () => {
    cy.findByPlaceholderText('Username').type('raphaelmartins');
    cy.findByPlaceholderText('Password').type('Bank_secret_123');
    cy.findByRole('button', { name: /submit/i }).click();

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/dashboard`);
  });

  it('Redirects to registration page when clicking Create Account', () => {
    cy.findByRole('button', { name: /create account/i }).click();

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/register`);
  });
});
