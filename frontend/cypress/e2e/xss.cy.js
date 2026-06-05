
describe('TEST XSS - commentaire', () => {

    it(' ne doit pas exécuter du JavaScript injecté', () => {
        cy.visit('http://localhost:4200/#/')

        cy.get('[data-cy="nav-link-login"]')
            .click()

        cy.get('[data-cy="login-form"]')
            .should('be.visible')

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


        cy.visit('http://localhost:4200/#/reviews')




        cy.contains('Votre avis')
            .should('be.visible')

        cy.get('[data-cy="review-input-title"]')
            .should('be.visible')

        cy.get('[data-cy="review-input-comment"]')
            .should('be.visible')
            .type('<script>alert("XSS")</script>')


        cy.on('window:alert', () => {
            throw new Error('faille XSS détectée')
        })
        cy.get('[data-cy="review-submit"]')
            .click()



    })
})