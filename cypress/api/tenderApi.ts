import { ApiHelper } from "./rentzilaApi";
import { Endpoints } from "../constants/enumsEndpoints";
import randomValue from "../helper/randomValue";
import { TypeOfWork } from "../constants/typeOfWork";
import { TimeOfWork } from "../constants/timeOfWork";
import mime from "mime-types";

class TenderApi extends ApiHelper {
    createTender(categoryId: number = 5, serviceId: number = 396) {
        return super.createUserJwtToken().then(token => {
            const proposeTomorrow = new Date();
            proposeTomorrow.setDate(new Date().getDate() + 1);
            const proposeNextWeek = new Date(proposeTomorrow);
            proposeNextWeek.setDate(proposeTomorrow.getDate() + 7);
            const [proposeStart, proposeEnd] = randomValue.generateRandomDate(proposeTomorrow, proposeNextWeek, 2);
            proposeEnd.setDate(proposeEnd.getDate() + 1);

            const tenderTomorrow = new Date(proposeEnd);
            tenderTomorrow.setDate(tenderTomorrow.getDate() + 1);
            const tenderNextWeek = new Date(tenderTomorrow);
            tenderNextWeek.setDate(tenderNextWeek.getDate() + 7);
            const [tenderStart, tenderEnd] = randomValue.generateRandomDate(tenderTomorrow, tenderNextWeek, 2);
            tenderEnd.setDate(tenderEnd.getDate() + 1);

            return cy.request({
                method: "POST",
                url: Endpoints.API_TENDERS,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    category: categoryId,
                    name: randomValue.generateStringWithLength(10),
                    description: randomValue.generateStringWithLength(50),
                    lat: 50.453,
                    lng: 30.516,
                    customer: 1777,
                    start_price: randomValue.generateRandomNumber(1, 999999999),
                    currency: "UAH",
                    type_of_work: randomValue.selectRandomValueFromArray(TypeOfWork.slice(0, -3)),
                    time_of_work: randomValue.selectRandomValueFromArray(TimeOfWork),
                    start_propose_date: proposeStart,
                    end_propose_date: proposeEnd,
                    start_tender_date: tenderStart,
                    end_tender_date: tenderEnd,
                    services: [serviceId],
                }
            });
        });
    }

    moderateTender(id: number, tenderStatus: string = "approved") {
        return super.createAdminJwtToken().then(token => {
            return cy.request({
                method: "POST",
                url: `${Endpoints.API_MODERATE_TENDERS}${id}/moderate/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                qs: {
                    status: tenderStatus
                }
            });
        });
    }

    attachFile(tenderId: number, filePath: string) {
        return super.createUserJwtToken().then(token => {
            return cy.fixture(filePath, "binary").then(file => {
                const blob = Cypress.Blob.binaryStringToBlob(file, mime.lookup(filePath) || "unknown");
                const formData = new FormData();
                formData.append("name", filePath.split('/').pop());
                formData.append("tender", tenderId.toString());
                formData.append("attachment_file", blob, filePath.split('/').pop());

                return cy.request({
                    method: "POST",
                    url: Endpoints.API_TENDER_ATTACH_FILE,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                });
            });
        });
    }

    getServiceCategories() {
        return super.createAdminJwtToken().then(token => {
            return cy.request({
                method: "GET",
                url: Endpoints.API_SERVICE_CATEGORIES,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        });
    }

    getServicesByCategory(categoty: string) {
        return super.createAdminJwtToken().then(token => {
            return cy.request({
                method: "GET",
                url: `${Endpoints.API_SERVICES}${categoty}/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        });
    }

    getServices() {
        return super.createAdminJwtToken().then(token => {
            return cy.request({
                method: "GET",
                url: Endpoints.API_SERVICES,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        });
    }

    closeTender(id: number) {
        return super.createUserJwtToken().then(token => {
            return cy.request({
                method: "PATCH",
                url: `${Endpoints.API_TENDER}${id}/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    is_closed: true
                }
            });
        });
    }

    deleteTender(id: number) {
        return super.createUserJwtToken().then(token => {
            return cy.request({
                method: "DELETE",
                url: `${Endpoints.API_TENDER}${id}/`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        });
    }
}

export default new TenderApi();