const express = require('express')

const auth = require('../middleware/auth')
const { register,
    login,
    logout } = require('../controllers/userController')
const router = express.Router();


router.post('/', register)

router.post('/login', login)

router.post('/logout', auth, logout)


module.exports = router