import loginPage from "cypress/pages/loginPage";
import unitsPage from "cypress/pages/unitsPage";
import randomValue from "cypress/helper/randomValue";
import crmApi from "cypress/api/crmApi";
import tenderApi from "cypress/api/tenderApi";

describe("Edit the pending tender functionality", () => {
  beforeEach("", () => {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    loginPage.userIcon.click();

    tenderApi.createTender().then((response) => {
      cy.wrap(response.body.id).as("tenderId");
      cy.wrap(response.body.name).as("tenderName");
      cy.wrap(response.body.date_created).as("tenderCreatedDate");
      cy.wrap(response.body.city).as("tenderCity");
      cy.wrap(response.body.state).as("tenderState");
      tenderApi.attachFile(response.body.id, "images/uploadImage.jpg");
    });
    loginPage.tendersDropdownButton.click();
    unitsPage.expectingdUnit.click();
    unitsPage.tenderCard.should("be.visible");
    unitsPage.editTenderBtn.click();
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
    cy.fixture("textSymbols/successMsg").as("successMsg");
  });

  afterEach("Delete tender", function () {
    tenderApi.closeTender(this.tenderId).then((response) => {
      tenderApi.deleteTender(response.body.id);
    });
  });
  it("TC-237 Edit the tender name input", function () {
    unitsPage.editAnnouncmentTitle.should(
      "have.text",
      this.generalMsg.editTendertenderName
    );
    cy.wait(1000)
    unitsPage.tenderInput.clear().should("have.value", "");
    unitsPage.nextBtn.should("be.enabled").click();
    unitsPage.descriptionError.should(
      "have.text",
      this.errorMsg.tenderNameToShort
    );
    unitsPage.tenderInput.type(randomValue.generateStringWithLength(9));
    unitsPage.nextBtn.should("be.enabled").click();
    unitsPage.descriptionError
      .should("be.visible")
      .and("have.text", this.errorMsg.tenderNameToShort);
    unitsPage.tenderInput.clear();

    for (const symbol of this.generalMsg.invalidSymbols) {
      const text = randomValue.generateStringWithLength(10);
      unitsPage.tenderInput.type(`${text}${symbol}`);
      unitsPage.tenderInput.invoke("val").then((inputValue) => {
        expect(inputValue).to.be.eq(text);
      });
      unitsPage.tenderInput.clear();
    }
    unitsPage.tenderInput.type(randomValue.generateStringWithLength(71));
    unitsPage.tenderInput.invoke("val").then((inputValue) => {
      expect(inputValue).to.have.length(70);
    });
  });

  it("TC-237 Edit the tender service name and datepicker", function () {
    unitsPage.editAnnouncmentTitle.should(
      "have.text",
      this.generalMsg.editTendertenderName
    );
    cy.wait(1000)
    unitsPage.closeBtn.should("be.enabled").and("be.visible").click();
    unitsPage.servicesInput.should("be.enabled").and("be.visible")
    unitsPage.servicesInput.invoke("val").then((inputValue) => {
      expect(inputValue).to.be.eq("");
    });
    cy.wait(1000)
    unitsPage.nextBtn.should("be.enabled").and("be.visible").click();
    unitsPage.serviceError.should("have.text", this.errorMsg.requiredField);
    unitsPage.servicesInput.click().type(this.generalMsg.cleaning);
    unitsPage.servicesDropDownItem.each((item) => {
      const text = item.text().toLowerCase();
      expect(text).include(this.generalMsg.cleaning);
    });
    unitsPage.servicesDropDownItem
      .first()
      .invoke("text")
      .then((serviceText) => {
        unitsPage.servicesDropDownItem.first().click();
        unitsPage.selectedServices.should("have.text", serviceText);
      });
    unitsPage.dateTimePicker.each((dateInput) => {
      cy.wrap(dateInput).should("have.attr", "readonly");
    });
  });

  it("TC-237 verify budget field", function () {
    unitsPage.budgetInput.should("be.enabled").and("be.visible")
    cy.wait(1000)
    unitsPage.budgetInput.clear();
    unitsPage.budgetInput.should("have.value", "");
    unitsPage.budgetInput.type(this.generalMsg.invalidSymbols);
    unitsPage.budgetInput.should("have.value", "");
    unitsPage.nextBtn.should("be.enabled").and("be.visible").click();
    unitsPage.descriptionError.should("have.text", this.errorMsg.requiredField);
    unitsPage.budgetInput.type(
      String(randomValue.generateRandomNumber(1000000000, 9999999999))
    );
    unitsPage.budgetInput.invoke("val").then((inputValue) => {
      expect(inputValue).to.have.length(9);
    });
  });

  it("TC-237 verify additional information and  list of documents field", function () {
    cy.wait(1000);
    unitsPage.textAreaInput
      .should("be.enabled")
      .and("be.visible")
    unitsPage.textAreaInput.clear().should("have.text", "");
    unitsPage.nextBtn.should("be.enabled").click();
    const symbolLengthZero = Cypress._.template(
      this.errorMsg.textAreaDescriptionMinLengthError
    )({ symbolLength: 0 });
    unitsPage.textAreaError.should("have.text", symbolLengthZero);
    unitsPage.textAreaInput.type(randomValue.generateStringWithLength(39));
    unitsPage.textAreaInput.invoke("text").then((textAreaInput) => {
      const inputText = textAreaInput as string;
      cy.log(`${inputText.length}`)
      const symbolLength = Cypress._.template(
        this.errorMsg.textAreaDescriptionMinLengthError
      )({ symbolLength: inputText.length });
      unitsPage.nextBtn.click();
      unitsPage.textAreaError.should("have.text", symbolLength);
      cy.wait(1000)
      unitsPage.textAreaInput.clear();
    });
    for (const symbol of this.generalMsg.invalidSymbols) {
      const randomString = randomValue.generateStringWithLength(40);
      const textWithSymbol = `${randomString}${symbol}`;
      unitsPage.textAreaInput.type(textWithSymbol);
      unitsPage.textAreaInput.should("have.text", randomString);
      unitsPage.textAreaInput.clear();
    }
    unitsPage.deleteFileRedBucketIcon.click();
    unitsPage.nextBtn.click();
    unitsPage.documentChoosingError.should(
      "have.text",
      this.errorMsg.missingFilesError
    );
  });

  it("TC-237 verify job contact person firstName, lastName and phoneNumber field", function () {
    cy.wait(1000);
    unitsPage.jobContactPersonInput
      .should("be.enabled")
      .and("be.visible")
      unitsPage.jobContactPersonInput.uncheck();
      cy.wait(2000)
    unitsPage.jobContactPersonInfotenderName
      .eq(0)
      .invoke("text")
      .should("match", /^Прізвище.*\*$/);
    unitsPage.jobContactPersonInfotenderName
      .eq(1)
      .invoke("text")
      .should("match", /^Ім’я.*\*$/);
    unitsPage.jobContactPersonInfoPhonetenderName
      .invoke("text")
      .should("match", /^Телефон.*\*$/);
    unitsPage.jobContactPersonInfoError.each((error) => {
      expect(error.text()).to.be.eq(this.errorMsg.requiredField);
    });
    unitsPage.jobContactPersonInfoPhoneError.should(
      "have.text",
      this.errorMsg.requiredField
    );
    const firstName = randomValue.firstName();
    const lastName = randomValue.lastName();
    const phoneNumber = `50${randomValue.phoneNumeric(7)}`;
    unitsPage.jobContactInput
      .eq(0)
      .should("be.enabled")
      .type(lastName)
      .should("have.value", lastName);
    unitsPage.jobContactInput
      .eq(1)
      .should("be.enabled")
      .type(firstName)
      .should("have.value", firstName);
    unitsPage.phoneNumberInput.should("be.enabled").type(phoneNumber);
    unitsPage.phoneNumberInput.invoke("val").then((phoneNum) => {
      const phone = phoneNum as string;
      expect(phone.trim().replace(/\s+/g, "")).to.be.equal(
        `+380${phoneNumber}`
      );
    });
    unitsPage.jobContactPersonInfoError.should("not.exist");
    unitsPage.jobContactPersonInfoPhoneError.should("not.exist");
    unitsPage.jobContactInput.eq(0).clear();
    unitsPage.nextBtn.click();
    unitsPage.jobContactPersonInfoError.should(
      "have.text",
      this.errorMsg.requiredField
    );
    unitsPage.jobContactInput
      .eq(0)
      .type(randomValue.generateStringWithLength(1));
    unitsPage.nextBtn.click();
    unitsPage.jobContactPersonInfoError.should(
      "have.text",
      this.errorMsg.lastNameValidationError
    );
    unitsPage.jobContactInput
      .eq(0)
      .type(randomValue.generateStringWithLength(26));
    unitsPage.nextBtn.click();
    unitsPage.jobContactPersonInfoError.should(
      "have.text",
      this.errorMsg.personInfoMaxCharacters
    );
    unitsPage.jobContactInput.eq(0).clear();

    for (const symbol of this.generalMsg.invalidSymbols) {
      const lastNameWithSymbol = `${lastName}${symbol}`;
      unitsPage.jobContactInput.eq(0).type(lastNameWithSymbol);
      unitsPage.jobContactInput.eq(0).should("have.value", lastName);
      unitsPage.jobContactInput.eq(0).clear();
    }
    unitsPage.jobContactInput
      .eq(0)
      .type(randomValue.generateStringWithLength(5));
    unitsPage.jobContactInput
      .eq(1)
      .clear()
      .type(randomValue.generateStringWithLength(1));
    unitsPage.nextBtn.click();
    unitsPage.jobContactPersonInfoError.should(
      "have.text",
      this.errorMsg.firstNameValidationError
    );
    unitsPage.jobContactInput
      .eq(1)
      .type(randomValue.generateStringWithLength(26));
    unitsPage.nextBtn.click();
    unitsPage.jobContactPersonInfoError.should(
      "have.text",
      this.errorMsg.personInfoMaxCharacters
    );
    unitsPage.jobContactInput.eq(1).clear();
    for (const symbol of this.generalMsg.invalidSymbols) {
      const firstNameWithSymbol = `${firstName}${symbol}`;
      unitsPage.jobContactInput.eq(1).type(firstNameWithSymbol);
      unitsPage.jobContactInput.eq(1).should("have.value", firstName);
      unitsPage.jobContactInput.eq(1).clear();
    }
    unitsPage.jobContactInput.eq(1).type(firstName);
    unitsPage.phoneNumberInput.clear();
    unitsPage.nextBtn.click();
    for (const symbol of this.generalMsg.invalidSymbols) {
      const eightPhoneNumber = `+38050${randomValue.phoneNumeric(6)}`;
      const numberWithInvalidSymbol = `${eightPhoneNumber}${symbol}`;
      unitsPage.phoneNumberInput.click().clear().type(numberWithInvalidSymbol);
      unitsPage.phoneNumberInput.invoke("val").then((value) => {
        const phone = value as string;
        expect(phone.trim().replace(/\s+/g, "")).to.be.equal(eightPhoneNumber);
      });
      unitsPage.nextBtn.click();

      unitsPage.jobContactPersonInfoPhoneError.should(
        "have.text",
        this.errorMsg.errorInvalidPhone
      );
      unitsPage.phoneNumberInput.clear();
    }
    unitsPage.phoneNumberInput.type(`+38050${randomValue.phoneNumeric(8)}`);
    unitsPage.phoneNumberInput.invoke("val").then((val) => {
      const inputValue = val as string;
      expect(inputValue.replace(/[\s+]/g, "")).to.have.length(12);
    });
    unitsPage.nextBtn.click();
    unitsPage.successfullyEditedMsg.should(
      "have.text",
      this.successMsg.tenderSuccesfullyEditMsg
    );
    unitsPage.viewInMyList.should("have.text", this.generalMsg.viewIntendersDropdownButton);
    unitsPage.viewInMyList.click();
    unitsPage.tenderCard.should("be.visible");
    loginPage.userIcon.click();
    loginPage.logoutBtn.click();
    loginPage.headerAuthBtn.should("be.visible");
    crmApi.searchTenderById(this.tenderId).then((response) => {
      expect(response.body.results[0].id).to.be.eq(this.tenderId);
      expect(response.body.results[0].name).to.be.eq(this.tenderName);
      expect(response.body.results[0].date_created).to.be.eq(
        this.tenderCreatedDate
      );
      expect(response.body.results[0].city).to.be.eq(this.tenderCity);
      expect(response.body.results[0].state).to.be.eq(this.tenderState);
    });
  });
});
