const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 90000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      config.env.BASE_URL = process.env.BASE_URL;
      config.env.USER_EMAIL = process.env.USER_EMAIL;
      config.env.USER_PASSWORD = process.env.USER_PASSWORD;
      config.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      config.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
      return config;
    },
  },
});
