class TenderDetailsPage {
    get title() {
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
        return cy.get('[data-testid="paragraphWithIcon"]').find('[class*="ParagraphWithIcon_paragraph"]').first();
    }

    get proposeCount() {
        return cy.get('[data-testid="paragraphWithIcon"]').find('[class*="ParagraphWithIcon_paragraph"]').eq(1);
    }

    get dateOfWork() {
        return cy.get('[data-testid="paragraphWithIcon"]').find('[class*="ParagraphWithIcon_paragraph"]').eq(2);
    }

    get placeOfWork() {
        return cy.get('[data-testid="paragraphWithIcon"]').find('[class*="ParagraphWithIcon_paragraph"]').eq(3);
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

    get documentPopupCloseButton() {
        return this.documentPopup.find('[data-testid="closeButton"]');
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
}

export default new TenderDetailsPage();