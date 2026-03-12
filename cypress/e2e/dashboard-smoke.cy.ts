describe("Dashboard", () => {
    it("renders the get-started module", () => {
        cy.visit("/dashboard");

        cy.contains("Get Started").should("be.visible");
        cy.contains("button", "Start Profile").should("be.visible");
        cy.contains("button", "Complete Profile First").should("exist");
    });
});
