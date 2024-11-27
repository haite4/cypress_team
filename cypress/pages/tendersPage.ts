import { tabNames } from "../constants/tenderTabNames";

class TendersPage {
    get tenderCards() {
        return cy.get('[class*="OwnerTenderCard_tenderCard"]');
    }

    get tabs() {
        return cy.get('[role="tablist"]').find('[role="tab"]');
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

    checkTabs(tabIndex: number) {
        this.tabs.each((element, index) => {
          expect(element).to.be.visible;
          expect(element).to.have.text(tabNames[index]);
    
          if (index === tabIndex) {
            expect(element).to.have.attr("aria-selected", "true");
          }
          else {
            expect(element).to.have.attr("aria-selected", "false");
          }
        });
    }
}

export default new TendersPage();