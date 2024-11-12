class ProductsPage {
    get cardWrappers() {
        return cy.get('[data-testid="cardWrapper"]');
    }

    getCardName(card: Cypress.Chainable) {
        return card.find('[data-testid="unitName"]');
    }

    getCardFavouriteButton(card: Cypress.Chainable) {
        return card.find('[data-testid="favourite"]');
    }

    getFavouriteButtonsPath(card: Cypress.Chainable) {
        return this.getCardFavouriteButton(card).find('path[stroke]');
    }
}

export default new ProductsPage();