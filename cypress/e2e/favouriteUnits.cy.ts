import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import productsPage from "../pages/productsPage";
import unitApi from "../api/unitApi";
import randomValue from "../helper/randomValue";
import crmApi from "../api/crmApi";
import page from "../pages/page";
import { UrlPath } from "../constants/enumUrlPaths";
import { Colors } from "../constants/colors";
import { sortDropdownListNames } from "../constants/sortNames";
import * as categories from "../constants/unitCategoriesNames";

describe("Favorite units", () => {
    let unitsId = [];

    beforeEach(() => {
        cy.visit("/");
        loginPage.headerAuthBtn.click();
        loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
        cy.fixture("textSymbols/generalMsg").as("generalMsg");
    });

    afterEach(function () {
        if (this.currentTest.state === "failed" && unitsId.length !== 0) {
            cy.log(`Test "${this.currentTest.title}" failed.`);
            cy.window().then(() => {
                for (let i = 0; i < unitsId.length; ++i) {
                    unitApi.deleteUnit(unitsId[i]).then((response) => {
                        expect(response).to.eq(204);
                    });
                }
            });
        }
    });

    it('TC-300 The "Обрані оголошення" page without "Обрані" units', function () {
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

    it('TC-302 "Обрані" icon functionality', function () {
        cy.window().scrollTo("top");
        loginPage.announcementsButton.click();
        cy.url().should("include", UrlPath.PRODUCTS);

        productsPage.cardWrappers.then(cards => {
            cy.wrap(cards[0]).scrollIntoView();
            productsPage.getCardName(cy.wrap(cards[0])).invoke("text").then(text => {
                cy.wrap(text).as("cardName");
            });
            productsPage.getCardFavouriteButton(cy.wrap(cards[0])).click();
            productsPage.getFavouriteButtonsPath(cy.wrap(cards[0])).should("have.attr", "fill", Colors.CRIMSON_COLOR);
        });

    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();
    cy.url().should("include", UrlPath.OWNER_UNITS_PAGE);

    unitsPage.chosenAnnouncmentsButton.click();
    unitsPage.unitCard.should("be.visible");
    cy.get("@cardName").then((name) => {
      unitsPage.unitCardTitleText.then((text) => {
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

        loginPage.announcementsButton.click();
        productsPage.cardWrappers.then(cards => {
            cy.wrap(cards[0]).scrollIntoView();
            productsPage.getFavouriteButtonsPath(cy.wrap(cards[0])).should("not.have.attr", "fill", Colors.CRIMSON_COLOR);
        });
    });

    it('TC-305 "Пошук по назві" search field functionality', function () {
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
      const existsCard = [...favouriteUnits].some((unit: { name: string }) =>
        unit.name.includes(number)
      );
      if (existsCard) {
        unitsPage.unitCardTitleText.then((text) => {
          expect(text).to.include(number);
        });
      } else {
        unitsPage.emptyBlockInfoTitle
          .should("be.visible")
          .and("have.text", `Оголошення за назвою "${number}" не знайдені`);
        unitsPage.emptyBlockButton
          .should("be.visible")
          .and("have.text", this.generalMsg.clearFiltersButtonText);
      }
    });
    unitsPage.announcemntTitleInput.clear();

    const specificSymbols = ["!", "@", "#", "$", "%", "(", ")", "*"];
    for (const symbol of specificSymbols) {
      unitsPage.announcemntTitleInput.type(symbol);

      cy.window().then(() => {
        const exists = [...favouriteUnits].some((unit: { name: string }) =>
          unit.name.includes(symbol)
        );
        if (exists) {
          unitsPage.unitCardTitleText.then((text) => {
            expect(text).to.include(symbol);
          });
        } else {
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
      .and(
        "have.text",
        `Оголошення за назвою "${nonExistingUnit}" не знайдені`
      );
    unitsPage.emptyBlockButton
      .should("be.visible")
      .and("have.text", this.generalMsg.clearFiltersButtonText);
    unitsPage.announcemntTitleInput.clear();

    cy.window().then(() => {
      const unit = randomValue.selectRandomValueFromArray([...favouriteUnits]);
      unitsPage.announcemntTitleInput.type(unit.name);
      unitsPage.unitCard.should("be.visible");
      unitsPage.unitCardTitleText.then((text) => {
        expect(text).to.eq(unit.name);
      });
    });

        unitsPage.announcemntTitleInput.clear();
        unitsPage.clearListButton.should("be.visible").click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupYesButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('TC-311 Check the pagination on the "Обрані оголошення" page', function () {
        let pageNumber = randomValue.generateRandomNumber(1, 100);
        const favouriteUnits = new Set();
        unitApi.getUnits(pageNumber, 25).then((units) => {
            expect(units.status).to.eq(200);
            while (favouriteUnits.size < 12) {
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
      unitsPage.paginationPreviousButton.should(
        "have.attr",
        "aria-disabled",
        "true"
      );
      cy.wrap(units).should("exist");
    });

    unitsPage.paginationNextButton.click();
    unitsPage.paginationButtons
      .eq(1)
      .should("have.attr", "aria-label", "Page 2 is your current page");

    unitsPage.paginationNextButton.click();
    cy.wait(500);
    unitsPage.paginationNextButton.click();
    unitsPage.paginationButtons
      .eq(2)
      .should("have.attr", "aria-label", "Page 3 is your current page");
    unitsPage.paginationNextButton.should("have.attr", "aria-disabled", "true");

    unitsPage.paginationPreviousButton.click();
    unitsPage.paginationButtons
      .eq(1)
      .should("have.attr", "aria-label", "Page 2 is your current page");

    unitsPage.paginationPreviousButton.click();
    cy.wait(500);
    unitsPage.paginationPreviousButton.click();
    unitsPage.paginationButtons
      .eq(0)
      .should("have.attr", "aria-label", "Page 1 is your current page");
    unitsPage.paginationPreviousButton.should(
      "have.attr",
      "aria-disabled",
      "true"
    );

    pageNumber = randomValue.generateRandomNumber(1, 30);
    const newFavouriteUnits = new Set();
    unitApi.getUnits(pageNumber, 100).then((units) => {
      expect(units.status).to.eq(200);
      while (newFavouriteUnits.size < 45) {
        const randomUnit = randomValue.selectRandomValueFromArray(
          units.body.results
        );
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
      unitsPage
        .getPaginationPageByNumber(i)
        .should("have.attr", "aria-label", `Page ${i} is your current page`);
    }
    unitsPage.paginationNextButton.should("have.attr", "aria-disabled", "true");

    unitsPage.paginationButtons.eq(0).click();
    unitsPage.paginationButtons
      .eq(0)
      .should("have.attr", "aria-label", "Page 1 is your current page");
    unitsPage.clearListButton.click();
    unitsPage.popupHeader
      .should("be.visible")
      .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
    unitsPage.popupYesButton.click();
    unitsPage.emptyBlockInfoTitle
      .should("be.visible")
      .and("have.text", this.generalMsg.noAnnouncementsMessage);
  });

    it('TC-315 "Всі категорії" dropdown menu functionality', function () {
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
                        unitApi.createUnitImages(result.id).then((status) => {
                            expect(status).to.eq(201);
                        });
                        crmApi.approveUnitCreation(result.id);
                        unitsId.push(result.id);
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
    unitsPage.unitCard.then((cards) => {
      unitCount = cards.length;
    });

        for (const categoryName of categories.categoriesDropdownListNames) {
            unitsPage.categoriesDropdownList.should("be.visible").click();
            unitsPage.selectListItemByName(categoryName).should("be.visible").click();
            unitsPage.unitCard.then(cards => {
                cy.wrap(cards).should("be.visible");
                if (categoryName === "Всі категорії") {
                    expect(cards.length).to.eq(unitCount);
                }
                else {
                    expect(cards.length).lessThan(unitCount);
                }

                unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                    switch (categoryName) {
                        case "Комунальна техніка": {
                            expect(categories.municipalEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
                            break;
                        }
                        case "Складська техніка": {
                            expect(categories.warehouseEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
                            break;
                        }
                        case "Будівельна техніка": {
                            expect(categories.constructionEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });
            });
        }

        cy.window().then(() => {
            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.deleteUnit(unit.id).then((response) => {
                    expect(response).to.eq(204);
                });
            });
            unitsId = [];
        });
        cy.reload();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('TC-744 "Очистити список" button functionality', function () {
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

    it('TC-745 "Пошук по назві" search field functionality 2', function () {
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
      .and(
        "have.text",
        `Оголошення за назвою "${nonExistingUnit}" не знайдені`
      );
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

    it('TC-303 "Очистити список" button functionality 2', function () {
        cy.window().scrollTo("top");
        loginPage.announcementsButton.click();
        cy.url().should("include", UrlPath.PRODUCTS);

        const favouriteUnits = [];
        productsPage.cardWrappers.then(cards => {
            for (let i = 0; i < 2; ++i) {
                cy.wrap(cards[i]).scrollIntoView();
                productsPage.getCardFavouriteButton(cy.wrap(cards[i])).click();
                productsPage.getFavouriteButtonsPath(cy.wrap(cards[i])).should("have.attr", "fill", Colors.CRIMSON_COLOR);
                productsPage.getCardName(cy.wrap(cards[i])).invoke("text").then(text => {
                    favouriteUnits.push(text);
                });
            }
        });

        loginPage.userIcon.click();
        unitsPage.unitsInDropDownMenu.click();
        unitsPage.chosenAnnouncmentsButton.click();
        cy.url().should("include", UrlPath.OWNER_FAVOURITE_UNITS);
        cy.reload();

        cy.window().then(() => {
            unitsPage.unitCard
                .should("be.visible")
                .and("have.length", favouriteUnits.length);
        });
        unitsPage.unitCard.each((unit, index) => {
            unitsPage.getUnitCardName(cy.wrap(unit)).invoke("text").then(text => {
                expect(text).to.eq(favouriteUnits[index]);
            });
        });

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

        loginPage.announcementsButton.click();
        cy.url().should("include", UrlPath.PRODUCTS);
        productsPage.cardWrappers.then(cards => {
            for (let i = 0; i < 2; ++i) {
                cy.wrap(cards[i]).scrollIntoView();
                productsPage.getCardName(cy.wrap(cards[i])).invoke("text").then(text => {
                    expect(text).to.eq(favouriteUnits[i]);
                });
                productsPage.getFavouriteButtonsPath(cy.wrap(cards[i])).should("not.have.attr", "fill", Colors.CRIMSON_COLOR);
            }
        });
    });

    it('TC-316 "По даті створення" drop down menu functionality', function () {
        const favouriteUnits = [];
        const requests = [];
        cy.window().then(() => {
            for (let i = 0; i < 4; ++i) {
                const pageNumber = randomValue.generateRandomNumber(1, 100);
                const request = unitApi.getUnits(pageNumber).then((units) => {
                    expect(units.status).to.eq(200);
                    favouriteUnits.push(randomValue.selectRandomValueFromArray(units.body.results));
                });
                requests.push(request);
            }
    
            cy.wrap(Promise.all(requests)).then(() => {
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
        
        for (const sortName of sortDropdownListNames) {
            unitsPage.sortingDropdownList.should("be.visible").click();
            unitsPage.selectListItemByName(sortName).should("be.visible").click();
            unitsPage.unitCard.then(units => {
                cy.wrap(units).should("be.visible");
                unitsPage.sortingDropdownList.should("have.text", sortName);

                for (let i = 0; i < units.length - 1; ++i) {
                    switch (sortName) {
                        case " по назві": {
                            unitsPage.getUnitCardName(cy.wrap(units[i])).invoke("text").then(firstUnitName => {
                                unitsPage.getUnitCardName(cy.wrap(units[i + 1])).invoke("text").then(secondUnitName => {
                                    expect(firstUnitName.localeCompare(secondUnitName)).to.be.at.most(0);
                                });
                            });
                            break;
                        }
                        case "по даті створення": {
                            unitsPage.getUnitCardCreationDate(cy.wrap(units[i])).invoke("text").then(firstUnitDate => {
                                unitsPage.getUnitCardCreationDate(cy.wrap(units[i + 1])).invoke("text").then(secondUnitDate => {
                                    const firstDate = new Date(firstUnitDate.split('.').reverse().join('-'));
                                    const secondDate = new Date(secondUnitDate.split('.').reverse().join('-'));
                                    cy.wrap(firstDate.getTime()).should("be.at.least", secondDate.getTime());
                                });
                            });
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            });
        }

        unitsPage.clearListButton.click();
        unitsPage.popupHeader
            .should("be.visible")
            .and("have.text", this.generalMsg.popupClearFavouriteUnitsHeaderMessage);
        unitsPage.popupYesButton.click();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('TC-746 Check the "Будівельна техніка" menu functionality', function () {
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
                        unitApi.createUnitImages(result.id).then((status) => {
                            expect(status).to.eq(201);
                        });
                        crmApi.approveUnitCreation(result.id);
                        unitsId.push(result.id);
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
        const constructionEquipmentCategory = categories.categoriesDropdownListNames[0];
        const allCategories = categories.categoriesDropdownListNames[3];
        unitsPage.unitCard.then(cards => {
            unitCount = cards.length;
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(constructionEquipmentCategory).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            cy.wrap(cards)
                .should("be.visible")
                .and("have.length.lessThan", unitCount);

            unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                expect(categories.constructionEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
            });
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(allCategories).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            expect(cards.length).to.eq(unitCount);
        });

        cy.window().then(() => {
            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.deleteUnit(unit.id).then((response) => {
                    expect(response).to.eq(204);
                });
            });
            unitsId = [];
        });
        cy.reload();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('TC-747 Check the "Комунальна техніка" menu functionality', function () {
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
                        unitApi.createUnitImages(result.id).then((status) => {
                            expect(status).to.eq(201);
                        });
                        crmApi.approveUnitCreation(result.id);
                        unitsId.push(result.id);
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
        const municipalEquipmentCategory = categories.categoriesDropdownListNames[1];
        const allCategories = categories.categoriesDropdownListNames[3];
        unitsPage.unitCard.then(cards => {
            unitCount = cards.length;
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(municipalEquipmentCategory).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            cy.wrap(cards)
                .should("be.visible")
                .and("have.length.lessThan", unitCount);

            unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                expect(categories.municipalEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
            });
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(allCategories).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            expect(cards.length).to.eq(unitCount);
        });

        cy.window().then(() => {
            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.deleteUnit(unit.id).then((response) => {
                    expect(response).to.eq(204);
                });
            });
            unitsId = [];
        });
        cy.reload();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });

    it('TC-748 Check the "Складська техніка" menu functionality', function () {
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
                        unitApi.createUnitImages(result.id).then((status) => {
                            expect(status).to.eq(201);
                        });
                        crmApi.approveUnitCreation(result.id);
                        unitsId.push(result.id);
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
        const warehouseEquipmentCategory = categories.categoriesDropdownListNames[2];
        const allCategories = categories.categoriesDropdownListNames[3];
        unitsPage.unitCard.then(cards => {
            unitCount = cards.length;
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(warehouseEquipmentCategory).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            cy.wrap(cards)
                .should("be.visible")
                .and("have.length.lessThan", unitCount);

            unitsPage.getUnitCardCategory(cy.wrap(cards).first()).invoke("text").then(text => {
                expect(categories.warehouseEquipmentCategoryNames.some((category) => text.includes(category))).to.be.true;
            });
        });

        unitsPage.categoriesDropdownList.should("be.visible").click();
        unitsPage.selectListItemByName(allCategories).should("be.visible").click();
        unitsPage.unitCard.then(cards => {
            expect(cards.length).to.eq(unitCount);
        });

        cy.window().then(() => {
            favouriteUnits.forEach((unit: { id: number }) => {
                unitApi.deleteUnit(unit.id).then((response) => {
                    expect(response).to.eq(204);
                });
            });
            unitsId = [];
        });
        cy.reload();
        unitsPage.emptyBlockInfoTitle
            .should("be.visible")
            .and("have.text", this.generalMsg.noAnnouncementsMessage);
    });
});
