describe("Profile save flow", () => {
    it("saves basic profile info and reflects completion on dashboard", () => {
        cy.fixture("profile").then((profile) => {
            cy.fillBasicProfileAndSave(profile);
        });

        cy.visit("/dashboard");
        cy.contains("button", "Edit Profile").should("be.visible");
    });
});
