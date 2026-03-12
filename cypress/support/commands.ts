type BasicProfile = {
    fullName: string;
    email: string;
    phone: string;
    location: string;
};

const defaultProfile: BasicProfile = {
    fullName: "Cypress User",
    email: "cypress.user@example.com",
    phone: "9876543210",
    location: "New Delhi",
};

declare global {
    namespace Cypress {
        interface Chainable {
            resetAppState(): Chainable<void>;
            fillBasicProfileAndSave(profile?: Partial<BasicProfile>): Chainable<void>;
        }
    }
}

Cypress.Commands.add("resetAppState", () => {
    cy.visit("/", {
        onBeforeLoad(win) {
            win.localStorage.clear();
            win.sessionStorage.clear();
            win.indexedDB.deleteDatabase("localcv_db");
        },
    });
});

Cypress.Commands.add("fillBasicProfileAndSave", (profile = {}) => {
    const data = {
        ...defaultProfile,
        ...profile,
    };

    cy.visit("/dashboard/profile");
    cy.get("#fullName").clear().type(data.fullName);
    cy.get("#email").clear().type(data.email);
    cy.get("#phone").clear().type(data.phone);
    cy.get("#location").clear().type(data.location);
    cy.contains("button", "Save").click();
    cy.contains("Tab data saved successfully", { timeout: 10000 }).should(
        "be.visible",
    );
});

export { };
