// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import { Given, Then, And } from '../../../node_modules/cypress-cucumber-preprocessor/steps';
 
Given('I am on the homepage', () => {
  cy.visit('localhost:3000/');
});

Then('I should see a page with the title {string}', (title) => {
	cy.get('.title').should('be.visible')
      .and('have.text', title);
});

And('a link with the words {string} pointing to {string}', (text, url) => {
	cy.get('.App-link').should('be.visible')
      .and('have.text', text)
      .and('have.attr', 'href', url);
});
