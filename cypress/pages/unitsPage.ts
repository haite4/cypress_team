import crmApi from "cypress/api/crmApi";
import unitApi from "../api/unitApi";

class UnitsPage {
  get chosenAnnouncmentsButton() {
    return cy.get('[data-testid="variant"]').contains("Обрані оголошення");
  }

  get paginationButtons() {
    return cy.get('[class*="Pagination_page"]');
  }

  get paginationNextButton() {
    return cy.get('[aria-label="Next page"]');
  }

  get paginationPreviousButton() {
    return cy.get('[aria-label="Previous page"]');
  }

  get categoriesDropdownList() {
    return cy.get('[data-testid="div_CustomSelect"]').first();
  }
  
  get unitsInDropDownMenu() {
    return cy.get(`[data-testid="units"]`);
  }

  get pendingAnnouncements() {
    return cy.get(".MuiButtonBase-root").contains("Очікуючі");
  }

  get pendingAnnouncementsName() {
    return cy.get('[class*="OwnerUnitCard_name"]').first();
  }

  get unitCard() {
    return cy.get('[data-testid="unitCard"]');
  }

  get editBtn() {
    return cy
      .get('[class*="ItemButtons_wrapper"] button')
      .contains("Редагувати");
  }

  get editAnnouncmentTitle() {
    return cy.get('[class*="CreateEditFlowLayout_title"]');
  }

  get preventBtn() {
    return cy.get('[data-testid="prevButton"]');
  }

  get nextBtn() {
    return cy.get('[data-testid="nextButton"]');
  }

  get successfullyEditedMsg() {
    return cy.get("[class*=SuccessfullyCreatedPage_finishTitle]");
  }

  get viewInMyAdsBtn() {
    return cy.get('[class*="SuccessfullyCreatedPage_buttonWrapper"] button');
  }

  get emptyBlockInfoTitle() {
    return cy.get('[class*="EmptyBlockInfo_title"]');
  }

  get emptyBlockButton() {
    return cy.get('[data-testid="emptyBlockButton"]');
  }

  get clearListButton() {
    return cy.get('[class*="OwnerFavouriteUnitsPage_removeList"]');
  }

  get popupHeader() {
    return cy.get('[class*="PopupLayout_label"]');
  }

  get popupYesButton() {
    return cy.contains("Так");
  }

  get popupCancelButton() {
    return cy.contains("Скасувати");
  }

  get popupCloseIcon() {
    return cy.get('[data-testid="closeIcon"]');
  }

  get unitCardTitleText() {
    return cy.get('[class*="OwnerUnitCard_name"]').invoke("text");
  }

  get announcementInput() {
    return cy.get(
      '[data-testid="custom-input"][placeholder="Введіть назву оголошення"]'
    );
  }

  get modelNameInput() {
    return cy.get(
      '[data-testid="custom-input"][placeholder="Введіть назву моделі"]'
    );
  }

  get announcemntTitleInput() {
    return cy.get('[data-testid="input"][placeholder="Заголовок оголошення"]');
  }

  get descriptionError() {
    return cy.get('[data-testid="descriptionError"]');
  }

  get closeVehicleBtn() {
    return cy.get('[data-testid="closeButton"]');
  }

  get vehicleManufacturerInput() {
    return cy.get('[data-testid="input-customSelectWithSearch"]');
  }

  get vehicleManufacturerError() {
    return cy.get('[class*="CustomSelectWithSearch_errorTextVisible"]');
  }

  get vehicleManufacturerNotFoundItem() {
    return cy.get('[data-testid="p2-notFound-addNewItem"]');
  }

  get vehicleManufacturerDropDownItem() {
    return cy.get('[class*="CustomSelectWithSearch_searchListItem"]');
  }

  get selectedVehicleManufacturer() {
    return cy.get('[data-testid="div-service-customSelectWithSearch"]');
  }

  get techSpecsTextArea() {
    return cy.get('[data-testid="textarea-customTextAriaDescription"]').eq(0);
  }

  get detailedDescriptionTextArea() {
    return cy.get('[data-testid="textarea-customTextAriaDescription"]').eq(1);
  }

  get expectingdUnit() {
    return cy.get("button").contains("Очікуючі");
  }

  get choseOnMapBtn() {
    return cy.get("button[class*=AddressSelectionBlock_locationBtn]");
  }

  get mapPopUpTitle() {
    return cy.get('[class*="MapPopup_title"]');
  }

  get mapPopUp() {
    return cy.get("#map");
  }

  get selectedAdress() {
    return cy.get('[data-testid="address"]');
  }

  get mapPopUpSubmitBtn() {
    return cy.get("button").contains("Підтвердити вибір");
  }

  get mapLabel() {
    return cy.get('[data-testid="mapLabel"]');
  }

  getUnitCardFavouriteButton(card: Cypress.Chainable) {
    return card.find('[data-testid="favourite"]');
  }

  getUnitCardCategory(card: Cypress.Chainable) {
    return card.find('[class*="OwnerUnitCard_category"]');
  }

  getPaginationPageByNumber(number: number) {
    return cy.get('[class*="Pagination_page"]').contains(number);
  }

  selectCategoryItemByName(name: string) {
    return cy.get('[data-testid="item-customSelect"]').contains(name);
  }

  createApprovedUnit() {
    return unitApi.createUnit().then((data) => {
      return unitApi.createUnitImages(data.id).then(() => {
        return crmApi.approveUnitCreation(data.id).then((approveData) => {
          expect(approveData.is_approved).to.be.true;
        });
      });
    });
  }

  getMapPopUpBoundingBox() {
    return this.mapPopUp.then(($el) => {
      const boundingBox = $el[0].getBoundingClientRect();
      if (boundingBox) {
        const { x, y, width, height } = boundingBox;
        const randomX = x + Math.random() * width;
        const randomY = y + Math.random() * height;
        return { x: randomX, y: randomY };
      }
      throw new Error("Bounding box not found");
    });
  }
}

export default new UnitsPage();
