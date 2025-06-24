describe('FixKaput Booking Flow', () => {
    beforeEach(() => {
        cy.login(); // ⬅ reusable
    });

    it('should book AC Service', () => {
        cy.bookService('/service1', {
            name: 'John Doe',
            phone: '9876543210',
            area: 'Jubilee Hills',
            line1: 'Main Road',
            city: 'Hyderabad',
            pincode: '500028',
        });
    });
});
