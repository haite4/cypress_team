import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import productsPage from "../pages/productsPage";
import unitApi from "../api/unitApi";
import randomValue from "../helper/randomValue";
import crmApi from "../api/crmApi";
import page from "../pages/page"
import { UrlPath } from "../constants/enumUrlPaths";
import { 
    categoriesDropdownListNames,
    municipalEquipmentCategoryNames,
    warehouseEquipmentCategoryNames } from "../constants/categoriesNames";

describe("Favorite units", () => {
    beforeEach(() => {
        cy.visit("/");
        loginPage.headerAuthBtn.click();
        loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
        cy.fixture("textSymbols/generalMsg").as("generalMsg");
    });

    it('The "Обрані оголошення" page without "Обрані" units', function () {
        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);

        unitsPage.emptyBlockButton
            .should("be.visible")
            .and("have.text", this.generalMsg.announcementListMessage)
            .click();
        cy.url().should("include", UrlPath.PRODUCTS);
    });

    it('"Обрані" icon functionality', function () {
        cy.window().scrollTo("top");
        page.announcementLink.click();
        cy.url().should("include", UrlPath.PRODUCTS);

        productsPage.cardWrappers.then(cards => {
            cy.wrap(cards[0]).scrollIntoView();
            productsPage.getCardName(cy.wrap(cards[0])).invoke("text").then(text => {
                cy.wrap(text).as("cardName");
            });
            productsPage.getCardFavouriteButton(cy.wrap(cards[0])).click();
            productsPage.getFavouriteButtonsPath(cy.wrap(cards[0])).should("have.attr", "fill", "#F73859");
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        cy.url().should("include", UrlPath.OWNER_UNITS_PAGE);

        unitsPage.chosenAnnouncmentsButton.click();
        unitsPage.unitCard.should("be.visible");
        cy.get("@cardName").then(name => {
            unitsPage.unitCardTitleText.then(text => {
                expect(name).to.eq(text);
            });
        });

        unitsPage.unitCard.then((card) => {
            unitsPage.getUnitCardFavouriteButton(cy.wrap(card)).click();
        });
        unitsPage.unitCard.should("not.exist");
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);

            page.announcementLink.click();
        productsPage.cardWrappers.then(cards => {
            cy.wrap(cards[0]).scrollIntoView();
            productsPage.getFavouriteButtonsPath(cy.wrap(cards[0])).should("not.have.attr", "fill", "#F73859");
        });
    });

    it('"Пошук по назві" search field functionality', function () {
        const pageNumber = randomValue.generateRandomNumber(1, 100);
        const favouriteUnits = new Set();
        unitApi.getUnits(pageNumber).then((units) => {
            expect(units.status).to.eq(200);
            while (favouriteUnits.size < 4) {
                favouriteUnits.add(randomValue.selectRandomValueFromArray(units.body.results));
            }

            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.addFavouriteUnit(unit.id).then((response) => {
                    expect(response.status).to.eq(201);
                });
            });
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);

        cy.reload();
        unitsPage.announcemntTitleInput.click();
        unitsPage.announcemntTitleInput.should("be.focused");

        unitsPage.announcemntTitleInput.type("{enter}");
        unitsPage.unitCard.should("be.visible");

        for (const spaceValue of this.generalMsg.spaces) {
            unitsPage.announcemntTitleInput.type(spaceValue);
            unitsPage.announcemntTitleInput.should("have.value", spaceValue);
            if (spaceValue === "          ") break;
            unitsPage.announcemntTitleInput.clear();
        }

        unitsPage.emptyBlockButton
            .should("be.visible")
            .and("have.text", this.generalMsg.clearFiltersButtonText)
            .click();
        unitsPage.unitCard.should("be.visible");

        const number = "16";
        unitsPage.announcemntTitleInput.type(number);
        cy.window().then(() => {
            const existsCard = [...favouriteUnits].some((unit: { name: string }) => unit.name.includes(number));
            if (existsCard) {
                unitsPage.unitCardTitleText.then(text => {
                    expect(text).to.include(number);
                });
            }
            else {
                unitsPage.emptyBlockInfoTitle
                    .should("be.visible")
                    .and("have.text", `Оголошення за назвою "${number}" не знайдені`);
                unitsPage.emptyBlockButton
                    .should("be.visible")
                    .and("have.text", this.generalMsg.clearFiltersButtonText);
            }
        });
        unitsPage.announcemntTitleInput.clear();

        const specificSymbols = ['!', '@', '#', '$', '%', '(', ')', '*'];
        for (const symbol of specificSymbols) {
            unitsPage.announcemntTitleInput.type(symbol);

            cy.window().then(() => {
                const exists = [...favouriteUnits].some((unit: { name: string }) => unit.name.includes(symbol));
                if (exists) {
                    unitsPage.unitCardTitleText.then(text => {
                        expect(text).to.include(symbol);
                    });
                }
                else {
                    unitsPage.emptyBlockInfoTitle
                        .should("be.visible")
                        .and("have.text", `Оголошення за назвою "${symbol}" не знайдені`);
                    unitsPage.emptyBlockButton
                        .should("be.visible")
                        .and("have.text", this.generalMsg.clearFiltersButtonText);
                }
            });

            unitsPage.announcemntTitleInput.clear();
        }

        const nonExistingUnit = "тест1234567890";
        unitsPage.announcemntTitleInput.type(nonExistingUnit);
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", `Оголошення за назвою "${nonExistingUnit}" не знайдені`);
        unitsPage.emptyBlockButton
            .should("be.visible")
            .and("have.text", this.generalMsg.clearFiltersButtonText);
        unitsPage.announcemntTitleInput.clear();

        cy.window().then(() => {
            const unit = randomValue.selectRandomValueFromArray([...favouriteUnits]);
            unitsPage.announcemntTitleInput.type(unit.name);
            unitsPage.unitCard.should("be.visible");
            unitsPage.unitCardTitleText.then(text => {
                expect(text).to.eq(unit.name);
            });
        });

        unitsPage.announcemntTitleInput.clear();
        unitsPage.unitCard.each((card) => {
            unitsPage.getUnitCardFavouriteButton(cy.wrap(card)).click();
            cy.wait(500);
        });
    });

    it('Check the pagination on the "Обрані оголошення" page', function () {
        let pageNumber = randomValue.generateRandomNumber(1, 100);
        const favouriteUnits = new Set();
        unitApi.getUnits(pageNumber, 25).then((units) => {
            expect(units.status).to.eq(200);
            while (favouriteUnits.size < 15) {
                favouriteUnits.add(randomValue.selectRandomValueFromArray(units.body.results));
            }

            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.addFavouriteUnit(unit.id).then((response) => {
                    expect(response.status).to.eq(201);
                });
            });
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);

        cy.reload();
        unitsPage.paginationButtons
            .should("be.visible")
            .and("have.length.at.least", 3);

        unitsPage.unitCard.then((units) => {
            cy.wrap(units).should("exist");
            unitsPage.paginationPreviousButton.click();
            unitsPage.paginationPreviousButton.should("have.attr", "aria-disabled", "true");
            cy.wrap(units).should("exist");
        });

        unitsPage.paginationNextButton.click();
        unitsPage.paginationButtons.eq(1).should("have.attr", "aria-label", "Page 2 is your current page");

        unitsPage.paginationNextButton.click();
        cy.wait(500);
        unitsPage.paginationNextButton.click();
        unitsPage.paginationButtons.eq(2).should("have.attr", "aria-label", "Page 3 is your current page");
        unitsPage.paginationNextButton.should("have.attr", "aria-disabled", "true");

        unitsPage.paginationPreviousButton.click();
        unitsPage.paginationButtons.eq(1).should("have.attr", "aria-label", "Page 2 is your current page");

        unitsPage.paginationPreviousButton.click();
        cy.wait(500);
        unitsPage.paginationPreviousButton.click();
        unitsPage.paginationButtons.eq(0).should("have.attr", "aria-label", "Page 1 is your current page");
        unitsPage.paginationPreviousButton.should("have.attr", "aria-disabled", "true");

        pageNumber = randomValue.generateRandomNumber(1, 30);
        const newFavouriteUnits = new Set();
        unitApi.getUnits(pageNumber, 100).then((units) => {
            expect(units.status).to.eq(200);
            while (newFavouriteUnits.size < 45) {
                const randomUnit = randomValue.selectRandomValueFromArray(units.body.results);
                if (!favouriteUnits.has(randomUnit)) {
                    newFavouriteUnits.add(randomUnit);
                }
            }

            newFavouriteUnits.forEach((unit: { id: number }) => {
                unitApi.addFavouriteUnit(unit.id).then((response) => {
                    expect(response.status).to.eq(201);
                });
            });
        });
        cy.reload();

        for (let i = 2; i <= 12; ++i) {
            unitsPage.paginationNextButton.click();
            unitsPage.getPaginationPageByNumber(i).should("have.attr", "aria-label", `Page ${i} is your current page`);
        }
        unitsPage.paginationNextButton.should("have.attr", "aria-disabled", "true");

        unitsPage.paginationButtons.eq(0).click();
        unitsPage.paginationButtons.eq(0).should("have.attr", "aria-label", "Page 1 is your current page");
        unitsPage.clearListButton.click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupYesButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('"Всі категорії" dropdown menu functionality', function () {
        const favouriteUnits = [];
        unitApi.getCategories().then(response => {
            expect(response.status).to.eq(200);
            const firstLevelCategories = response.body.filter(category => category.parent === null);
            for (let i = 0; i < firstLevelCategories.length; ++i) {
                const secondLevelCategories = response.body.filter(category => category.parent === firstLevelCategories[i].id);
                const thirdLevelCategories = response.body.filter(category => 
                    secondLevelCategories.some(secondLevel => secondLevel.id === category.parent) && 
                    category.level === 3
                );
                for (let j = 0; j < 2; ++j) {
                    const randomCategory = randomValue.selectRandomValueFromArray(thirdLevelCategories);
                    unitApi.createUnit(randomCategory.id).then(result => {
                        cy.log(JSON.stringify(result));
                        unitApi.createUnitImages(result.id).then((status) => {
                            expect(status).to.eq(201);
                        });
                        crmApi.approveUnitCreation(result.id).then(approveResult => {
                            cy.log(JSON.stringify(approveResult));
                        });
                        favouriteUnits.push(result);
                    });
                }
            }

            cy.window().then(() => {
                favouriteUnits.forEach((unit: { id: number }) => {
                    unitApi.addFavouriteUnit(unit.id).then((response) => {
                        expect(response.status).to.eq(201);
                    });
                });
            });
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);
        cy.reload();

        let unitCount: number;
        unitsPage.unitCard.then(cards => {
            unitCount = cards.length;
        });

        for (const categoryName of categoriesDropdownListNames) {
            unitsPage.categoriesDropdownList.should("be.visible").click();
            unitsPage.selectCategoryItemByName(categoryName).should("be.visible").click();
            unitsPage.unitCard.then(cards => {
                cy.wrap(cards).should("be.visible");
                cy.log(cards.length.toString());
                cy.log(unitCount.toString());
                if (categoryName === "Всі категорії") {
                    expect(cards.length).to.eq(unitCount);
                }
                else {
                    expect(cards.length).lessThan(unitCount);
                }

                switch (categoryName) {
                    case "Комунальна техніка": {
                        unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                            expect(municipalEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
                        });
                        break;
                    }
                    case "Складська техніка": {
                        unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                            expect(warehouseEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
                        });
                        break;
                    }
                    case "Будівельна техніка": {
                        cy.wait(1000);
                        cy.wrap(cards).first().click();
                        cy.url().should("include", UrlPath.UNIT);

                        cy.wait(1000);
                        cy.go("back");
                        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }

        cy.window().then(() => {
            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.deleteUnit(unit.id).then((response) => {
                    expect(response).to.eq(204);
                });
            });
        });
        cy.reload();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('"Очистити список" button functionality', function () {
        const pageNumber = randomValue.generateRandomNumber(1, 100);
        const favouriteUnits = new Set();
        unitApi.getUnits(pageNumber, 25).then((units) => {
            expect(units.status).to.eq(200);
            while (favouriteUnits.size < 3) {
                favouriteUnits.add(randomValue.selectRandomValueFromArray(units.body.results));
            }

            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.addFavouriteUnit(unit.id).then((response) => {
                    expect(response.status).to.eq(201);
                });
            });
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);
        cy.reload();

        unitsPage.clearListButton.should("be.visible").click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        
        unitsPage.popupCancelButton.click();
        unitsPage.popupHeader.should("not.exist");
        unitsPage.unitCard.should("be.visible");

        unitsPage.clearListButton.should("be.visible").click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupCloseIcon.click();
        unitsPage.popupHeader.should("not.exist");
        unitsPage.unitCard.should("be.visible");

        unitsPage.clearListButton.click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupYesButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('"Пошук по назві" search field functionality 2', function () {
        const pageNumber = randomValue.generateRandomNumber(1, 100);
        const favouriteUnits = new Set();
        unitApi.getUnits(pageNumber).then((units) => {
            expect(units.status).to.eq(200);
            while (favouriteUnits.size < 4) {
                favouriteUnits.add(randomValue.selectRandomValueFromArray(units.body.results));
            }

            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.addFavouriteUnit(unit.id).then((response) => {
                    expect(response.status).to.eq(201);
                });
            });
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);

        cy.reload();
        unitsPage.announcemntTitleInput.click();
        unitsPage.announcemntTitleInput.should("be.focused");

        unitsPage.announcemntTitleInput.type("{enter}");
        unitsPage.unitCard.should("be.visible");

        for (const spaceValue of this.generalMsg.spaces) {
            unitsPage.announcemntTitleInput.type(spaceValue);
            unitsPage.announcemntTitleInput.should("have.value", spaceValue);
            if (spaceValue === "          ") break;
            unitsPage.announcemntTitleInput.clear();
        }

        unitsPage.emptyBlockButton
            .should("be.visible")
            .and("have.text", this.generalMsg.clearFiltersButtonText)
            .click();
        unitsPage.unitCard.should("be.visible");

        const nonExistingUnit = "тест1234567890";
        unitsPage.announcemntTitleInput.type(nonExistingUnit);
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", `Оголошення за назвою "${nonExistingUnit}" не знайдені`);
        unitsPage.emptyBlockButton
            .should("be.visible")
            .and("have.text", this.generalMsg.clearFiltersButtonText);
        unitsPage.announcemntTitleInput.clear();

        unitsPage.clearListButton.click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupYesButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });
});