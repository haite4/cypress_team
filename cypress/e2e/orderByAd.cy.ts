import loginPage from "cypress/pages/loginPage";
import page from "../pages/page";
import productsPage from "cypress/pages/productsPage";
import unitsPage from "cypress/pages/unitsPage";
import dateTime from "cypress/helper/dateTime";
import unitApi from "cypress/api/unitApi";
import randomValue from "cypress/helper/randomValue";
import { Colors } from "cypress/constants/colors";
import {
  sixImagesJpgFormat,
  validImage,
  invalidFileFormat,
  invalidFileSize,
  createTenderDuplicatedImage,
} from "../constants/fileData";

describe("Order by ad functionality", () => {
  beforeEach("Add unit", function () {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("ADMIN_EMAIL"), Cypress.env("ADMIN_PASSWORD"));
    unitsPage.createApprovedUnit().then((data) => {
      cy.reload();
      cy.wrap(data.id).as("unitid");
    });
    page.announcementLink.click({ force: true });
    productsPage.cardWrappers.first().click();
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
  });

  afterEach("Remove unit after each test", function () {
    unitApi.deleteUnit(Number(this.unitid));
  });

  it("TC-1000 Order by ad", function () {
    unitsPage.orderBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popupHeader.should("have.text", this.generalMsg.orderEquipment);
    unitsPage.orderPopUpLabel
      .eq(0)
      .should("be.visible")
      .invoke("text")
      .should("match", /^Період оренди.*\*$/);

    unitsPage.popUpPeriodArea.click();
    unitsPage.popUpDateTimePicker.should("be.visible");
    const { randomStartDate, randomEndDate, startFullDate, endFullDate } =
      dateTime.getSpecificDate();
    unitsPage.getdatePickerDay(randomStartDate, 0).click();
    unitsPage.getdatePickerDay(randomEndDate, 1).click();

    unitsPage.popUpPeriodArea.should(
      "have.text",
      dateTime.formatDateRangeIntl(startFullDate, endFullDate)
    );
    unitsPage.orderPopUpLabel
      .eq(1)
      .should("be.visible")
      .invoke("text")
      .should("match", /^Додаткові файли.*\*$/);

    unitsPage.filesChoosingInstruction.invoke("text").then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).to.equal(
        this.generalMsg.fileUploadInstructions
      );
    });
    unitsPage.fileChoosingInfo.invoke("text").then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).to.equal(
        this.generalMsg.fileUploadInfo
      );
    });

    unitsPage.fileChooserInput.selectFile(validImage, { force: true });

    unitsPage.selectedFilesList
      .should("be.visible")
      .should("have.text", "uploadImage.jpg");
    unitsPage.bucketIcon.should("be.visible");
    unitsPage.orderPopUpLabel
      .eq(2)
      .should("be.visible")
      .invoke("text")
      .should("match", /^Коментар.*\*$/);
    unitsPage.popUpTextArea.should("be.visible");
    unitsPage.popUpTextArea
      .invoke("attr", "placeholder")
      .then((placeholder) => {
        expect(placeholder).to.be.eq(this.generalMsg.addCommentForProposal);
      });
    const randomString = randomValue.generateStringWithLength(50);
    unitsPage.popUpTextArea.type(randomString);
    unitsPage.popUpTextArea.should("have.text", randomString);
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError.should("not.exist");
  });

  it("TC-1001 Verify rental period field when order by ad", function () {
    unitsPage.orderBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError
      .eq(1)
      .should("exist")
      .should("have.css", "color", Colors.REDCOLOR)
      .invoke("text")
      .then((error) => {
        expect(error).to.be.eq(this.errorMsg.fieldisReuqired);
      });
    unitsPage.popUpPeriodTextArea.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
    unitsPage.popUpPeriodArea.click();
    unitsPage.popUpDateTimePicker.should("be.visible");
    const now = new Date();
    const maxDayInCurrentMonth = dateTime.getDaysinMonth(1);
    const randomStartDate = dateTime.getRandomDate(
      now.getDate(),
      maxDayInCurrentMonth
    );
    unitsPage.getdatePickerDay(randomStartDate, 0).click();
    unitsPage.popUpPeriodTextArea.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
    unitsPage.orderPopUpError
      .eq(1)
      .should("exist")
      .should("have.css", "color", Colors.REDCOLOR)
      .invoke("text")
      .then((error) => {
        expect(error).to.be.eq(this.errorMsg.fieldisReuqired);
      });
    const maxDayInNextMonth = dateTime.getDaysinMonth(2);
    now.getDate(), maxDayInCurrentMonth;

    const randomEndDate = dateTime.getRandomDate(
      now.getDate(),
      maxDayInNextMonth
    );
    unitsPage.getdatePickerDay(randomEndDate, 1).click();
    unitsPage.popUpPeriodTextArea.should(
      "not.have.css",
      "border-color",
      Colors.REDCOLOR
    );

    unitsPage.fileChooserInput.selectFile(validImage, { force: true });

    unitsPage.selectedFilesList
      .should("be.visible")
      .should("have.text", "uploadImage.jpg");
    unitsPage.bucketIcon.should("be.visible");
    unitsPage.orderPopUpLabel
      .eq(2)
      .should("be.visible")
      .invoke("text")
      .should("match", /^Коментар.*\*$/);
    unitsPage.popUpTextArea.should("be.visible");
    unitsPage.popUpTextArea
      .invoke("attr", "placeholder")
      .then((placeholder) => {
        expect(placeholder).to.be.eq(this.generalMsg.addCommentForProposal);
      });
    const randomString = randomValue.generateStringWithLength(50);
    unitsPage.popUpTextArea.type(randomString);
    unitsPage.popUpTextArea.should("have.text", randomString);
    unitsPage.submitOrder.click();

    unitsPage.submitOrder.should("be.enabled").and("be.visible");
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError
      .eq(1)
      .should("exist")
      .should("have.css", "color", Colors.REDCOLOR)
      .invoke("text")
      .then((error) => {
        expect(error).to.be.eq(this.errorMsg.orderAlreadyExists);
      });
    unitsPage.popUpPeriodTextArea.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
  });

  it("TC-1002 Verify upload image field when order by ad", function () {
    unitsPage.orderBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError
      .eq(2)
      .should("have.css", "border-color", Colors.REDCOLOR)
      .invoke("text")
      .then((error) => {
        expect(error).to.be.eq(this.errorMsg.fileSelectionRequired);
      });
    unitsPage.fileChooserWrapper.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
    unitsPage.fileChooserInput.selectFile(invalidFileFormat, { force: true });
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.popUpError.should(
      "have.text",
      this.errorMsg.invalidFileFormatOrSize
    );
    unitsPage.understoodBtn.click();
    unitsPage.popUpError.should("not.exist");
    unitsPage.fileChooserWrapper.should(
      "have.css",
      "border-color",
      Colors.REDCOLOR
    );
    unitsPage.fileChooserInput.selectFile(invalidFileSize, { force: true });
    unitsPage.popUpError.should(
      "have.text",
      this.errorMsg.invalidFileFormatOrSize
    );
    unitsPage.understoodBtn.click();
    unitsPage.popUpError.should("not.exist");
    unitsPage.fileChooserInput.selectFile(createTenderDuplicatedImage, {
      force: true,
    });

    unitsPage.popUpError.invoke("text").then((text) => {
      expect(text.trim()).to.be.eq(this.errorMsg.duplicateFileUpload);
    });
    unitsPage.popupCloseIcon.eq(1).click();
    unitsPage.popUpError.should("not.exist");
    unitsPage.bucketIcon.click();
    unitsPage.selectedFilesList.should("not.exist");
    unitsPage.fileChooserInput.selectFile(sixImagesJpgFormat, { force: true });

    unitsPage.popUpError.invoke("text").then((error) => {
      expect(error.trim()).to.be.eq(this.errorMsg.fileUploadLimit);
    });
    unitsPage.popUpWrapper.first().click("left");
    unitsPage.popUpError.should("not.exist");
    unitsPage.selectedFilesList.should("have.length", 5);
    unitsPage.bucketIcon.each((el) => {
      cy.wrap(el).click();
    });
    unitsPage.selectedFilesList.should("not.exist");
  });

  it("TC-1003 Verify comment field when order by ad", function () {
    unitsPage.orderBtn.click();
    unitsPage.popUpWrapper.should("be.visible");
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError
      .eq(3)
      .invoke("text")
      .then((error) => {
        expect(error).to.be.eq(this.errorMsg.fieldisReuqired);
      });
    unitsPage.popUpTextArea.should("have.css", "border-color", Colors.REDCOLOR);
    unitsPage.popUpTextArea.type(randomValue.generateStringWithLength(30));
    unitsPage.orderPopUpError
      .eq(3)
      .find("div")
      .invoke("text")
      .then((error) => {
        expect(error.trim()).to.be.eq(this.errorMsg.descriptionMinLengthError);
      });
    unitsPage.popUpTextArea.clear();
    unitsPage.popUpTextArea.should("be.empty");
    const randomString = randomValue.generateStringWithLength(2001);
    unitsPage.popUpTextArea.type(randomString);
    unitsPage.submitOrder.click();
    unitsPage.orderPopUpError
      .eq(3)
      .find("div")
      .invoke("text")
      .then((error) => {
        expect(error.trim()).to.be.eq(this.errorMsg.descriptionMaxLengthError);
      });
    unitsPage.popUpTextArea.clear();
    unitsPage.popUpTextArea.should("be.empty");
    unitsPage.popUpTextArea.type(this.generalMsg.invalidSymbols);
    unitsPage.popUpTextArea.should("be.empty");
  });
});