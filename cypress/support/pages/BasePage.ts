export class BasePage {
    protected path: string;

    constructor(path: string = '/') {
        this.path = path;
    }

    visit() {
        cy.visit(this.path);
    }

    getTitle() {
        return cy.title();
    }

    getUrl() {
        return cy.url();
    }
}
