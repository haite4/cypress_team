class TendersPage {
    get tenderCards() {
        return cy.get('[class*="OwnerTenderCard_tenderCard"]');
    }

    get activeTab() {
        return cy.contains("Активні");
    }

    get closedTab() {
        return cy.contains("Завершені");
    }

    get pendingTab() {
        return cy.contains("Очікуючі");
    }

    get rejectedTab() {
        return cy.contains("Відхилені");
    }

    get tenderInput() {
        return cy.get('[data-testid="input"]');
    }

    get categoryDropdownList() {
        return cy.get('[data-testid="div_CustomSelect"]').first();
    }

    get sortDropdownList() {
        return cy.get('[data-testid="div_CustomSelect"]').last();
    }

    getTenderName(tender: Cypress.Chainable) {
        return tender.find('[class*="CurrentItemInfo_name"]');
    }

    getTenderCategoty(tender: Cypress.Chainable) {
        return tender.find('[class*="CurrentItemInfo_category"]');
    }

    getTenderDate(tender: Cypress.Chainable) {
        return tender.find('[data-testid="paragraphWithIcon"] [class*="ParagraphWithIcon_paragraph"]').first();
    }

    getTenderAddress(tender: Cypress.Chainable) {
        return tender.find('[data-testid="paragraphWithIcon"] [class*="ParagraphWithIcon_paragraph"]').eq(1);
    }

    getTenderPrice(tender: Cypress.Chainable) {
        return tender.find('[class*="CurrentItemPrice_price"]');
    }

    getTenderStatus(tender: Cypress.Chainable) {
        return tender.find('[class*="CurrentTenderStatus_proposes"]');
    }

    getTenderEditButton(tender: Cypress.Chainable) {
        return tender.contains("Редагувати");
    }

    getTenderCloseButton(tender: Cypress.Chainable) {
        return tender.contains("Завершити");
    }

    getTenderDeleteButton(tender: Cypress.Chainable) {
        return tender.contains("Видалити");
    }

    selectListItemByName(name: string) {
        return cy.get('[data-testid="item-customSelect"]').contains(name);
    }
}

export default new TendersPage();