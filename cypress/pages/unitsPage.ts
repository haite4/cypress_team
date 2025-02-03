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

  get sortingDropdownList() {
    return cy.get('[data-testid="div_CustomSelect"]').last();
  }

  get unitsInDropDownMenu() {
    return cy.get(`[data-testid="units"]`);
  }

  get pendingTab() {
    return cy.get(".MuiButtonBase-root").contains("Очікуючі");
  }

  get unitName() {
    return cy.get('[class*="OwnerUnitCard_name"]');
  }

  get unitCard() {
    return cy.get('[data-testid="unitCard"]');
  }

  get editTenderBtn() {
    return cy
      .get('[class*=CurrentTenderButtons_fillBtn]')
  }

  get editAdsBtn(){
    return cy.get(`button`).contains("Редагувати")
  }

  get editUnitTenderName() {
    return cy.get('[class*="CreateEditFlowLayout_tenderName"]');
  }

  get preventBtn() {
    return cy.get('[data-testid="prevButton"]');
  }

    get editAnnouncmentTitle() {
    return cy.get('[class*="CreateEditFlowLayout_title"]');
  }

  get nextBtn() {
    return cy.get('[data-testid="nextButton"]');
  }

  get successfullyEditTenderMsg() {
    return cy.get("[class*=SuccessfullyCreatedPage_finishtenderName]");
  }

  get successfullyEditedMsg() {
    return cy.get("[class*=SuccessfullyCreatedPage_finishTitle]");
  }

  get viewInMyList() {
    return cy.get('[class*="SuccessfullyCreatedPage_buttonWrapper"] button');
  }

  get emptyBlockInfotenderName() {
    return cy.get('[class*="EmptyBlockInfo_title"]');
  }

  get emptyBlockTitle(){
    return cy.get(`[class*="EmptyBlockInfo_title"]`)
  }

  get emptyBlockButton() {
    return cy.get('[data-testid="emptyBlockButton"]');
  }

  get emptyBlockInfoTitle() {
    return cy.get('[class*="EmptyBlockInfo_title"]');
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

  get unitCardNameText() {
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

  get announcementNameInput() {
    return cy.get('[data-testid="input"][placeholder="Заголовок оголошення"]');
  }

  get descriptionError() {
    return cy.get('[data-testid="descriptionError"]');
  }

  get proposesUnitTitle(){
    return cy.get('[class*="ProposesToOwnerUnit_title"]')
  }

  get proposalDetaiedTitle(){
    return cy.get('[class*="OrderDetails_title"] span')
  }

  get closeBtn() {
    return cy.get('[data-testid="closeButton"]');
  }

  get servicesInput() {
    return cy.get('[data-testid="input-customSelectWithSearch"]');
  }

  get serviceError() {
    return cy.get('[class*="CustomSelectWithSearch_errorTextVisible"]');
  }

  get vehicleManufacturerNotFoundItem() {
    return cy.get('[data-testid="p2-notFound-addNewItem"]');
  }

  get servicesDropDownItem() {
    return cy.get('[class*="CustomSelectWithSearch_searchListItem"]');
  }

  get selectedServices() {
    return cy.get('[data-testid="div-service-customSelectWithSearch"]');
  }

  get techSpecsTextArea() {
    return cy.get('[data-testid="textarea-customTextAriaDescription"]').eq(0);
  }

  get mapPopUpTitle() {
    return cy.get('[class*="MapPopup_title"]');
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

  get mapPopUptenderName() {
    return cy.get('[class*="MapPopup_tenderName"]');
  }

  get mapPopUp() {
    return cy.get("#map");
  }

  get selectedAdress() {
    return cy.get('[data-testid="address"]');
  }

  get mapPopUpsubmitProposalBtn() {
    return cy.get("button").contains("Підтвердити вибір");
  }

  get deactivateBtn() {
    return cy.get("button").contains("Деактивувати");
  }

  get popUpWrapper() {
    return cy.get('[data-testid="wrapper"]');
  }

  get mapLabel() {
    return cy.get('[data-testid="mapLabel"]');
  }

  get orderPopUpLabel() {
    return cy.get('[class*="OrderPopup_label"]');
  }

  get popUpPeriodArea() {
    return cy.get('[class*="OrderPopup_periodArea"]');
  }

  get popUpPeriodTextArea() {
    return cy.get('[class*="OrderPopup_periodArea"] textarea');
  }

  get popUpDateTimePicker() {
    return cy.get('[class*="OrderPopup_datePickerBlock"]');
  }

  get confirmationPopUpInfo() {
    return cy.get('[class*="ConfirmOrderPopup_info"]');
  }

  get cancelOrderPopUpDescription() {
    return cy.get('[class*="CancelOrderPopup_description"]');
  }

  get cancelOrderPopUpInput() {
    return cy.get('[class*="CancelOrderPopup_myReasonInput"]');
  }

  get cancelPopUpReason() {
    return cy.get('[class*="CancelOrderPopup_reason"]');
  }

  get tenderCard() {
    return cy.get('[class*="OwnerTenderCard_tenderCard"]');
  }

  get dateTimePicker() {
    return cy.get('[class*="react-datepicker-wrapper"] input');
  }

  get budgetInput() {
    return cy.get(
      '[data-testid="custom-input"][placeholder="Наприклад, 10 000"]'
    );
  }

  get textAreaInput() {
    return cy.get('[data-testid="textAreaInput"]');
  }

  get textAreaError() {
    return cy.get('[data-testid*="textAreaError"]');
  }

 get tenderCloseButton() {
    return cy.get(`[class*="CurrentTenderButtons_redBtn"]`)
  }

  getTenderName(tender: Cypress.Chainable) {
    return tender.find('[class*="CurrentItemInfo_name"]');
  }

  getTenderCategoty(tender: Cypress.Chainable) {
    return tender.find('[class*="CurrentItemInfo_category"]');
  }

  getdatePickerDay(day: number, numberOfElement: number) {
    return cy
      .get('[class*="month-container"]')
      .eq(numberOfElement)
      .find('[class*="day"][aria-disabled=false]')
      .contains(day);
  }

  getUnitCardFavouriteButton(card: Cypress.Chainable) {
    return card.find('[data-testid="favourite"]');
  }

  getUnitCardName(card: Cypress.Chainable) {
    return card.find('[class*="OwnerUnitCard_name"]');
  }

  getUnitCardCreationDate(card: Cypress.Chainable) {
    return card.find('[class*="OwnerUnitCard_dateWithDot"] div').last();
  }

  getUnitCardCategory(card: Cypress.Chainable) {
    return card.find('[class*="OwnerUnitCard_category"]');
  }

  getPaginationPageByNumber(number: number) {
    return cy.get('[class*="Pagination_page"]').contains(number);
  }

  selectListItemByName(name: string) {
    return cy.get('[data-testid="item-customSelect"]').contains(name);
  }

  get popUpCloseIcon() {
    return cy.get('[data-testid="closeIcon"]');
  }

  get popUpCancelBtn() {
    return cy.get(`[data-testid="wrapper"] button[class*=ItemButtons_lightRedBtn]`);
  }

  get popUpAgreementBtn() {
    return cy.get("button").contains("Так");
  }

  get notificationPopUpDescription() {
    return cy.get('[class*="NotificationLikePopup_description"]');
  }

  get notificationPopUpCrossIcon() {
    return cy.get('[data-testid="notificationClose"]');
  }

  get deactivatedTab() {
    return cy.get(".MuiButtonBase-root").contains("Деактивовані");
  }

  get activeTab() {
    return cy.get(".MuiButtonBase-root").contains("Активні");
  }

  get activateBtn() {
    return cy.get("button").contains("Активувати");
  }

  get deleteBtn() {
    return cy.get("button").contains("Видалити");
  }

  get rejectedTabs() {
    return cy.get("button").contains("Відхилені");
  }

  get orderBtn() {
    return cy.get('[class*="ImageWithDescription_orderBtn"]');
  }

  get filesChoosingInstruction() {
    return cy.get('[class*="FilesChoosing_instruction"]');
  }

  get fileChoosingInfo() {
    return cy.get('[class*="FilesChoosing_info"]');
  }

  get fileChooserInput() {
    return cy.get('[class*="FilesChoosing_wrapper"] input');
  }

  get selectedFilesList() {
    return cy.get('[class*="FileList_card"]');
  }

  get bucketIcon() {
    return cy.get('[data-testid="bucketIcon"]');
  }

  get popUpTextArea() {
    return cy.get('[class*="OrderPopup_description"] textarea');
  }

  get submitOrder() {
    return cy.get("button").contains("Відправити заявку");
  }

  get orderPopUpError() {
    return cy.get('[class*="OrderPopup_error"]');
  }

  get fileChooserWrapper() {
    return cy.get('[class*="FilesChoosing_wrapper"]');
  }

  get popUpError() {
    return cy.get('[data-testid="errorPopup"]');
  }

  get understoodBtn() {
    return cy.get("button").contains("Зрозуміло");
  }

  get proposalBtn() {
    return cy.get('[class*="ItemButtons_darkBlueBtn"]').contains("Пропозиції");
  }

  get proposesUnittenderName() {
    return cy.get('[class*="ProposesToOwnerUnit_tenderName"]');
  }

  get submitProposalBtn() {
    return cy.get("button").contains("Підтвердити");
  }

  get proposalOrderUnit() {
    return cy.get('[class*="ProposeOrderCard_wrapper"]');
  }

  get orderLabelStatus() {
    return cy.get('[class*="LabelStatusOrder_label"]');
  }

  get rejectProposalBtn() {
    return cy.get("button").contains("Відхилити");
  }

  get backBtn() {
    return cy.get("button").contains("Назад");
  }

  get leftArrow() {
    return cy.get('[data-testid="leftArrow"]');
  }

  get proposalDetailedBtn() {
    return cy.get("button").contains("Деталі пропозиції");
  }

  get proposalDetaiedtenderName() {
    return cy.get('[class*="OrderDetails_tenderName"]');
  }

  get orderDetailsLabel() {
    return cy.get('[class*="OrderDetails_label"]');
  }

  get cancelOrderPopUpError() {
    return cy.get('[class*="CancelOrderPopup_error"]');
  }

  get createTenderDocumentationTab() {
    return cy.get("button").contains("Документація");
  }

  get tenderDocumentChoosingHeader() {
    return cy.get('[class*="DocumentsChoosing_header"]');
  }

  get documentChoosingText1() {
    return cy.get('[class*="DocumentsChoosing_text1"]');
  }

  get documentChoosingText2() {
    return cy.get('[class*="DocumentsChoosing_text2"]');
  }

  get createTenderDocumentFileChoosingInput() {
    return cy.get('[class*="DocumentsChoosing_inputWrapper"] input');
  }

  get createTenderDocumentSelectedFileWrapper() {
    return cy.get('[class*="DocumentsChoosing_documentsWrapper"]');
  }

  get deleteFileRedBucketIcon() {
    return cy.get('[data-testid="deleteFile"]');
  }

  get navigationTabs() {
    return cy.get('[class*="MuiTabs-flexContainer"] button');
  }

  get documentChoosingError() {
    return cy.get('[class*="DocumentsChoosing_errorTextVisible"]');
  }

  get createTenderSelectedFile() {
    return cy.get('[class*="DocumentsChoosing_flex"]');
  }

  get tenderInput() {
    return cy.get('input[placeholder="Введіть назву тендера"]');
  }

  get headerTenderInput(){
    return cy.get('input[placeholder="Заголовок тендера"]')
  }

  get jobContactPersonInput() {
    return cy.get('[data-testid="operatorCheckbox"]');
  }

  get jobContactPersonInfotenderName() {
    return cy.get('[class*="CustomValidInput_title"]');
  }

  get jobContactPersonInfoPhonetenderName() {
    return cy.get('[class*="OperatorForm_title"]');
  }

  get jobContactPersonInfoError() {
    return cy.get('[data-testid="errorDescr"]');
  }

  get jobContactPersonInfoPhoneError() {
    return cy.get('[class*="OperatorForm_errorMessage"]');
  }

  get jobContactInput() {
    return cy.get('[class*="OperatorForm_wrapperName"] input');
  }

  get phoneNumberInput() {
    return cy.get('[data-testid="phone"]');
  }

  get tenderName() {
    return cy.get('span[class*="TenderName_name"]');
  }

  get proposeDate() {
    return cy.get('[class*="TenderMainInfo_proposition_duration"]');
  }

  get budget() {
    return cy.get('[class*="Additional_budget"]');
  }

  get proposeButton() {
    return cy.contains("Подати пропозицію");
  }

  get organizerName() {
    return cy
      .get('[data-testid="paragraphWithIcon"]')
      .find('[class*="ParagraphWithIcon_paragraph"]')
      .first();
  }

  get proposeCount() {
    return cy
      .get('[data-testid="paragraphWithIcon"]')
      .find('[class*="ParagraphWithIcon_paragraph"]')
      .eq(1);
  }

  get dateOfWork() {
    return cy
      .get('[data-testid="paragraphWithIcon"]')
      .find('[class*="ParagraphWithIcon_paragraph"]')
      .eq(2);
  }

  get placeOfWork() {
    return cy
      .get('[data-testid="paragraphWithIcon"]')
      .find('[class*="ParagraphWithIcon_paragraph"]')
      .eq(3);
  }

  get services() {
    return cy.get('[class*="CurrentItemServices_service__"]');
  }

  get description() {
    return cy.get('[class*="CurrentItemDescription_description__"]');
  }

  get otherTenders() {
    return cy.get('[data-testid="goTenderButton"]');
  }

  get documents() {
    return cy.get('[class*="CurrentTenderDocuments_item__"]');
  }

  get documentPopup() {
    return cy.get('[class*="DocumentsPopup_container"]');
  }

  get searchInput() {
    return cy.get('[data-testid="search"]');
  }

  get tenderCards() {
    return cy.get('[data-testid="tenderLink"]');
  }

  get closedTab() {
    return cy.contains("Завершені");
  }

  getTenderDate(tender: Cypress.Chainable) {
    return tender
      .find(
        '[data-testid="paragraphWithIcon"] [class*="ParagraphWithIcon_paragraph"]'
      )
      .first();
  }

  getTenderAddress(tender: Cypress.Chainable) {
    return tender
      .find(
        '[data-testid="paragraphWithIcon"] [class*="ParagraphWithIcon_paragraph"]'
      )
      .eq(1);
  }

  getTenderPrice(tender: Cypress.Chainable) {
    return tender.find('[class*="CurrentItemPrice_price"]');
  }

  getTenderStatus(tender: Cypress.Chainable) {
    return tender.find('[class*="CurrentTenderStatus_proposes"]');
  }

  getDocumentName(document: Cypress.Chainable) {
    return document.find('[class*="CurrentTenderDocuments_item_name__"]');
  }

  getDocumentViewButton(document: Cypress.Chainable) {
    return document.find('[data-testid="oko"]');
  }

  getDocumentDownloadButton(document: Cypress.Chainable) {
    return document.find('[class*="CurrentTenderDocuments_download"]');
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

  createUnitWithoutApprove() {
    return unitApi.createUnit().then((data) => {
      return unitApi.createUnitImages(data.id);
    });
  }

  createRejectedUnit() {
    return unitApi.createUnit().then((data) => {
      return unitApi.createUnitImages(data.id).then(() => {
        return crmApi.rejectUnitCreation(data.id).then((rejectedData) => {
          expect(rejectedData.is_approved).to.be.false;
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
