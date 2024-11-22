class MainPage {
  get serviceCost() {
    return cy.get(`[class*=Terms_service_cost]`);
  }

  get navAnnouncementBtn() {
    return cy.get(`[class*=Navbar_link]`).contains("Оголошення");
  }

  get firstUnit() {
    return cy.get(`[class*=UnitCard_container]`).first();
  }

  get firstUnitPrice() {
    return cy.get(`[class*=UnitCard_priceAmount]`).first();
  }
}

export default new MainPage();
