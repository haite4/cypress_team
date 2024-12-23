import page from "../pages/page";
import loginPage from "../pages/loginPage";
import tenderApi from "../api/tenderApi";
import randomValue from "../helper/randomValue";
import { UrlPath } from "../constants/enumUrlPaths";
import { tenderCategoriesDropdownListNames } from "../constants/tenderCategoriesNames";
import { sortingDropdownListNames } from "../constants/sortNames";
import unitPage from "cypress/pages/unitsPage";
import "cypress-clipboard";

describe("Tender view", () => {
    let tenders = [];

    beforeEach(() => {
        cy.visit("/");
        loginPage.headerAuthBtn.click();
        loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
        loginPage.userIcon.click();
        loginPage.tendersDropdownButton.click();
        cy.url().should("include", UrlPath.OWNER_TENDERS_PAGE);
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

        cy.reload();
        unitPage.activeTab.click();
        unitPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            unitPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            unitPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderStatus(cy.wrap(tender)).should("be.visible");
            unitPage.editBtn.should("be.visible");
            unitPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
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

        cy.reload();
        unitPage.closedTab.click();
        unitPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            unitPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            unitPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderStatus(cy.wrap(tender)).should("be.visible");
            unitPage.editBtn.should("be.visible");
            unitPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
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

        cy.reload();
        unitPage.pendingTab.click();
        unitPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            unitPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            unitPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            unitPage.editBtn.should("be.visible");
            unitPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
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

        cy.reload();
        unitPage.rejectedTabs.click();
        unitPage.tenderCards.then(tender => {
            cy.wrap(tender).should("be.visible");
            unitPage.getTenderName(cy.wrap(tender)).should("have.text", tenders[0].name);
            unitPage.getTenderDate(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderAddress(cy.wrap(tender)).should("be.visible");
            unitPage.getTenderPrice(cy.wrap(tender)).should("be.visible");
            unitPage.editBtn.should("be.visible");
            unitPage.getTenderCloseButton(cy.wrap(tender)).should("be.visible");
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
        loginPage.logoutBtn.click();
        loginPage.headerAuthBtn.should("be.visible").click();
        loginPage.login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));
        cy.window().scrollTo("top");
        page.tendersButton.click();
        cy.url().should("include", UrlPath.TENDERS_MAP);
        cy.reload();
        unitPage.searchInput.then(input => {
            cy.wrap(input).type(tenders[0].name);
        });
        unitPage.tenderCards.then(tenderCards => {
            cy.wrap(tenderCards)
                .should("be.visible")
                .and("have.length", 1)
                .click();
        });
        cy.url().should("include", UrlPath.SELECTED_TENDER);

        unitPage.tenderName.then(tendertenderName => {
            cy.wrap(tendertenderName)
                .should("be.visible")
                .and("have.text", tenders[0].name);
        });
        unitPage.proposeDate.should("be.visible");
        unitPage.budget.should("be.visible");
        unitPage.proposeButton.should("be.visible");
        unitPage.organizerName.should("be.visible");
        unitPage.proposeCount.should("be.visible");
        unitPage.dateOfWork.should("be.visible");
        unitPage.placeOfWork.should("be.visible");
        unitPage.services.should("be.visible");
        unitPage.description.should("be.visible");
        unitPage.documents.then(docs => {
            cy.wrap(docs)
                .should("be.visible")
                .and("have.length", 1);
            
            unitPage.getDocumentName(cy.wrap(docs)).should("be.visible");
            unitPage.getDocumentViewButton(cy.wrap(docs)).should("be.visible").click();
            unitPage.documentPopup.should("be.visible");
            unitPage.closeBtn.click();
            unitPage.getDocumentName(cy.wrap(docs)).invoke("text").then((text) => {
                unitPage.getDocumentDownloadButton(cy.wrap(docs)).click();
                cy.readFile(`${Cypress.config("downloadsFolder")}/${text}`).should("exist");
            });
        });
        unitPage.otherTenders.should("be.visible");
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


        cy.reload();
        unitPage.tenderInput.focus();
        unitPage.tenderInput.should("have.value", "");
        unitPage.categoriesDropdownList.should("have.text", tenderCategoriesDropdownListNames[4]);
        unitPage.sortingDropdownList.should("have.text", sortingDropdownListNames[0]);
        const longText = randomValue.generateStringWithLength(101);
        unitPage.tenderInput.type(longText);
        unitPage.tenderInput.should("have.value", longText.substring(0, 100));
        unitPage.tenderInput.clear();
        unitPage.tenderInput.type(this.generalMsg.invalidSymbols);
        unitPage.tenderInput.should("have.value", "");
        unitPage.tenderInput.then(input => {
            const tenderName = tenders[0].name;
            cy.wrap(input).type(tenderName);
            cy.wrap(input).should("have.value", tenderName);

            cy.wrap(input).invoke("val").copyToClipboard();
            cy.wrap(input).clear();
            cy.document().copyFromClipboard().then(text => {
                cy.wrap(input).type(text);
            });
            cy.wrap(input).should("have.value", tenderName);

            unitPage.tenderCards.each(tender => {
                unitPage.getTenderName(cy.wrap(tender)).should("include.text", tenderName);
            });
            cy.wrap(input).clear();
        });

        cy.window().then(() => {
            for (const category of tenderCategoriesDropdownListNames) {
                unitPage.categoriesDropdownList.click();
                unitPage.selectListItemByName(category).click();
                unitPage.categoriesDropdownList.should("have.text", category);
                unitPage.tenderCards.each(tender => {
                    if (category !== tenderCategoriesDropdownListNames[4]) {
                        unitPage.getTenderCategoty(cy.wrap(tender)).should("include.text", category);
                    }
                });
            }
        });

        cy.window().then(() => {
            for (const sortName of sortingDropdownListNames) {
                unitPage.sortingDropdownList.click();
                unitPage.selectListItemByName(sortName).click();
                unitPage.sortingDropdownList.should("have.text", sortName);
                unitPage.tenderCards.then(tenderCards => {
                    for (let i = 0; i < tenderCards.length - 1; ++i) {
                        unitPage.getTenderName(cy.wrap(tenderCards[i])).invoke("text").then(firstTenderName => {
                            unitPage.getTenderName(cy.wrap(tenderCards[i + 1])).invoke("text").then(secondTenderName => {
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