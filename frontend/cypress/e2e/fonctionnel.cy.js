
describe(' TEST FONCTIONNEL -connexion', () => {

    it('lutilisateur doit pouvoir accéder à son compte', () => {

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

        cy.contains('Mon panier')
            .should('be.visible')
    })

})


describe('TEST FONCTIONNEL -panier', () => {

    let token

    before(() => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/login',
            body: {
                "username": "test2@test.fr",
                "password": "testtest"
            }

        })

            .then((response) => {
                expect(response.body).to.have.property("token")
                token = response.body.token
            })
    })


    it('Ne doit pas ajouter un produit ayant un stock inférieur à 1', () => {



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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')
        cy.contains('Sentiments printaniers')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(0)
            .click()
        cy.get('[data-cy="detail-product-add"]')
            .should('be.visible')
            .click()

        cy.url()
            .should('include', '/products/3')

        cy.contains('[data-cy="cart-empty"]')
            .should('be.visible')


    })


    it('doit pouvoir ajouter un produit au panier', () => {



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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')


        cy.contains('Poussière de lune')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(2)
            .should('be.visible')
            .click()

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type('1')

        cy.get('[data-cy="detail-product-add"]')
            .should('be.visible')
            .click()


        cy.contains('Commande')
            .should('be.visible')


        cy.contains('Poussière de lune')
            .should('be.visible')
    })

    it('le stock doit décrémenter le nombre de produits qui sont dans le panier', () => {



        let stockAvant
        const quantiteAjoutee = 1

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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')

        cy.contains('Poussière de lune')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(2)
            .should('be.visible')
            .click()


        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type('1')

        cy.get('[data-cy="detail-product-stock"]')
            .then((stock) => {
                const texte = stock[0].textContent



                stockAvant = Number(texte.replace(/\D/g, ''))
                console.log('TEXTE STOCK = ', stockAvant)


            })
        cy.get('[data-cy="detail-product-add"]')
            .click()

        cy.visit('http://localhost:4200/#/products/5')
        cy.get('[data-cy="detail-product-stock"]')

            .then((stockAfter) => {
                const texte2 = stockAfter[0].textContent

                const stockApres = Number(texte2.replace(/\D/g, ''))
                cy.log('TEXTE STOCK = ', stockApres)
                expect(stockApres).to.be.equal(stockAvant - 1)


            })





    })


    it('doit refuser une quantité négative', () => {
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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')


        cy.contains('Poussière de lune')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(2)
            .should('be.visible')
            .click()





        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type('-1')
        cy.get('[data-cy="detail-product-add"]')
            .click()
        cy.contains('Panier')
            .should('not.exist')
    })

    it('doit vérifier la quantité maximale autorisée dans le panier', () => {
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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')


        cy.contains('Poussière de lune')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(2)
            .should('be.visible')
            .click()


        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type('21')
        cy.get('[data-cy="detail-product-add')
            .click()
        cy.contains('Panier')
            .should('be.not.visible')
    })



    it('doit vérifier lajout de lélément au panier', () => {



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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')


        cy.contains('Extrait de nature')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(4)
            .should('be.visible')
            .click()

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type('1')

        cy.get('[data-cy="detail-product-add"]')
            .should('be.visible')
            .click()






        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders ',
            headers: {
                "Authorization": 'Bearer ' + token
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.orderLines[0].product.name).to.eq('Poussière de lune')
        })

    })







    it('doit vérifier la présence du champ de disponibilité du produit', () => {
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
            .click()

        cy.contains('Nos produits')
            .should('be.visible')


        cy.contains('Poussière de lune')
            .should('be.visible')
        cy.get('[data-cy="product-link"]')
            .eq(2)
            .should('be.visible')
            .click()


        cy.contains('en stock')
            .should('be.visible')


    })



})
