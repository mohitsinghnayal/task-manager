const express = require('express')

const auth = require('../middleware/auth')
const router = express.Router();
const { addTask,
    updateTask,
    getTasks } = require('../controllers/taskController')
    
router.post('/', auth, addTask)

router.get('/', auth, getTasks)

router.patch('/updateTask/:id', auth, updateTask)

module.exports = router