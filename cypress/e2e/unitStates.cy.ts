import crmApi from "cypress/api/crmApi";
import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import unitApi from "cypress/api/unitApi";

describe("Unit Edit functionality", () => {
  beforeEach("Add unit", function () {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();
    unitsPage.createApprovedUnit().then((data) => {
      cy.reload();
      cy.wrap(data.id).as("unitid");
    });
    unitsPage.unitCard.then((unitcard) => {
      expect(unitcard.length).to.be.at.least(1);
    });
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
    cy.fixture("textSymbols/successMsg").as("successMsg");
    this.isUnitDeleted = false;
  });

  afterEach("Remove unit after each test", function () {
    if (this.unitid && !this.isUnitDeleted) {
      unitApi.deleteUnit(Number(this.unitid));
    }
  });

  it("TC-278 Deactivation of an active unit.", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.unitCardNameText.then((unitName) => {
      unitsPage.deactivateBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popUpCloseIcon.click();
      unitsPage.deactivateBtn.should("be.visible");
      unitsPage.deactivateBtn.click();
      unitsPage.popUpCancelBtn.click();
      unitsPage.deactivateBtn.should("be.visible");
      unitsPage.deactivateBtn.click();
      unitsPage.popUpAgreementBtn.click();
      unitsPage.notificationPopUpDescription.should(
        "have.text",
        this.successMsg.deactivationSuccessMessage
      );
      unitsPage.emptyBlockInfotenderName.should("be.visible");
      unitsPage.notificationPopUpCrossIcon.click();
      unitsPage.notificationPopUpDescription.should("not.exist");
      unitsPage.deactivatedTab.click();
      unitsPage.unitName.first().should("have.text", unitName);
      crmApi.searhAdsByName(unitName).then((response) => {
        expect(response.body.results[0].name).to.be.eq(unitName);
        expect(response.body.results[0].is_archived).to.be.eq(true);
      });
    });
  });

  it("TC-363 Activation of a deactive unit.", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpAgreementBtn.click();
    unitsPage.notificationPopUpCrossIcon.click();
    unitsPage.deactivatedTab.should("be.visible");
    unitsPage.deactivatedTab.click();
    unitsPage.activateBtn.should("be.visible");
    unitsPage.unitCardNameText.then((unitName) => {
      unitsPage.activateBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popUpCloseIcon.click();
      unitsPage.activateBtn.should("be.visible");
      unitsPage.activateBtn.click();
      unitsPage.popUpCancelBtn.click();
      unitsPage.activateBtn.should("be.visible");
      unitsPage.activateBtn.click();
      unitsPage.popUpAgreementBtn.click();
      unitsPage.notificationPopUpDescription.invoke("text").then((text) => {
        expect(text).to.be.eq(this.successMsg.activationSuccessMessage);
      });
      unitsPage.emptyBlockInfotenderName.should("be.visible");
      unitsPage.notificationPopUpCrossIcon.click();
      unitsPage.notificationPopUpDescription.should("not.exist");
      unitsPage.activeTab.should("be.visible");
      unitsPage.activeTab.click();
      unitsPage.unitName.should("have.text", unitName);
      crmApi.searhAdsByName(unitName).then((response) => {
        expect(response.body.results[0].name).to.be.eq(unitName);
        expect(response.body.results[0].is_archived).to.be.eq(false);
      });
    });
  });

  it("TC-268 Deleting the unit.", function () {
    const tabs = ["deactivatedTabs", "expectedTabs", "rejectedTabs"];
    for (const tab of tabs) {
      switch (tab) {
        case "expectedTabs":
          unitsPage.createUnitWithoutApprove().then((status) => {
            expect(status).to.be.eq(201);
          });
          cy.reload();
          unitsPage.pendingTab.click();
          break;

        case "deactivatedTabs":
          unitsPage.deactivateBtn.should("be.visible");
          unitsPage.deactivateBtn.click();
          unitsPage.popUpAgreementBtn.click();
          unitsPage.deactivatedTab.click();
          break;

        case "rejectedTabs":
          unitsPage.createRejectedUnit();
          cy.reload();
          unitsPage.rejectedTabs.click();
          break;
      }

      unitsPage.unitCard.then((unitcard) => {
        expect(unitcard.length).to.be.at.least(1);
      });
      unitsPage.deleteBtn.should("be.visible");
      unitsPage.deleteBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popUpCloseIcon.click();
      unitsPage.deleteBtn.should("be.visible");
      unitsPage.deleteBtn.click();
      unitsPage.popUpCancelBtn.click();
      unitsPage.deleteBtn.should("be.visible");
      unitsPage.unitCardNameText.then((unitName) => {
        unitsPage.deleteBtn.click();
        unitsPage.popUpAgreementBtn.click();
        unitsPage.notificationPopUpDescription.should(
          "have.text",
          this.successMsg.deletionSuccessMessage
        );
        unitsPage.notificationPopUpCrossIcon.click();
        unitsPage.notificationPopUpDescription.should("not.exist");
        unitsPage.emptyBlockInfotenderName.should("be.visible");
        crmApi.searhAdsByName(unitName).then((response) => {
          expect(response.body.count).to.be.eq(0);
        });
      });
      this.isUnitDeleted = true;
    }
  });

  it("TC-280 Deleting the unit via the unit page with full information about the ad.", function () {
    const tabs = ["deactivatedTabs", "expectedTabs", "rejectedTabs"];
    for (const tab of tabs) {
      switch (tab) {
        case "expectedTabs":
          unitsPage.createUnitWithoutApprove().then((status) => {
            expect(status).to.be.eq(201);
          });
          cy.reload();
          unitsPage.pendingTab.click();
          break;

        case "deactivatedTabs":
          unitsPage.deactivateBtn.should("be.visible");
          unitsPage.deactivateBtn.click();
          unitsPage.popUpAgreementBtn.click();
          unitsPage.deactivatedTab.click();
          break;

        case "rejectedTabs":
          unitsPage.createRejectedUnit();
          cy.reload();
          unitsPage.rejectedTabs.click();
          break;
      }
      unitsPage.unitCardNameText.then((unitName) => {
        unitsPage.unitName.click();
        cy.wait(5000);
        unitsPage.deleteBtn.click();
        unitsPage.popUpWrapper.should("be.visible");
        unitsPage.popUpCloseIcon.click();
        cy.wait(1000);
        unitsPage.deleteBtn.should("be.visible");
        unitsPage.deleteBtn.click();
        unitsPage.popUpCancelBtn.click();
        cy.wait(1000)
        unitsPage.deleteBtn.should("be.visible");
        unitsPage.deleteBtn.click();
        unitsPage.popUpAgreementBtn.click();
        unitsPage.notificationPopUpDescription.should(
          "have.text",
          this.successMsg.deletionSuccessMessage
        );
        unitsPage.notificationPopUpCrossIcon.click();
        unitsPage.notificationPopUpDescription.should("not.exist");
        unitsPage.emptyBlockInfotenderName.should("be.visible");
        crmApi.searhAdsByName(unitName).then((response) => {
          expect(response.body.count).to.be.eq(0);
        });
      });
      this.isUnitDeleted = true;
    }
  });

  it("TC-740", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpCloseIcon.click();
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpCancelBtn.click();
    unitsPage.deactivateBtn.should("be.visible");
  });

  it("TC-741", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpAgreementBtn.should("be.visible");
    unitsPage.popUpAgreementBtn.click();
    unitsPage.notificationPopUpDescription.should(
      "have.text",
      this.successMsg.deactivationSuccessMessage
    );
    unitsPage.notificationPopUpCrossIcon.click();
    unitsPage.notificationPopUpDescription.should("not.exist");
  });

  it("TC-742", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpAgreementBtn.click();
    unitsPage.deactivatedTab.click();
    unitsPage.activateBtn.should("be.visible");
    unitsPage.activateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpCloseIcon.click();
    unitsPage.activateBtn.should("be.visible");
    unitsPage.activateBtn.click();
    unitsPage.popUpCancelBtn.click();
    unitsPage.activateBtn.should("be.visible");
  });

  it("TC-743", function () {
    unitsPage.deactivateBtn.should("be.visible");
    unitsPage.deactivateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpAgreementBtn.click();
    unitsPage.deactivatedTab.click();
    unitsPage.activateBtn.should("be.visible");
    unitsPage.activateBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpAgreementBtn.click();
    unitsPage.notificationPopUpDescription.invoke("text").then((text) => {
      expect(text).to.be.eq(this.successMsg.activationSuccessMessage);
    });
    unitsPage.notificationPopUpCrossIcon.click();
    unitsPage.notificationPopUpDescription.should("not.exist");
  });
});
