describe("Builder access", () => {
    it("opens builder after profile data exists", () => {
        cy.fixture("profile").then((profile) => {
            cy.fillBasicProfileAndSave(profile);
        });

        cy.visit("/dashboard/builder");

        cy.contains("Resume Builder").should("be.visible");
        cy.contains("Choose Template").should("be.visible");
    });
});
