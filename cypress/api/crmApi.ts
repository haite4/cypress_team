import { Endpoints } from "cypress/constants/enumsEndpoints";
import { ApiHelper } from "./rentzilaApi";

class CrmApi extends ApiHelper {
  approveUnitCreation(unitId: number) {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "PATCH",
        url: `${Cypress.env("BASE_URL")}${
          Endpoints.API_MODERATE_UNIT_BASE
        }${unitId}/moderate/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          is_approved: true,
        },
      }).then((response) => {
        return response.body
      })
    });
  }

  searchPendingAdsByName(unitName: string){
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("BASE_URL")}${
          Endpoints.API_MODERATE_UNIT_BASE
        }?page=1&date=desc&search=${unitName}&status=pending`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        return response
      })
    });
  }

  manufacturersById(manufacturerId: number){
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("BASE_URL")}${Endpoints.API_MANUFACTURER}${manufacturerId}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        return response
      })
    });
  }

  getUnitById(unitid: number){
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("BASE_URL")}${
          Endpoints.API_MODERATE_UNIT_BASE
        }${unitid}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        return response
      })
    });
  }
}

export default new CrmApi();
