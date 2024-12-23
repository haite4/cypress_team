class LoginPage {
  get loginPasswordInput() {
    return cy.get("#password");
  }

  get loginEmailInput() {
    return cy.get("#email");
  }

  get submitBtn() {
    return cy
      .get('button[class*="ItemButtons_darkBlueRoundBtn"]')
      .contains("Увійти");
  }
  
  get announcementsButton() {
    return cy.get('[class*="Navbar_navigation"]').find('[href="/products/"]');
  }

  get headerAuthBtn() {
    return cy.get('[class*="NavbarAuthBlock_buttonEnter"]');
  }

  get userIcon() {
    return cy.get(`[data-testid="avatarBlock"]`);
  }
  get profileDropdownMenuContainer() {
    return cy.get('[class*="ProfileDropdownMenu_container"]');
  }

  get tendersDropdownButton() {
    return this.profileDropdownMenuContainer.find('[data-testid="tenders"]');
  }

  get profileDropdownEmail() {
    return cy.get('[class*="ProfileDropdownMenu_email"]');
  }

  get logoutBtn(){
    return cy.get('[data-testid="logout"]')
  }

  login(email: string, password: string) {
    this.loginEmailInput.type(email);
    this.loginPasswordInput.type(password);
    this.submitBtn.click();
  }
}

export default new LoginPage();
