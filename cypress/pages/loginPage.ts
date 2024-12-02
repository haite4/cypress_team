class LoginPage {
  get loginPasswordInput() {
    return cy.get("#password");
  }

  get loginEmailInput() {
    return cy.get("#email");
  }

  get submitProposalBtn() {
    return cy
      .get('button[type="submit"]')
      .contains("Увійти");
  }

  get headerAuthBtn() {
    return cy.get('[class*="NavbarAuthBlock_buttonEnter"]');
  }

  get userIcon() {
    return cy.get(`[data-testid="avatarBlock"]`);
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
    this.submitProposalBtn.click();
  }
}

export default new LoginPage();
