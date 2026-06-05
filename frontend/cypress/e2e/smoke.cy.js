
describe('Smoke test - connexion', () => {

    it('affiche les éléments de connexion', () => {

        cy.visit('http://localhost:4200/#/login')

        cy.get('[data-cy="login-input-username"]')
            .should('be.visible')

        cy.get('[data-cy="login-input-password"]')
            .should('be.visible')

        cy.get('[data-cy="login-submit"]')
            .should('be.visible')

    })
})


describe('Smoke test - panier', () => {

    it('Vérifie le bouton ajouter au panier après connexion', () => {

        cy.visit('http://localhost:4200/#/login')

        cy.get('[data-cy="login-input-username"]')
            .should('be.visible')
            .type('test2@test.fr')

        cy.get('[data-cy="login-input-password"]')
            .should('be.visible')
            .type('testtest')

        cy.get('[data-cy="login-submit"]')
            .should('be.visible')
            .click()

        cy.contains('Voir les produits')
            .should('be.visible')
            .click()

        cy.contains('Consulter')
            .first()
            .should('be.visible')
            .click()

        cy.contains('Ajouter au panier')
            .should('be.visible')

    })

})