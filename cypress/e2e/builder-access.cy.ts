describe("Builder access", () => {
    it("opens wizard and supports step navigation", () => {
        cy.fixture("profile").then((profile) => {
            cy.fillBasicProfileAndSave(profile);
        });

        cy.visit("/dashboard/builder");

        cy.contains("Pick a Template").should("be.visible");
        cy.contains("Step 1 of 3").should("be.visible");
        cy.contains("button", "Continue to customization").click();

        cy.contains("Customize Your Resume").should("be.visible");
        cy.contains("Step 2 of 3").should("be.visible");
        cy.contains("button", "Continue to downloads").click();

        cy.contains("Export Your Resume").should("be.visible");
        cy.contains("button", "Download (.pdf)").should("be.visible");
        cy.contains("button", "Back to edit").click();
        cy.contains("Customize Your Resume").should("be.visible");
    });
});
