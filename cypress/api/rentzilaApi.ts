import { Endpoints } from "../constants/enumsEndpoints";

export class ApiHelper {
  private adminAccessToken: string | null = null;
  private userAccessToken: string | null = null;

  getJwtToken(credentials: {
    email?: string;
    password?: string;
    tokenCache?: string;
  }) {
    if (credentials.tokenCache) {
      return cy.wrap(credentials.tokenCache);
    }

    return cy
      .request({
        method: "POST",
        url: `${Cypress.env("BASE_URL")}${Endpoints.API_AUTH_CREATE}`,
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      })
      .then((response) => {
        return response.body.access;
      });
  }

  createAdminJwtToken() {
    return this.getJwtToken({
      email: Cypress.env("ADMIN_EMAIL"),
      password: Cypress.env("ADMIN_PASSWORD"),
      tokenCache: this.adminAccessToken,
    }).then((token) => {
      this.adminAccessToken = token;
      return this.adminAccessToken;
    });
  }

  createUserJwtToken() {
    return this.getJwtToken({
      email: Cypress.env("USER_EMAIL"),
      password: Cypress.env("USER_PASSWORD"),
      tokenCache: this.userAccessToken,
    }).then((token) => {
      this.userAccessToken = token;
      return this.userAccessToken;
    });
  }
}
