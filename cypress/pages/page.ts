class Page {
    get tendersButton() {
        return cy.get('[class*="Navbar_link"]').contains("Тендери");
    }
}

export default new Page();