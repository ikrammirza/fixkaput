describe('FixKaput Login Flow', () => {
    it('should send OTP and login successfully with mock OTP', () => {
        // 1. Visit the login page
        cy.visit('http://localhost:3000/login');

        // 2. Intercept send-otp API call
        cy.intercept('POST', '/api/send-otp', {
            statusCode: 200,
            body: { success: true, message: 'OTP sent successfully!' },
        }).as('sendOtp');

        // 3. Enter valid phone number and click "Send OTP"
        cy.get('input[type="tel"]').type('9876543210');
        cy.contains('Send OTP').click();

        // 4. Wait for mocked response
        cy.wait('@sendOtp');

        // 5. Check OTP input appears and type mock OTP
        cy.get('input[name="otp"]', { timeout: 10000 }).should('be.visible').type('123456');

        // 6. Intercept verify-otp API call
        cy.intercept('POST', '/api/verify-otp', {
            statusCode: 200,
            body: { success: true, message: 'Login successful!' },
        }).as('verifyOtp');

        // 7. Click "Verify OTP"
        cy.contains('Verify OTP').click();

        // 8. Wait for verifyOtp and redirection
        cy.wait('@verifyOtp');
        cy.url({ timeout: 10000 }).should('include', '/checkout');

        // 9. Confirm an element in checkout exists (optional)
        cy.contains('Checkout').should('exist');
    });

    afterEach(() => {
        console.log('✅ Test finished successfully');
    });
});
