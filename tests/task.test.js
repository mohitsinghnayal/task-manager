const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/api/v1/task')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            title:'TASK ONE TITLE',
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body.data._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/api/v1/task')
        .set('Authorization', `Bearer ${userOne.token}`)
        .send()
        .expect(200)
    expect(response.body.data.tasks.length).toEqual(2)
})

test('Should update  tasks', async () => {
    const response = await request(app)
        .patch(`/api/v1/task/updateTask/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            title:"UPDATE THE TITLE",
            description: "update task 1",
            completed:true
        })
        .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


test('Should not update other user tasks', async () => {
    const response = await request(app)
        .patch(`/api/v1/task/updateTask/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send({
            description: "update task by user two",
            completed:true
        })
        .expect(400)
})