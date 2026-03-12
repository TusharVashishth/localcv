describe("Landing page", () => {
    it("navigates to dashboard from the hero CTA", () => {
        cy.visit("/");
        cy.contains("Build ATS-Ready Resumes With").should("be.visible");

        cy.contains("a", "Build Your Resume").click();

        cy.url().should("include", "/dashboard");
        cy.contains("Build your perfect resume").should("be.visible");
    });
});
