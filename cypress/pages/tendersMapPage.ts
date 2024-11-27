class TendersMapPage {
    get searchInput() {
        return cy.get('[data-testid="search"]');
    }

    get tenderCards() {
        return cy.get('[data-testid="tenderLink"]');
    }
}

export default new TendersMapPage();