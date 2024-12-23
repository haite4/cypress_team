import unitApi from "../api/unitApi";
import loginPage from "../pages/loginPage";
import unitsPage from "../pages/unitsPage";

describe("Create and delete unit functionality", () => {
  let unitId: number;
  let unitName: string;

  beforeEach("Navigate to the login page", () => {
    cy.visit("/");
    loginPage.headerAuthBtn.click();
    loginPage.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it('Verify that unit displayed in "Очікуючі" tab', () => {
    unitApi.createUnit().then((data) => {
      unitId = data.id;
      unitName = data.name;
      loginPage.userIcon.click();
      unitsPage.unitsInDropDownMenu.click();
      unitsPage.pendingAnnouncements.click();
      unitsPage.unitName.first().should("have.text", unitName);
    });
  });

  it("Verify that unit images uploaded", () => {
    unitApi.createUnitImages(unitId).then((status) => {
      expect(status).to.eq(201);
    });
  });

  it('Verify that unit removed from "Очікуючі" tab', () => {
    loginPage.userIcon.click();
    unitsPage.unitsInDropDownMenu.click();
    unitsPage.pendingAnnouncements.click();
    unitApi.deleteUnit(unitId).then((status) => {
      cy.reload();
      unitsPage.emptyBlockInfoTitle.should("be.visible");
      expect(status).to.eq(204);
    });
  });
});
