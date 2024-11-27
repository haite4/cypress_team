import page from "../pages/page";
import loginPage from "../pages/loginPage";
import tendersPage from "../pages/tendersPage";
import tenderApi from "../api/tenderApi";
import tendersMapPage from "../pages/tendersMapPage";
import randomValue from "../helper/randomValue";
import tenderDetailsPage from "cypress/pages/tenderDetailsPage";
import { UrlPath } from "../constants/enumUrlPaths";
import { tenderCategoriesDropdownListNames } from "../constants/tenderCategoriesNames";
import { sortDropdownListNames } from "../constants/sortNames";
import "cypress-clipboard";

describe("Tender view", () => {
    let tenders = [];

    beforeEach(() => {
        cy.visit("/");
        loginPage.headerAuthBtn.click();
        loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
        cy.fixture("textSymbols/generalMsg").as("generalMsg");
    });

    afterEach(() => {
        cy.window().then(() => {
            for (let i = 0; i < tenders.length; ++i) {
                tenderApi.closeTender(tenders[i].id).then(response => {
                    expect(response.status).to.eq(202);
                });
                tenderApi.deleteTender(tenders[i].id).then(response => {
                    expect(response.status).to.eq(204);
                });
            }
            tenders = [];
        });
    });

    it("TC-232 View the active tender", () => {
        tenderApi.createTender().then(response => {
            expect(response.status).to.eq(201);
            tenders.push(response.body);
            tenderApi.attachFile(response.body.id, "files/test_file.xlsx").then(attachResponse => {
                expect(attachResponse.status).to.eq(201);
            });
            tenderApi.moderateTender(response.body.id).then(approveResponse => {
                expect(approveResponse.status).to.eq(202);
            });
        });

        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
        cy.reload();
        tendersPage.tabs.eq(0).click();
        tendersPage.checkTabs(0);
        tendersPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            tendersPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            tendersPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderStatus(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderEditButton(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
        });
    });

    it("TC-233 View the closed tender", () => {
        tenderApi.createTender().then(response => {
            expect(response.status).to.eq(201);
            tenders.push(response.body);
            tenderApi.attachFile(response.body.id, "files/test_file.xlsx").then(attachResponse => {
                expect(attachResponse.status).to.eq(201);
            });
            tenderApi.moderateTender(response.body.id).then(approveResponse => {
                expect(approveResponse.status).to.eq(202);
            });
            tenderApi.closeTender(response.body.id).then(closeResponse => {
                expect(closeResponse.status).to.eq(202);
            });
        });

        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
        cy.reload();
        tendersPage.tabs.eq(1).click();
        tendersPage.checkTabs(1);
        tendersPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            tendersPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            tendersPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderDeleteButton(cy.wrap(tender)).should("be.visible");
        });
    });

    it("TC-234 View the pending tender", () => {
        tenderApi.createTender().then(response => {
            expect(response.status).to.eq(201);
            tenders.push(response.body);
            tenderApi.attachFile(response.body.id, "files/test_file.xlsx").then(attachResponse => {
                expect(attachResponse.status).to.eq(201);
            });
        });

        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
        cy.reload();
        tendersPage.tabs.eq(2).click();
        tendersPage.checkTabs(2);
        tendersPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            tendersPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            tendersPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderEditButton(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
        });
    });

    it("TC-235 View the rejected tender", () => {
        tenderApi.createTender().then(response => {
            expect(response.status).to.eq(201);
            tenders.push(response.body);
            tenderApi.attachFile(response.body.id, "files/test_file.xlsx").then(attachResponse => {
                expect(attachResponse.status).to.eq(201);
            });
            tenderApi.moderateTender(response.body.id, "declined").then(approveResponse => {
                expect(approveResponse.status).to.eq(202);
            });
        });

        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
        cy.reload();
        tendersPage.tabs.eq(3).click();
        tendersPage.checkTabs(3);
        tendersPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            tendersPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            tendersPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderEditButton(cy.wrap(tender)).should("be.visible");
            tendersPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
        });
    });

    it("TC-236 View the tender detail page", () => {
        cy.window().then(() => {
            for (let i = 0; i < 3; ++i) {
                tenderApi.createTender().then(response => {
                    expect(response.status).to.eq(201);
                    tenders.push(response.body);
                    tenderApi.attachFile(response.body.id, "files/test_file.xlsx").then(attachResponse => {
                        expect(attachResponse.status).to.eq(201);
                    });
                    tenderApi.moderateTender(response.body.id).then(approveResponse => {
                        expect(approveResponse.status).to.eq(202);
                    });
                });
            }
        });

        loginPage.userIcon.click();
        loginPage.logoutButton.click();
        loginPage.headerAuthBtn.should("be.visible").click();
        loginPage.login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));
        cy.window().scrollTo("top");
        page.tendersButton.click();
        cy.url().should("include", UrlPath.TENDERS_MAP);
        cy.reload();
        tendersMapPage.searchInput.then(input => {
            cy.wrap(input).type(tenders[0].name);
        });
        tendersMapPage.tenderCards.then(tenderCards => {
            cy.wrap(tenderCards)
                .should("be.visible")
                .and("have.length", 1)
                .click();
        });
        cy.url().should("include", UrlPath.SELECTED_TENDER);

        tenderDetailsPage.title.then(tenderTitle => {
            cy.wrap(tenderTitle)
                .should("be.visible")
                .and("have.text", tenders[0].name);
        });
        tenderDetailsPage.proposeDate.should("be.visible");
        tenderDetailsPage.budget.should("be.visible");
        tenderDetailsPage.proposeButton.should("be.visible");
        tenderDetailsPage.organizerName.should("be.visible");
        tenderDetailsPage.proposeCount.should("be.visible");
        tenderDetailsPage.dateOfWork.should("be.visible");
        tenderDetailsPage.placeOfWork.should("be.visible");
        tenderDetailsPage.services.should("be.visible");
        tenderDetailsPage.description.should("be.visible");
        tenderDetailsPage.documents.then(docs => {
            cy.wrap(docs)
                .should("be.visible")
                .and("have.length", 1);
            
            tenderDetailsPage.getDocumentName(cy.wrap(docs)).should("be.visible");
            tenderDetailsPage.getDocumentViewButton(cy.wrap(docs)).should("be.visible").click();
            tenderDetailsPage.documentPopup.should("be.visible");
            tenderDetailsPage.documentPopupCloseButton.click();
            tenderDetailsPage.getDocumentName(cy.wrap(docs)).invoke("text").then((text) => {
                tenderDetailsPage.getDocumentDownloadButton(cy.wrap(docs)).click();
                cy.readFile(`${Cypress.config("downloadsFolder")}/${text}`).should("exist");
            });
        });
        tenderDetailsPage.otherTenders.should("be.visible");
    });

    it("TC-241 Search and filter tenders", function () {
        tenderApi.getServiceCategories().then(response => {
            expect(response.status).to.eq(200);
            for (let i = 0; i < response.body.results.length; ++i) {
                tenderApi.getServicesByCategory(response.body.results[i].name).then(servicesResponse => {
                    expect(servicesResponse.status).to.eq(200);
                    for (let j = 0; j < 2; ++j) {
                        const randomService = randomValue.selectRandomValueFromArray(servicesResponse.body);
                        tenderApi.createTender(response.body.results[i].id, randomService.id).then(tenderResponse => {
                            expect(tenderResponse.status).to.eq(201);
                            tenders.push(tenderResponse.body);
                            tenderApi.attachFile(tenderResponse.body.id, "files/test_file.xlsx").then(attachResponse => {
                                expect(attachResponse.status).to.eq(201);
                            });
                            tenderApi.moderateTender(tenderResponse.body.id).then(approveResponse => {
                                expect(approveResponse.status).to.eq(202);
                            });
                        });
                    }
                });
            }
        });

        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
        cy.reload();

        tendersPage.tenderInput.focus();
        tendersPage.tenderInput.should("have.value", "");
        tendersPage.categoryDropdownList.should("have.text", tenderCategoriesDropdownListNames[4]);
        tendersPage.sortDropdownList.should("have.text", sortDropdownListNames[0]);
        const longText = randomValue.generateStringWithLength(101);
        tendersPage.tenderInput.type(longText);
        tendersPage.tenderInput.should("have.value", longText.substring(0, 100));
        tendersPage.tenderInput.clear();
        tendersPage.tenderInput.type(this.generalMsg.invalidSymbols);
        tendersPage.tenderInput.should("have.value", "");
        tendersPage.tenderInput.then(input => {
            const tenderName = tenders[0].name;
            cy.wrap(input).type(tenderName);
            cy.wrap(input).should("have.value", tenderName);

            cy.wrap(input).invoke("val").copyToClipboard();
            cy.wrap(input).clear();
            cy.document().copyFromClipboard().then(text => {
                cy.wrap(input).type(text);
            });
            cy.wrap(input).should("have.value", tenderName);

            tendersPage.tenderCards.each(tender => {
                tendersPage.getTenderName(cy.wrap(tender)).should("include.text", tenderName);
            });
            cy.wrap(input).clear();
        });

        cy.window().then(() => {
            for (const category of tenderCategoriesDropdownListNames) {
                tendersPage.categoryDropdownList.click();
                tendersPage.selectListItemByName(category).click();
                tendersPage.categoryDropdownList.should("have.text", category);
                tendersPage.tenderCards.each(tender => {
                    if (category !== tenderCategoriesDropdownListNames[4]) {
                        tendersPage.getTenderCategoty(cy.wrap(tender)).should("include.text", category);
                    }
                });
            }
        });

        cy.window().then(() => {
            for (const sortName of sortDropdownListNames) {
                tendersPage.sortDropdownList.click();
                tendersPage.selectListItemByName(sortName).click();
                tendersPage.sortDropdownList.should("have.text", sortName);
                tendersPage.tenderCards.then(tenderCards => {
                    for (let i = 0; i < tenderCards.length - 1; ++i) {
                        tendersPage.getTenderName(cy.wrap(tenderCards[i])).invoke("text").then(firstTenderName => {
                            tendersPage.getTenderName(cy.wrap(tenderCards[i + 1])).invoke("text").then(secondTenderName => {
                                switch (sortName) {
                                    case "по даті створення": {
                                        const firstTender = tenders.find(tender => tender.name === firstTenderName);
                                        const secondTender = tenders.find(tender => tender.name === secondTenderName);
                                        const firstDate = new Date(firstTender.date_created);
                                        const secondDate = new Date(secondTender.date_created);
                                        cy.wrap(firstDate.getTime()).should("be.at.least", secondDate.getTime());
                                        break;
                                    }
                                    case " по назві": {
                                        expect(firstTenderName.localeCompare(secondTenderName)).to.be.at.most(0);
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
    });
});