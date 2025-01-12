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
router.post('/createRecordedSong',authenticateToken,UserController.createRecordedSong)
router.get('/getRecordedSongList',UserController.getRecordedSongList)
router.post('/createComment',authenticateToken,UserController.CreateComment)
router.get('/getComments/:song_id',UserController.getCommentList)
module.exports = router;
