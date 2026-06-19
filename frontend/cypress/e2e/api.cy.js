let token
describe('Tests API', () => {


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


    it('doit retourner 403 si utilisateur non disposant des bons droits', () => {

        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            failOnStatusCode: false
        })

            .then((response) => {

                expect(response.status).to.eq(403)
            })
    })




    it('doit retourner la liste des produits qui sont dans le panier', () => {


        cy.request({

            method: 'PUT',
            url: 'http://localhost:8081/orders/add ',
            headers: {
                "Authorization": "Bearer " + token
            },

            body: {
                product: 3,
                quantity: 1
            }
        })
            .then((response) => {
                expect(response.status).to.eq(200)
            })




        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/orders',
            headers: {
                "Authorization": "Bearer " + token
            }

        })

            .then((response) => {
                expect(response.status).to.eq(200)


                expect(response.body.orderLines[0].product.id).to.eq(3)

                expect(response.body.orderLines[0].product.name).to.eq('Sentiments printaniers')

                expect(response.body.orderLines[0].quantity).to.eq(1)
            })
    })




    it('doit retourner la fiche du produit spécifié', () => {



        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/products/8',

        })

            .then((response) => {
                expect(response.status).to.eq(200)


                expect(response.body.id).to.eq(8)

                expect(response.body.name).to.eq('Milkyway')

                expect(response.body.availableStock).to.eq(6)
            })

    })



    it('doit retourner 200 si utilisateur connu', () => {

        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login ',
            body: {
                username: 'test2@test.fr',
                password: 'testtest'
            }
        })

            .then((response) => {
                expect(response.status).to.eq(200)
            })
    })


    it('doit retourner 401 si utilisateur inconnu', () => {

        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            failOnStatusCode: false,

            body: {
                username: 'essai@test.fr',
                password: 'essaitest'
            }
        })

            .then((response) => {
                expect(response.status).to.eq(401)

            })
    })




    it('doit ajouter un produit disponible au panier', () => {


        cy.request({
            method: 'PUT',
            url: 'http://localhost:8081/orders/add ',
            failOnStatusCode: false,

            headers: {
                "Authorization": "Bearer " + token
            },
            body: {
                product: 5,
                quantity: 2
            }

        })

            .then((response) => {

                expect(response.status).to.eq(200)

                expect(response.body.orderLines[1].product.id).to.eq(5)
                expect(response.body.orderLines[1].product.name).to.eq('Poussière de lune')
                expect(response.body.orderLines[1].quantity).to.eq(2)

            })
    })






    it('ne doit pas ajouter un produit en rupture de stock', () => {

        cy.request({
            method: 'PUT',
            url: 'http://localhost:8081/orders/add ',
            headers: {
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false,


            body: {
                product: 3,
                quantity: 1
            }

        })

            .then((response) => {
                expect(response.status).to.eq(400)
            })
    })





    it('doit ajouter un avis', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/reviews',
            headers: {
                "Authorization": "Bearer " + token
            },

            body: {
                title: 'Bon produit',
                comment: 'Sent bon',
                rating: 5
            }
        })

            .then((response) => {
                expect(response.status).to.eq(200)

            })
    })

})