const express = require('express');
const router = express.Router();
const LiveStreamController = require('../controllers//liveStreamController')
const { authenticateToken } = require('../authMiddleware');


router.post('/createLiveStream', LiveStreamController.createLiveStream);
router.patch('/updateLiveStream/:host_user_id', LiveStreamController.updateLiveStream);
router.get('/getLiveStreamList', LiveStreamController.getLiveStream);
router.post('/createCommentLiveStream', LiveStreamController.createCommentLiveStream);
router.get('/getCommentsByStream/:stream_id', LiveStreamController.getCommentsByStream);
module.exports= router;