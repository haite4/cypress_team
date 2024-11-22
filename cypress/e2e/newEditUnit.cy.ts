import randomValue from "cypress/helper/randomValue";
import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import mainPage from "../pages/mainPage";
import {
  paymentsListText,
  invalidText,
  priceText,
  expectedTypeOfPayments,
} from "../fixtures/textSymbols/expectText";
import { UrlPath } from "../constants/enumUrlPaths";
import unitApi from "../api/unitApi";
import crmApi from "cypress/api/crmApi";

describe("Unit Edit functionality", () => {
  let lastUnitId;
  beforeEach("Add unit", () => {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();

    unitsPage.createApprovedUnit("HOUR").then((data) => {
      cy.reload();
      lastUnitId = data.id;
      cy.wrap(data.id).as("unitId");
    });

    unitsPage.unitCard.then((unitcard) => {
      expect(unitcard.length).to.be.at.least(1);
    });

    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
  });

  afterEach("Remove unit after each test", function () {
    if (lastUnitId) {
      unitApi.deleteUnit(Number(lastUnitId));
    }
  });

  it("TC-274 Edit Image section functionality", function () {
    unitsPage.editBtn.click();

    unitsPage.imageField.trigger("mouseenter");
    unitsPage.deleteImageBtn.click({ force: true });
    unitsPage.addImageBtn.should("be.visible");
    unitsPage.uploadImage();

    cy.wait(1000);
    unitsPage.nextBtn.should("be.visible").click();
    cy.request({
      url: "URL",
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 404) {
        cy.reload();
        cy.wait(5000);
        unitsPage.nextBtn.should("be.visible").click();
      } else {
      }
    });

    unitsPage.successfullyEditedMsg.should("exist", { timeout: 10000 });
  });

  it("TC-275 Check services functionality", function () {
    unitsPage.editBtn.click({ timeout: 5000 });

    unitsPage.serviceDiv.should("be.visible");

    unitsPage.removeChosenServiceBtn.click({ timeout: 5000 });
    unitsPage.serviceErrorMessage.invoke("text").then((text) => {
      expect(text).to.equal(this.errorMsg.zeroServiceError);
    });

    unitsPage.searchServiceInput.type(this.generalMsg.invalidSymbols);
    unitsPage.searchServiceInput.type(
      randomValue.generateStringWithLength(101)
    );

    unitsPage.searchServiceInput.clear();
    const generatedServiceName = randomValue.generateStringWithLength(10);

    cy.fixture("textSymbols/errorMsg").then((errorMsg) => {
      const dontFindMessWithServiceName = Cypress._.template(
        errorMsg.dontFindMess
      )({ serviceName: generatedServiceName });

      unitsPage.searchServiceInput.type(generatedServiceName);
      unitsPage.dropDownSearchServiceError.invoke("text").then((text) => {
        const formattedText = text.replace(/\s+/g, " ").trim();
        expect(formattedText).to.equal(dontFindMessWithServiceName);
      });
    });

    unitsPage.addNewServiceBtn.click();
    cy.wait(500);
    unitsPage.nextBtn.should("be.visible").click();
    cy.wait(500);
    unitsPage.successfullyEditedMsg.should("exist", { timeout: 10000 });
  });

  it("TC-541 Check Спосіб оплати menu", function () {
    cy.get("@unitId").then((unitId) => {
      cy.visit(`${Cypress.env("BASE_URL")}${UrlPath.EDIT_UNIT_PATH}${unitId}/`);
    });
    for (let i = 0; i < paymentsListText.length; i++) {
      cy.wait(500);
      unitsPage.paymentsButton.click({ timeout: 5000 });
      unitsPage.dropDownPayments.should("be.visible");

      unitsPage.dropDownPayments.eq(i).click({ timeout: 5000 });
      unitsPage.chosenMethodPaymentsText.invoke("text").then((text) => {
        expect(text).to.equal(paymentsListText[i]);
      });

      unitsPage.nextBtn.scrollIntoView();
      cy.wait(500);
      unitsPage.nextBtn.should("be.visible").click();
      cy.wait(500);
      unitsPage.successfullyEditedMsg.should("exist", { timeout: 10000 });

      unitsPage.viewAnnouncementsBtn.click({ timeout: 5000 });
      unitsPage.pendingAnnouncements.click({ timeout: 5000 });
      unitsPage.editBtn.click({ timeout: 5000 });
      unitsPage.chosenMethodPaymentsText.invoke("text").then((text) => {
        expect(text).to.equal(paymentsListText[i]);
      });
    }
    cy.wait(500);
    unitsPage.nextBtn.should("be.visible").click();
    cy.wait(500);
  });

  it("TC-276 Check Вартість мінімального замовлення field", function () {
    unitsPage.editBtn.click({ timeout: 5000 });

    cy.wait(500);
    unitsPage.minimalPriceInput.clear();

    unitsPage.nextBtn.should("be.visible").click();
    unitsPage.priceErrorText
      .invoke("text")
      .should("equal", this.errorMsg.requiredField);

    invalidText.forEach((invalidValue) => {
      unitsPage.minimalPriceInput.clear().type(invalidValue);
      unitsPage.minimalPriceInput
        .invoke("attr", "placeholder")
        .should("equal", this.generalMsg.paymentsPlaceholder);
    });

    unitsPage.minimalPriceInput.clear().type(priceText[0]);
    unitsPage.nextBtn.should("be.visible").click();

    unitsPage.successfullyEditedMsg.should("exist", { timeout: 10000 });

    unitsPage.avatarLogoBtn.click();
    unitsPage.logOutBtn.click({ timeout: 5000 });
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));

    crmApi.approveUnitCreation(Number(lastUnitId));

    cy.scrollTo("top");
    mainPage.navAnnouncementBtn.click({ timeout: 5000 });
    mainPage.firstUnitPrice.invoke("text").then((text) => {
      const normalizedText = text.replace(/\s+/g, "").trim();
      expect(normalizedText).to.equal(priceText[1]);
    });
  });

  it("TC-543 Check Вартість мінімального замовлення drop-down menu", function () {
    unitsPage.editBtn.click({ timeout: 5000 });
    unitsPage.addPriceServiceBtn.click();
    unitsPage.priceServiceField.type("20");
    unitsPage.chooseOptionWork.click();
    for (let j = 0; j < 6; j++) {
      unitsPage.chooseOptionWork.invoke("text").then((text) => {
        if (text.trim() === "зміна") {
          for (let i = 0; i < 2; i++) {
            unitsPage.chooseTimeBtn.click({ force: true });
            unitsPage.dropDownTimeChoose.eq(i).click();
            unitsPage.chooseTimeBtn.invoke("text").then((text) => {
              if (text.trim() === "4 год") {
                unitsPage.chooseOptionWork.click({ timeout: 5000 });
                processUnits(lastUnitId, expectedTypeOfPayments);
              }
            });
            processUnits(lastUnitId, expectedTypeOfPayments);
          }
        } else {
          unitsPage.dropDownOptionWork.eq(j).click({ timeout: 5000 });
          unitsPage.chooseOptionWork.click({ timeout: 5000 });
          cy.wait(1000);
          unitsPage.nextBtn.should("be.visible").click();
          cy.wait(1000);
          unitsPage.successfullyEditedMsg.should("exist", { timeout: 10000 });
          processUnits(lastUnitId, expectedTypeOfPayments);
        }
      });
    }

    function processUnits(lastUnitId, expectedTypeOfPayments) {
      unitsPage.avatarLogoBtn.click();
      unitsPage.logOutBtn.click({ timeout: 5000 });
      loginPage.headerAuthBtn.click({ timeout: 5000 });
      loginPage.login(
        Cypress.env("ADMIN_EMAIL"),
        Cypress.env("ADMIN_PASSWORD")
      );

      crmApi.approveUnitCreation(Number(lastUnitId));

      cy.scrollTo("top");
      mainPage.navAnnouncementBtn.click({ timeout: 5000 });
      mainPage.firstUnit.click({ timeout: 5000 });

      mainPage.serviceCost.invoke("text").then((text) => {
        const trimText = text.trim();
        const matches = expectedTypeOfPayments.some(
          (paymentType) => trimText === `20 грн / ${paymentType}`
        );
        expect(matches).to.be.true;
      });

      unitsPage.avatarLogoBtn.click({ timeout: 5000 });
      unitsPage.logOutBtn.click({ timeout: 5000 });

      cy.get("@unitId").then((unitId) => {
        cy.visit(
          `${Cypress.env("BASE_URL")}${UrlPath.EDIT_UNIT_PATH}${unitId}/`
        );
      });
      loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));

      unitsPage.chooseOptionWork.click({ timeout: 5000 });
    }
  });
});
