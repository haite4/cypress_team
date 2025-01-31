import loginPage from "cypress/pages/loginPage";
import unitsPage from "cypress/pages/unitsPage";
import unitApi from "cypress/api/unitApi";
import dateTime from "cypress/helper/dateTime";
import { Colors } from "cypress/constants/colors";
import randomValue from "cypress/helper/randomValue";

describe("Proposal functionality", () => {
  beforeEach("Add unit", function () {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();
    const { startFullDate, endFullDate } = dateTime.getSpecificDate();

    unitsPage.createApprovedUnit().then((data) => {
      cy.wrap(data.id).as("unitid");
      unitApi.createOrderAsAdmin(
        data.id,
        startFullDate.toISOString(),
        endFullDate.toISOString()
      );
    });
    cy.reload();
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
    cy.fixture("textSymbols/successMsg").as("successMsg");
  });

  afterEach("Remove unit after each test", function () {
    unitApi.deleteUnit(Number(this.unitid));
  });

  it("TC-1004 Confirm the proposal ", function () {
    unitsPage.proposalBtn.should("be.visible").click();
    unitsPage.proposesUnitTitle.eq(0).should("be.visible");
    unitsPage.submitProposalBtn.should("be.visible").click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popupHeader.should(
      "have.text",
      this.generalMsg.rentalOrderConfirmationPopUpTitle
    );
    unitsPage.confirmationPopUpInfo.should(
      "have.text",
      this.generalMsg.confirmationPopUpInfo
    );
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.popUpCloseIcon.click();
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.submitProposalBtn.click();
    unitsPage.popUpCancelBtn.click();
    unitsPage.popUpWrapper.should("not.exist");
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.submitProposalBtn.click();
    unitsPage.popUpWrapper.within(() => {
      unitsPage.submitProposalBtn.click();
    });
    cy.reload();
    unitsPage.proposalOrderUnit.should(
      "have.css",
      "border-color",
      Colors.SOFTGREEN
    );
    unitsPage.orderLabelStatus
      .should("have.text", this.successMsg.approvedMsg)
      .and("have.css", "color", Colors.LiGHGREEN);
    unitsPage.submitProposalBtn.should("not.exist");
  });

  it("TC-1005 Reject the proposal", function () {
    unitsPage.proposalBtn.click();
    unitsPage.proposesUnitTitle.eq(0).should("be.visible");
    unitsPage.unitName.invoke("text").then((unitName) => {
      unitsPage.rejectProposalBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popupHeader.should(
        "have.text",
        this.generalMsg.rejectRentalProposal
      );
      const reasonForCanceledApplication = Cypress._.template(
        this.generalMsg.reasonForCanceledApplication
      )({ unitName: unitName });

      unitsPage.cancelOrderPopUpDescription.should(
        "have.text",
        reasonForCanceledApplication
      );
      unitsPage.cancelOrderPopUpInput
        .should("have.attr", "placeholder", this.generalMsg.writeYourOwnVersion)
        .and("have.attr", "disabled");
      unitsPage.cancelPopUpReason.each((reason) => {
        cy.wrap(reason).find("input").should("not.be.checked");
        cy.wrap(reason)
          .invoke("text")
          .then((text) => {
            expect(this.generalMsg.canceledReason).to.include(text);
          });
      });
    });
    unitsPage.cancelPopUpReason.each((reason) => {
      cy.wrap(reason).find("input").check({ force: true });
      cy.wrap(reason)
        .invoke("text")
        .then((reasonMsg) => {
          if (reasonMsg === this.generalMsg.ownVariant) {
            unitsPage.cancelOrderPopUpInput.should("not.have.attr", "disabled");
          } else {
            unitsPage.cancelOrderPopUpInput.should("have.attr", "disabled");
          }
        });
    });
    unitsPage.popUpCloseIcon.click();
    unitsPage.rejectProposalBtn.should("be.visible").click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.cancelPopUpReason
      .eq(3)
      .find("input")
      .check({ force: true })
      .should("be.checked");
    unitsPage.cancelOrderPopUpInput.should("not.have.attr", "disabled");
    const randomString = randomValue.generateStringWithLength(20);
    unitsPage.cancelOrderPopUpInput
      .type(randomString)
      .should("have.value", randomString);
    unitsPage.popUpWrapper.within(() => {
      unitsPage.rejectProposalBtn.click();
    });
    cy.reload();
    unitsPage.proposalOrderUnit.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
    unitsPage.orderLabelStatus
      .should("have.text", this.errorMsg.Canceled)
      .and("have.css", "color", Colors.REDCOLOR);
    unitsPage.rejectProposalBtn.should("not.exist");
  });

  it("TC-1006 verify proposal page elements", function () {
    unitsPage.proposalBtn.click();
    unitsPage.proposesUnitTitle
      .eq(0)
      .should("be.visible")
      .and("have.text", this.generalMsg.suggestionsForTheAnnouncement);
    unitsPage.backBtn.should("be.visible");
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.rejectProposalBtn.should("be.visible");
    unitsPage.proposalDetailedBtn.should("be.visible");
    unitsPage.proposalOrderUnit.then((unitsQuantity) => {
      const reasonForCanceledApplication = Cypress._.template(
        this.generalMsg.ListOfProposals
      )({ unitQuantity: unitsQuantity.length });
      unitsPage.proposesUnitTitle
        .eq(1)
        .should("have.text", reasonForCanceledApplication);
    });
    unitsPage.backBtn.click();
    unitsPage.activeTab.should("be.visible");
    unitsPage.proposalBtn.click();
    unitsPage.proposesUnitTitle
      .eq(0)
      .should("be.visible")
      .and("have.text", this.generalMsg.suggestionsForTheAnnouncement);
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.rejectProposalBtn.should("be.visible");
    unitsPage.proposalDetailedBtn.should("be.visible");
    unitsPage.proposalOrderUnit.then((unitsQuantity) => {
      const reasonForCanceledApplication = Cypress._.template(
        this.generalMsg.ListOfProposals
      )({ unitQuantity: unitsQuantity.length });
      unitsPage.proposesUnitTitle
        .eq(1)
        .should("have.text", reasonForCanceledApplication);
    });
  });

  it("TC-1007 Proposal details", function () {
    unitsPage.proposalBtn.click();
    unitsPage.proposesUnitTitle
      .eq(0)
      .should("be.visible")
      .and("have.text", this.generalMsg.suggestionsForTheAnnouncement);
    unitsPage.proposalDetailedBtn.click();
    unitsPage.proposalDetaiedTitle
      .should("be.visible")
    unitsPage.proposalDetaiedTitle.invoke("text").then((text) => {
      expect(text).to.be.eq(this.generalMsg.proposalDetailedTitle)
    }) 
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.rejectProposalBtn.should("be.visible");
    unitsPage.backBtn.should("be.visible");
    unitsPage.orderDetailsLabel
      .eq(0)
      .should("have.text", this.generalMsg.rentPeriodTitle);
    unitsPage.orderDetailsLabel
      .eq(1)
      .should("have.text", this.generalMsg.commentsTitle);
    unitsPage.backBtn.click();
    unitsPage.proposesUnitTitle.eq(0).should("be.visible");
    unitsPage.proposalDetailedBtn.click();
    unitsPage.proposalDetaiedTitle.should("be.visible");
  });

  it("TC-1008 Confirm proposal in deactivation tab", function () {
    unitsPage.deactivateBtn.click();
    unitsPage.popUpAgreementBtn.click();
    cy.reload();
    unitsPage.deactivatedTab.click();
    unitsPage.proposalBtn.should("be.visible").click();
    unitsPage.proposesUnitTitle.eq(0).should("be.visible");
    unitsPage.submitProposalBtn.should("be.visible").click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popupHeader.should(
      "have.text",
      this.generalMsg.rentalOrderConfirmationPopUpTitle
    );
    unitsPage.confirmationPopUpInfo.should(
      "have.text",
      this.generalMsg.confirmationPopUpInfo
    );
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.popUpCloseIcon.click();
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.submitProposalBtn.click();
    unitsPage.popUpCancelBtn.click();
    unitsPage.popUpWrapper.should("not.exist");
    unitsPage.submitProposalBtn.should("be.visible");
    unitsPage.submitProposalBtn.click();
    unitsPage.popUpWrapper.within(() => {
      unitsPage.popUpCloseIcon.click();
    });
    unitsPage.proposalOrderUnit.should(
      "have.css",
      "border-color",
      Colors.DARKBLUE
    );
  });

  it("TC-1009 Reject proposal in deactivation tab", function () {
    unitsPage.deactivateBtn.click();
    unitsPage.popUpAgreementBtn.click();
    cy.reload();
    unitsPage.deactivatedTab.click();
    unitsPage.proposalBtn.click();
    unitsPage.proposesUnitTitle.eq(0).should("be.visible");
    unitsPage.unitName.invoke("text").then((unitName) => {
      unitsPage.rejectProposalBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popupHeader.should(
        "have.text",
        this.generalMsg.rejectRentalProposal
      );
      const reasonForCanceledApplication = Cypress._.template(
        this.generalMsg.reasonForCanceledApplication
      )({ unitName: unitName.slice(0, 13) });

      unitsPage.cancelOrderPopUpDescription.should(
        "have.text",
        reasonForCanceledApplication
      );
      unitsPage.cancelOrderPopUpInput
        .should("have.attr", "placeholder", this.generalMsg.writeYourOwnVersion)
        .and("have.attr", "disabled");
      unitsPage.cancelPopUpReason.each((reason) => {
        cy.wrap(reason).find("input").should("not.be.checked");
        cy.wrap(reason)
          .invoke("text")
          .then((text) => {
            expect(this.generalMsg.canceledReason).to.include(text);
          });
      });
    });
    unitsPage.cancelPopUpReason.each((reason) => {
      cy.wrap(reason).find("input").check({ force: true });
      cy.wrap(reason)
        .invoke("text")
        .then((reasonMsg) => {
          if (reasonMsg === this.generalMsg.ownVariant) {
            unitsPage.cancelOrderPopUpInput.should("not.have.attr", "disabled");
          } else {
            unitsPage.cancelOrderPopUpInput.should("have.attr", "disabled");
          }
        });
    });
    unitsPage.popUpWrapper.within(() => {
      unitsPage.popUpCloseIcon.click();
    });
    unitsPage.proposalOrderUnit.should(
      "have.css",
      "border-color",
      Colors.DARKBLUE
    );
  });

  it("TC-1010 Fill rejection application with inccorect symbols", function () {
    unitsPage.deactivateBtn.click();
    unitsPage.popUpAgreementBtn.click();
    cy.reload();
    unitsPage.deactivatedTab.click();
    unitsPage.proposalBtn.click();
    unitsPage.unitName.invoke("text").then((unitName) => {
      unitsPage.rejectProposalBtn.click();
      unitsPage.popUpWrapper.should("be.visible");
      unitsPage.popupHeader.should(
        "have.text",
        this.generalMsg.rejectRentalProposal
      );
      const reasonForCanceledApplication = Cypress._.template(
        this.generalMsg.reasonForCanceledApplication
      )({ unitName: unitName });

      unitsPage.cancelOrderPopUpDescription.should(
        "have.text",
        reasonForCanceledApplication
      );
      unitsPage.cancelOrderPopUpInput
        .should("have.attr", "placeholder", this.generalMsg.writeYourOwnVersion)
        .and("have.attr", "disabled");
      unitsPage.cancelPopUpReason.each((reason) => {
        cy.wrap(reason).find("input").should("not.be.checked");
        cy.wrap(reason)
          .invoke("text")
          .then((text) => {
            expect(this.generalMsg.canceledReason).to.include(text);
          });
      });
      unitsPage.cancelPopUpReason.each((reason) => {
        cy.wrap(reason).find("input").check({ force: true });
        cy.wrap(reason)
          .invoke("text")
          .then((reasonMsg) => {
            if (reasonMsg === this.generalMsg.ownVariant) {
              unitsPage.cancelOrderPopUpInput.should(
                "not.have.attr",
                "disabled"
              );
            } else {
              unitsPage.cancelOrderPopUpInput.should("have.attr", "disabled");
            }
          });
      });
      unitsPage.popUpWrapper.within(() => {
        unitsPage.popUpCloseIcon.click();
      });
      unitsPage.rejectProposalBtn.should("be.visible");
      unitsPage.rejectProposalBtn.click();
      unitsPage.popUpWrapper.within(() => {
        unitsPage.rejectProposalBtn.click();
        unitsPage.cancelOrderPopUpError
          .should("have.text", this.errorMsg.selectVariantFromList)
          .and("have.css", "color", Colors.STRONGRED);
      });
      unitsPage.cancelPopUpReason
        .eq(3)
        .find("input")
        .check({ force: true })
        .should("be.checked");
      unitsPage.cancelOrderPopUpError.should("not.exist");
      unitsPage.popUpWrapper.within(() => {
        unitsPage.rejectProposalBtn.click();
      });
      unitsPage.cancelOrderPopUpError
        .should("have.text", this.errorMsg.canceledOrderPopUpReuiredField)
        .and("have.css", "color", Colors.STRONGRED);
      unitsPage.cancelOrderPopUpInput.should("not.have.attr", "disabled");
      unitsPage.cancelOrderPopUpInput.should(
        "have.css",
        "border-color",
        Colors.STRONGRED
      );
      unitsPage.cancelOrderPopUpInput
        .type(this.generalMsg.invalidSymbols)
        .should("be.empty");
    });
  });
});