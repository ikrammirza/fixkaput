Cypress.Commands.add('login', () => {
    cy.visit('http://localhost:3000/login');

    cy.intercept('POST', '/api/send-otp', {
        statusCode: 200,
        body: { success: true, message: 'OTP sent successfully!' },
    }).as('sendOtp');

    cy.get('input[type="tel"]').type('9876543210');
    cy.contains('Send OTP').click();
    cy.wait('@sendOtp');

    cy.get('input[name="otp"]').should('be.visible').type('123456');

    cy.intercept('POST', '/api/verify-otp', {
        statusCode: 200,
        body: { success: true, message: 'Login successful!' },
    }).as('verifyOtp');

    cy.contains('Verify OTP').click();
    cy.wait('@verifyOtp');
    cy.url({ timeout: 10000 }).should('include', '/checkout');
    cy.contains('Checkout').should('exist');
});
Cypress.Commands.add('bookService', (servicePath, bookingDetails) => {
    cy.visit(servicePath);
    cy.url().should('include', servicePath);

    cy.contains('Add to Cart').click();

    cy.visit('/checkout');
    cy.contains('Checkout').should('exist');

    cy.get('input[name="name"]').clear().type(bookingDetails.name);
    cy.get('input[name="phone"]').clear().type(bookingDetails.phone);
    cy.get('input[name="area"]').type(bookingDetails.area);
    cy.get('input[name="line1"]').type(bookingDetails.line1);
    cy.get('input[name="city"]').type(bookingDetails.city);
    cy.get('input[name="pincode"]').type(bookingDetails.pincode);

    cy.contains('Book Services').click();

    cy.contains('Booking Successfull').should('exist'); // ✅ update if message changes
});