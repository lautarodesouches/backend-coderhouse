import chai from "chai"
import supertest from "supertest"
import { faker } from "@faker-js/faker"
import config from '../config/index.js'

const expect = chai.expect
const requester = supertest(`http://localhost:${config.port}`)

describe('Main test', () => {

    describe('- Products test', () => {

        let productId = 0

        let productsQty = 0

        it('Get all products has at least 10 products', async () => {

            const response = await requester.get('/api/products')

            const { status, body } = response

            expect(status).to.be.equal(200)

            expect(body.payload.length).to.be.greaterThan(9)

            productsQty = body.payload.length

        })

        it('Add new product', async () => {

            const newProduct = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                code: faker.number.int(),
                category: faker.commerce.department(),
                stock: faker.number.int(),
                thumbnail: faker.image.url(),
                owner: null,
                status: true
            }

            const response = await requester.post('/api/products').send(newProduct)

            const { status, body } = response

            expect(status).to.be.equal(201)

            productId = body.payload._id

        })

        it('Check if product is added', async () => {

            const response = await requester.get('/api/products')

            const { status, body } = response

            expect(status).to.be.equal(200)

            expect(body.payload.length).to.be.equal(productsQty + 1)

            productsQty = body.payload.length

        })

        it('Delete the new product', async () => {

            const response = await requester.delete(`/api/products/${productId}`)

            const { status } = response

            expect(status).to.be.equal(200)

        })

    })

    describe('- Cart test', () => {

        let cartId = 0

        it('Create cart', async () => {

            const response = await requester.post('/api/carts')

            const { status, body } = response

            expect(status).to.be.equal(200)

            cartId = body.payload._id

        })

        it('Get cart created', async () => {

            const response = await requester.get(`/api/carts/${cartId}`)

            const { status } = response

            expect(status).to.be.equal(200)

        })

        it('Delete cart created', async () => {

            const response = await requester.delete(`/api/carts/${cartId}`)

            const { status } = response

            expect(status).to.be.equal(200)

        })

    })

    describe('- User test', () => {

        let userId = 0

        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int(),
            password: faker.internet.password(),
        }

        /* it('Create user', async () => {

            const response = await requester.post('/api/users').send(user)

            const { status, body } = response

            console.log('BODY', body)

            userId = body.payload._id

            expect(status).to.be.equal(200)

        })

        it('Delete user', async () => {

            const response = await requester.delete(`/api/users/${userId}`)

            const { status } = response

            expect(status).to.be.equal(200)

        })
 */
    })

})