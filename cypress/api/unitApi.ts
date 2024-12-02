import { Endpoints } from "../constants/enumsEndpoints";
import { ApiHelper } from "./rentzilaApi";
import randomValue from "../helper/randomValue";
import { MoneyCurrency } from "../constants/moneyCurrency";
import { TypeOfWork } from "../constants/typeOfWork";
import { TimeOfWork } from "../constants/timeOfWork";
import { PaymentMethods } from "../constants/paymentMethods";
import dateTime from "cypress/helper/dateTime";

class UnitApi extends ApiHelper {
  createUnit(unitCategory: number = 146) {
    return super.createUserJwtToken().then((token) => {
      return cy
        .request({
          method: "POST",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_UNITS}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            category: unitCategory,
            name: randomValue.generateStringWithLength(10),
            manufacturer: 10,
            model_name: randomValue.generateStringWithLength(10),
            features: randomValue.generateStringWithLength(10),
            description: randomValue.generateStringWithLength(100),
            lat: 50.46013446353369,
            lng: 30.46777478959968,
            owner: 1777,
            minimal_price: 2222,
            money_value: randomValue.selectRandomValueFromArray(MoneyCurrency),
            type_of_work: randomValue.selectRandomValueFromArray(TypeOfWork),
            time_of_work: randomValue.selectRandomValueFromArray(TimeOfWork),
            payment_method:
              randomValue.selectRandomValueFromArray(PaymentMethods),
            services: [336],
          },
        })
        .then((response) => {
          return response.body;
        });
    });
  }

  deleteUnit(unitId: number) {
    return super.createUserJwtToken().then((token) => {
      return cy
        .request({
          method: "DELETE",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_UNITS}${unitId}/`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return response.status;
        });
    });
  }

  createUnitImages(unitId: number, is_main: boolean = true) {
    return super.createUserJwtToken().then((token) => {
      cy.fixture("images/uploadImage.jpg", "binary").then((Image) => {
        const blob = Cypress.Blob.binaryStringToBlob(Image, "image/jpg");
        const formData = new FormData();
        formData.append("unit", unitId.toString());
        formData.append("image", blob, "image.jpg");
        formData.append("is_main", is_main.toString());
        return cy
          .request({
            method: "POST",
            url: `${Cypress.env("BASE_URL")}${Endpoints.API_UNITS_IMAGES}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })
          .then((response) => {
            return response.status;
          });
      });
    });
  }

  getUnits(
    pageNumber: number,
    pageSize: number = 10,
    unitCategory: number = 0
  ) {
    return super.createUserJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("BASE_URL")}${Endpoints.API_UNITS}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        qs: {
          page: pageNumber,
          size: pageSize,
          ...(unitCategory && { category: unitCategory }),
        },
      });
    });
  }

  getCategories() {
    return super.createUserJwtToken().then((token) => {
      return cy.request({
        method: "GET",
        url: `${Cypress.env("BASE_URL")}${Endpoints.API_CATEGORIES}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }

  addFavouriteUnit(unitId: number) {
    return super.createUserJwtToken().then((token) => {
      return cy.request({
        method: "POST",
        url: `${Cypress.env("BASE_URL")}${
          Endpoints.API_FAVOURITE_UNITS
        }${unitId}/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  }

  createOrderAsAdmin(unitId: number, startDate: string, endDate: string) {
    return super.createAdminJwtToken().then((token) => {
      return cy.request({
        method: "POST",
        url: `${Cypress.env("BASE_URL")}${Endpoints.API_ORDERS}`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          customer: 1746,
          description: randomValue.generateStringWithLength(41),
          start_date: startDate,
          end_date: endDate,
          unit: unitId,
        },
      });
    });
  }

  createTender(category: number = 5) {
    const {
      startProposalDate,
      endProposalDate,
      startTenderDate,
      endTenderDate,
    } = dateTime.calculateAllDates();
    return super.createUserJwtToken().then((token) => {
      return cy
        .request({
          method: "POST",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_TENDERS}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            category: category,
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
            services: [616],
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

  attachFileTender(tenderId: number) {
    return super.createUserJwtToken().then((token) => {
      cy.fixture("images/uploadImage.jpg", "binary")
        .then((Image) => {
          const blob = Cypress.Blob.binaryStringToBlob(Image, "image/jpg");
          const formData = new FormData();
          formData.append("tender", tenderId.toString());
          formData.append("attachment_file", blob, "image.jpg");
          return cy.request({
            method: "POST",
            url: `${Cypress.env("BASE_URL")}${
              Endpoints.API_CREATE_TENDER_IMAGE
            }`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        })
        .then((response) => {
          return response.body;
        });
    });
  }

  closeTender(tenderId: number) {
    return super.createAdminJwtToken().then((token) => {
      return cy
        .request({
          method: "PATCH",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_TENDER}${tenderId}/`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            is_closed: true,
          },
        })
        .then((response) => {
          return response.body;
        });
    });
  }

  deleteTender(tenderId: number) {
    return super.createAdminJwtToken().then((token) => {
      return cy
        .request({
          method: "DELETE",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_TENDER}${tenderId}/`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return response.status;
        });
    });
  }
}
export default new UnitApi();
