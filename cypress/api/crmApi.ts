import { Endpoints } from "cypress/constants/enumsEndpoints";
import { ApiHelper } from "./rentzilaApi";

class CrmApi extends ApiHelper {
  approveUnitCreation(unitId: number) {
    return super.createAdminJwtToken().then((token) => {
      const url = `${Cypress.env("BASE_URL")}${
        Endpoints.API_MODERATE_UNIT_BASE
      }${unitId}/moderate/`;
      const body = { is_approved: true };
      return this.makeRequest("PATCH", url, token, body).then(
        (response) => response.body
      );
    });
  }

  rejectUnitCreation(unitId: number) {
    return super.createAdminJwtToken().then((token) => {
      const url = `${Cypress.env("BASE_URL")}${
        Endpoints.API_MODERATE_UNIT_BASE
      }${unitId}/moderate/`;
      const body = { is_approved: false, declined_invalid_img: true };
      return this.makeRequest("PATCH", url, token, body).then(
        (response) => response.body
      );
    });
  }

  makeRequest(
    method: "GET" | "POST" | "PATCH",
    url: string,
    token: string,
    body?: object
  ) {
    return cy
      .request({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...(body && { body }),
      })
      .then((response) => {
        return response;
      });
  }

  searhAdsByName(unitName: string) {
    return super.createAdminJwtToken().then((token) => {
      const url = `${Cypress.env("BASE_URL")}${
        Endpoints.API_MODERATE_UNIT_BASE
      }?search=${unitName}`;
      return this.makeRequest("GET", url, token);
    });
  }

  manufacturersById(manufacturerId: number) {
    return super.createAdminJwtToken().then((token) => {
      const url = `${Cypress.env("BASE_URL")}${
        Endpoints.API_MANUFACTURER
      }${manufacturerId}/`;
      return this.makeRequest("GET", url, token);
    });
  }

  getUnitById(unitid: number) {
    return super.createAdminJwtToken().then((token) => {
      const url = `${Cypress.env("BASE_URL")}${
        Endpoints.API_MODERATE_UNIT_BASE
      }${unitid}/`;
      return this.makeRequest("GET", url, token);
    });
  }
}

export default new CrmApi();
