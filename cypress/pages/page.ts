class Page{
    get announcementLink(){
        return cy.get('[class*="Navbar_link__UhyJF"]').contains("Оголошення")
    }
}



export default new Page();