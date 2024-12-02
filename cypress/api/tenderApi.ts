import { ApiHelper } from "./rentzilaApi";
import { Endpoints } from "../constants/enumsEndpoints";
import randomValue from "../helper/randomValue";
import mime from "mime-types";
import { MoneyCurrency } from "cypress/constants/moneyCurrency";
import dateTime from "cypress/helper/dateTime";

class TenderApi extends ApiHelper {
  createTender(categoryId: number = 5, serviceId: number = 396) {
    const {
      startProposalDate,
      endProposalDate,
      startTenderDate,
      endTenderDate,
    } = dateTime.getSpecificDate();
    return super.createUserJwtToken().then((token) => {
      return cy
        .request({
          method: "POST",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_TENDERS}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            category: categoryId,
            name: randomValue.generateStringWithLength(10),
            manufacturer: 10,
            model_name: randomValue.generateStringWithLength(10),
            features: randomValue.generateStringWithLength(10),
            description: randomValue.generateStringWithLength(100),
            lat: 50.46013446353369,
            lng: 30.46777478959968,
            customer: 1777,
            start_price: 2222,
            currency: randomValue.selectRandomValueFromArray(MoneyCurrency),
            type_of_work: "HOUR",
            time_of_work: "EIGHT",
            services: serviceId,
            start_propose_date: startProposalDate.toISOString(),
            end_propose_date: endProposalDate.toISOString(),
            start_tender_date: startTenderDate.toISOString(),
            end_tender_date: endTenderDate.toISOString(),
          },
        })
        .then((response) => {
          return response.body;
        });
    });
  }

  moderateTender(id: number, tenderStatus: string = "approved") {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "POST",
        url: `${Endpoints.API_MODERATE_TENDERS}${id}/moderate/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        qs: {
          status: tenderStatus,
        },
      });
    });
  }

  attachFile(tenderId: number, filePath: string) {
    return super.createUserJwtToken().then((token) => {
      return cy.fixture(filePath, "binary").then((file) => {
        const blob = Cypress.Blob.binaryStringToBlob(
          file,
          mime.lookup(filePath) || "unknown"
        );
        const formData = new FormData();
        formData.append("name", filePath.split("/").pop());
        formData.append("tender", tenderId.toString());
        formData.append("attachment_file", blob, filePath.split("/").pop());

        return cy.request({
          method: "POST",
          url: Endpoints.API_TENDER_ATTACH_FILE,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      });
    });
  }

  getServiceCategories() {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: Endpoints.API_SERVICE_CATEGORIES,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }

  getServicesByCategory(categoty: string) {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Endpoints.API_SERVICES}${categoty}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }

  getServices() {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: Endpoints.API_SERVICES,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }

  closeTender(id: number) {
    return super.createUserJwtToken().then((token) => {
      return cy.request({
        method: "PATCH",
        url: `${Endpoints.API_TENDER}${id}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          is_closed: true,
        },
      }).then((response) => {
        return response.body
      });
    });
  }

  deleteTender(id: number) {
    return super.createUserJwtToken().then((token) => {
      return cy.request({
        method: "DELETE",
        url: `${Endpoints.API_TENDER}${id}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }
}

export default new TenderApi();
