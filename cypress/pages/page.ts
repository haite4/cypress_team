<<<<<<< HEAD
class Page{
    get announcementLink(){
        return cy.get('[class*="Navbar_link"]').contains("Оголошення")
    }

    get tendersButton() {
        return cy.get('[class*="Navbar_link"]').contains("Тендери");
    }
}



=======
class Page {
    get tendersButton() {
        return cy.get('[class*="Navbar_link"]').contains("Тендери");
    }
}

>>>>>>> main
export default new Page();