import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://127.0.0.1:3000",
        specPattern: "cypress/e2e/**/*.cy.ts",
        supportFile: "cypress/support/e2e.ts",
        video: false,
        viewportWidth: 1366,
        viewportHeight: 768,
        retries: {
            runMode: 1,
            openMode: 0,
        },
    },
});
