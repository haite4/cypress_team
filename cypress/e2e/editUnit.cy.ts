import crmApi from "cypress/api/crmApi";
import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import randomValue from "cypress/helper/randomValue";
import unitApi from "cypress/api/unitApi";

describe("Unit Edit functionality", () => {
  const unitIdList = []
  beforeEach("Add unit", () => {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();
    unitsPage.createApprovedUnit().then((data) => {
      cy.reload();
      unitIdList.push(data.id)
      cy.wrap(data.id).as("unitid");
    });
    unitsPage.unitCard.then((unitcard) => {
      expect(unitcard.length).to.be.at.least(1);
    });
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
  });

  after("Remove unit after each test", function () {
    cy.wrap(unitIdList).each((id) => {
      unitApi.deleteUnit(Number(id));
    });
  });

  it("TC-182 Edit Unit without changes", function () {
    unitsPage.unitCardTitleText.then((unitName) => {
      unitsPage.editBtn.click();
      unitsPage.editAnnouncmentTitle.should("be.visible");
      unitsPage.preventBtn.first().click();
      unitsPage.unitCard.should("be.visible");
      unitsPage.editBtn.click();
      cy.wait(2000)
      unitsPage.nextBtn.first().click();
      unitsPage.successfullyEditedMsg.should("be.visible");
      unitsPage.viewInMyAdsBtn.should("be.visible");
      unitsPage.viewInMyAdsBtn.click();
      unitsPage.emptyBlockInfoTitle.should("be.visible");
      crmApi.searchPendingAdsByName(unitName).then((response) => {
        expect(response.status).to.be.eq(200);
        expect(response.body.results[0].name).to.be.eq(unitName);
      });
    });
  });

  it("TC-272 Check 'Назва оголошення' input field", function () {
    unitsPage.editBtn.click();
    cy.wait(2000)
    unitsPage.announcementInput.clear();
    unitsPage.announcementInput.should("have.value", "");
    unitsPage.announcementInput.should(
      "have.attr",
      "placeholder",
      this.generalMsg.announcementPlaceholder
    );
    unitsPage.nextBtn.click();
    unitsPage.descriptionError.should("have.text", this.errorMsg.requiredField);
    unitsPage.announcementInput.type(this.generalMsg.invalidSymbols);
    unitsPage.announcementInput.should("have.value", "");
    unitsPage.announcementInput.type(randomValue.generateStringWithLength(9));
    unitsPage.nextBtn.click();
    unitsPage.descriptionError.should(
      "have.text",
      this.errorMsg.minimumAnnouncementTitleLengthIsTen
    );
    unitsPage.announcementInput.type(randomValue.generateStringWithLength(101));
    unitsPage.descriptionError.should(
      "have.text",
      this.errorMsg.maximumAnnouncementTitleLengthIsOneHundred
    );
    unitsPage.announcementInput.clear();
    const randomUnitName = randomValue.generateStringWithLength(15);
    unitsPage.announcementInput.type(randomUnitName);
    unitsPage.descriptionError.should("not.exist");
    unitsPage.nextBtn.click();
    unitsPage.successfullyEditedMsg.should("be.visible");
    unitsPage.viewInMyAdsBtn.should("be.visible");
    crmApi.searchPendingAdsByName(randomUnitName).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.body.results[0].name).to.be.eq(randomUnitName);
    });
  });

  it("TC-273 Check 'Виробник транспортного засобу' input field", function () {
    unitsPage.editBtn.click();
    unitsPage.closeVehicleBtn.click();
    unitsPage.vehicleManufacturerInput.should(
      "have.attr",
      "placeholder",
      this.generalMsg.manufacturerPlaceholder
    );
    unitsPage.nextBtn.click();
    unitsPage.vehicleManufacturerError.should(
      "have.text",
      this.errorMsg.requiredField
    );
    unitsPage.vehicleManufacturerInput.type(this.generalMsg.invalidSymbols);
    unitsPage.vehicleManufacturerInput.should("have.value", "");
    unitsPage.vehicleManufacturerError.should(
      "have.text",
      this.errorMsg.requiredField
    );
    const randomName = randomValue.generateStringWithLength(12);
    unitsPage.vehicleManufacturerInput.type(randomName);
    unitsPage.vehicleManufacturerNotFoundItem.then((element) => {
      const regex = new RegExp(
        `На жаль, виробника “${randomName}“ не знайдено в нашій базі. Щоб додати виробника - зв\`яжіться із службою підтримки`,
        "i"
      );
      expect(element.text()).to.match(regex);
    });
    unitsPage.vehicleManufacturerInput.clear();
    unitsPage.vehicleManufacturerInput.type(
      this.generalMsg.vehicleManufacturerName
    );
    unitsPage.vehicleManufacturerDropDownItem.should("be.visible");
    unitsPage.vehicleManufacturerDropDownItem.click();
    unitsPage.vehicleManufacturerError.should("not.exist");
    unitsPage.closeVehicleBtn.should("be.visible");
    unitsPage.selectedVehicleManufacturer.should(
      "have.text",
      this.generalMsg.vehicleManufacturerName
    );
    unitsPage.announcementInput.invoke("val").then((value) => {
      unitsPage.nextBtn.click();
      unitsPage.successfullyEditedMsg.should("be.visible");
      unitsPage.viewInMyAdsBtn.should("be.visible");
      crmApi.searchPendingAdsByName(String(value)).then((response) => {
        const manufacturerId = response.body.results[0].manufacturer;
        crmApi.manufacturersById(manufacturerId).then((response) => {
          const manufacturerName = response.body.name;
          expect(manufacturerName).to.be.eq(
            this.generalMsg.vehicleManufacturerName
          );
          expect(response.status).to.be.eq(200);
        });
      });
    });
  });

  it("TC-532 Check 'Назва моделі' input field", function () {
    unitsPage.editBtn.click();
    cy.wait(2000)
    unitsPage.modelNameInput.should("be.visible")
    unitsPage.modelNameInput.clear();
    unitsPage.modelNameInput.should("have.value", "");
    unitsPage.modelNameInput.type(this.generalMsg.invalidSymbols);
    unitsPage.modelNameInput.should("have.value", "");
    unitsPage.modelNameInput.type(randomValue.generateStringWithLength(16));
    unitsPage.descriptionError.should(
      "have.text",
      this.errorMsg.modelNameMax15
    );
    unitsPage.modelNameInput.clear();
    unitsPage.announcementInput.invoke("val").then((value) => {
      const randomModelName = randomValue.generateStringWithLength(15);
      unitsPage.modelNameInput.type(randomModelName);
      unitsPage.nextBtn.click();
      unitsPage.successfullyEditedMsg.should("be.visible");
      unitsPage.viewInMyAdsBtn.should("be.visible");
      crmApi.searchPendingAdsByName(String(value)).then((response) => {
        const modelName = response.body.results[0].model_name;
        expect(modelName).to.be.eq(randomModelName);
        expect(response.status).to.be.eq(200);
      });
    });
  });

  it("TC-533 Check 'Технічні характеристики' input field", function () {
    unitsPage.editBtn.click();
    cy.wait(2000)
    unitsPage.techSpecsTextArea.should("be.visible")
    unitsPage.techSpecsTextArea.clear();
    unitsPage.techSpecsTextArea.should("have.value", "");
    unitsPage.nextBtn.click();
    unitsPage.successfullyEditedMsg.should("be.visible");
    unitsPage.viewInMyAdsBtn.should("be.visible");
    unitsPage.viewInMyAdsBtn.click();
    unitsPage.expectingdUnit.click();
    unitsPage.editBtn.eq(0).click();
    unitsPage.techSpecsTextArea.should("have.value", "");
    unitsPage.techSpecsTextArea.type(this.generalMsg.invalidSymbols);
    unitsPage.techSpecsTextArea.should("have.value", "");
    const randomTechSpecs = randomValue.generateStringWithLength(20);
    unitsPage.techSpecsTextArea.type(randomTechSpecs);
    unitsPage.announcementInput.invoke("val").then((value) => {
      unitsPage.nextBtn.click();
      unitsPage.successfullyEditedMsg.should("be.visible");
      unitsPage.viewInMyAdsBtn.should("be.visible");
      crmApi.searchPendingAdsByName(String(value)).then((response) => {
        const unitId = response.body.results[0].id;
        crmApi.getUnitById(unitId).then((response) => {
          expect(response.body.features).to.be.eq(randomTechSpecs);
          expect(response.status).to.be.eq(200);
        });
      });
    });
  });

  it("TC-534 Check 'Опис' input field", function () {
    unitsPage.editBtn.click();
    cy.wait(2000)
    unitsPage.detailedDescriptionTextArea.should("be.visible")
    unitsPage.detailedDescriptionTextArea.clear();
    unitsPage.detailedDescriptionTextArea.should("have.value", "");
    unitsPage.nextBtn.click();
    unitsPage.successfullyEditedMsg.should("be.visible");
    unitsPage.viewInMyAdsBtn.should("be.visible");
    unitsPage.viewInMyAdsBtn.click();
    unitsPage.expectingdUnit.click();
    unitsPage.editBtn.eq(0).click();
    unitsPage.detailedDescriptionTextArea.should("have.value", "");
    unitsPage.detailedDescriptionTextArea.type(this.generalMsg.invalidSymbols);
    unitsPage.detailedDescriptionTextArea.should("have.value", "");
    const randomDetaildDescription = randomValue.generateStringWithLength(60);
    unitsPage.detailedDescriptionTextArea.type(randomDetaildDescription);
    cy.wait(2000)
    unitsPage.announcementInput.invoke("val").then((value) => {
      unitsPage.nextBtn.click();
      unitsPage.successfullyEditedMsg.should("be.visible");
      unitsPage.viewInMyAdsBtn.should("be.visible");
      crmApi.searchPendingAdsByName(String(value)).then((response) => {
        const unitId = response.body.results[0].id;
        crmApi.getUnitById(unitId).then((response) => {
          expect(response.body.description).to.be.eq(randomDetaildDescription);
          expect(response.status).to.be.eq(200);
        });
      });
    });
  });

  it("TC-535 Check 'Місце розташування технічного засобу' functionality", function () {
    unitsPage.editBtn.click();
    unitsPage.choseOnMapBtn.click();
    unitsPage.mapPopUpTitle.should(
      "have.text",
      this.generalMsg.mapEquipmentTitle
    );
    unitsPage.getMapPopUpBoundingBox().then(({ x, y }) => {
      cy.get("body").click(x, y);
    });
    cy.wait(3000)
    unitsPage.selectedAdress.invoke("text").then((address) => {
      unitsPage.mapPopUpSubmitBtn.click();
      unitsPage.mapPopUp.should("not.exist");
      unitsPage.mapLabel.should("have.text", address);
      cy.wait(2000)
      unitsPage.announcementInput.invoke("val").then((value) => {
        unitsPage.nextBtn.click();
        unitsPage.successfullyEditedMsg.should("be.visible");
        unitsPage.viewInMyAdsBtn.should("be.visible");
        crmApi.searchPendingAdsByName(String(value)).then((response) => {
          const unitId = response.body.results[0].id;
          crmApi.getUnitById(unitId).then((response) => {
            expect(response.body.country).to.be.eq(this.generalMsg.country);
            expect(response.body.region).to.be.eq(this.generalMsg.region);
            expect(response.body.city).to.be.eq(this.generalMsg.city);
            expect(response.status).to.be.eq(200);
          });
        });
      });
    });
  });
});
