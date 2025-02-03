import {
  createTenderFilesList,
  createTenderDuplicatedImage,
  invalidFileFormat,
  invalidFileSize,
  validImage,
} from "cypress/constants/fileData";
import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";
import { UrlPath } from "cypress/constants/enumUrlPaths";

describe("Verify create tender functionality", () => {
  beforeEach("Navigate to the create tender page", () => {
    cy.visit(`${Cypress.env("BASE_URL")}${UrlPath.CREATE_TENDER_UNIT}`);
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    unitsPage.createTenderDocumentationTab.click();
    cy.fixture("textSymbols/generalMsg").as("generalMsg");
    cy.fixture("textSymbols/errorMsg").as("errorMsg");
  });

  it.skip("TC-786 - Verify documents uploading", function () {
    unitsPage.tenderDocumentChoosingHeader.eq(0).should("be.visible");
    unitsPage.tenderDocumentChoosingHeader
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).to.be.match(/^Перелік документів.\*$/);
      });
    unitsPage.documentChoosingText1.should(
      "have.text",
      this.generalMsg.fileUploadInstructions
    );
    unitsPage.documentChoosingText2.should(
      "have.text",
      this.generalMsg.createTenderUploadInfo
    );
    unitsPage.documentChoosingText1.click();

    for (const file of createTenderFilesList) {
      unitsPage.createTenderDocumentFileChoosingInput.selectFile(file, {
        force: true,
      });
      unitsPage.createTenderDocumentSelectedFileWrapper.should("be.visible");
      unitsPage.deleteFileRedBucketIcon.click();
    }
  });

  it("TC-787 Verify same docs uploading", function () {
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(
      createTenderDuplicatedImage,
      { force: true }
    );
    unitsPage.popUpError.invoke("text").then((text) => {
      expect(text.trim()).to.be.eq(this.errorMsg.duplicateFileUpload);
    });
  });

  it("788 Verify uploading of invalid file type", function () {
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(
      invalidFileFormat,
      { force: true }
    );
    unitsPage.popUpError.invoke("text").then((text) => {
      expect(text.trim()).to.be.eq(
        this.errorMsg.invalidFileFormatOrSizeCreateTender
      );
    });
  });

  it("TC-789 Verify uploading of invalid size file", function () {
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(
      invalidFileSize,
      { force: true }
    );
    unitsPage.popUpError.invoke("text").then((text) => {
      expect(text.trim()).to.be.eq(
        this.errorMsg.invalidFileFormatOrSizeCreateTender
      );
    });
  });

  it("TC-790 Verify docs deleting", function () {
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(validImage, {
      force: true,
    });
    unitsPage.createTenderDocumentSelectedFileWrapper.should("be.visible");
    unitsPage.deleteFileRedBucketIcon.click();
    unitsPage.createTenderDocumentSelectedFileWrapper.should("not.exist");
  });

  it("TC-791 Verify 'Назад' button", function () {
    unitsPage.backBtn.click();
    unitsPage.navigationTabs.each((tabs, index) => {
      if (index === 0) {
        expect(tabs).to.have.attr("aria-selected", "true");
      } else {
        expect(tabs).to.have.attr("aria-selected", "false");
      }
    });
  });

  it("TC-792 Verify 'Далі' button", function () {
    unitsPage.nextBtn.click();
    unitsPage.documentChoosingError.should(
      "have.text",
      this.errorMsg.missingFilesError
    );
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(validImage, {
      force: true,
    });
    unitsPage.nextBtn.click();
    unitsPage.navigationTabs.each((tabs, index) => {
      if (index === 2) {
        expect(tabs).to.have.attr("aria-selected", "true");
      } else {
        expect(tabs).to.have.attr("aria-selected", "false");
      }
    });
  });

  it("TC-827 Verify uploading more then allowed number of docs", function () {
    unitsPage.createTenderDocumentFileChoosingInput.selectFile(
      createTenderFilesList,
      { force: true }
    );
    unitsPage.popUpError.invoke("text").then((text) => {
      expect(text).to.be.eq(this.errorMsg.createTenderFileUploadLimit);
    });
    unitsPage.understoodBtn.click();
    unitsPage.createTenderSelectedFile.should("have.length", 5);
  });
});
