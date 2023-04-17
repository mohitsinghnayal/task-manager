const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/api/v1/user').send({
        name: 'Mohit',
        email: 'mohit@example.com',
        password: 'Pass1234!'
    }).expect(201)

    const user = await User.findById(response.body.data._id)
    expect(user).not.toBeNull()
})

test('Should login existing user', async () => {
    const response = await request(app).post('/api/v1/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.data.token).toBe(user.token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/api/v1/user/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})






