import { Endpoints } from "../constants/enumsEndpoints";
import { ApiHelper } from "./rentzilaApi";
import randomValue from "../helper/randomValue";
import { MoneyCurrency } from "../constants/moneyCurrency";
import { TypeOfWork } from "../constants/typeOfWork";
import { TimeOfWork } from "../constants/timeOfWork";
import { PaymentMethods } from "../constants/paymentMethods";

class UnitApi extends ApiHelper {

  createUnit() {
    return super.createUserJwtToken().then((token) => {
      return cy
        .request({
          method: "POST",
          url: `${Cypress.env("BASE_URL")}${Endpoints.API_UNITS}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            category: 146,
            name: randomValue.generateStringWithLength(10),
            manufacturer: 10,
            model_name: randomValue.generateStringWithLength(10),
            features: randomValue.generateStringWithLength(10),
            description: randomValue.generateStringWithLength(100),
            lat: 50.46013446353369,
            lng: 30.46777478959968,
            owner: 1777,
            minimal_price: 2222,
            money_value:
            randomValue.selectRandomValueFromArray(MoneyCurrency),
            type_of_work:
            randomValue.selectRandomValueFromArray(TypeOfWork),
            time_of_work:
            randomValue.selectRandomValueFromArray(TimeOfWork),
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
}

export default new UnitApi();
