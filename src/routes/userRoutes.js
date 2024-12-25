// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController')
const { authenticateToken } = require('../authMiddleware');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.patch('/updateProfile',authenticateToken,UserController.updateProfile)// update của người dùng
router.patch('/users/update/:id',UserController.updateUser)
router.get('/userProfile',authenticateToken,UserController.userProfile)

module.exports = router;
