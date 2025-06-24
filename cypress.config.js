const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // ✅ now use relative paths
    specPattern: 'cypress/e2e/**/*.cy.js', // all your test files
    supportFile: 'cypress/support/e2e.js', // loads commands.js
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed later
    },
  },
});
