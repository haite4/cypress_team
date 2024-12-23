class Page{
    get announcementLink(){
        return cy.get('[class*="Navbar_link"]').contains("Оголошення")
    }

    get tendersButton() {
        return cy.get('[class*="Navbar_link"]').contains("Тендери");
    }

    get announcementLink(){
        return cy.get('[class*="Navbar_link"]').contains("Оголошення")
    }
}



export default new Page();