const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController')

router.post('/createSong',songController.createSong);
router.get('/getSong',songController.getSong);
router.post('/createArtist', songController.createArtist)
router.patch('/updateArtist/:id', songController.updateArtist)
router.delete('/deleteArtist', songController.deleteArtist)
router.post('/createAlbum', songController.createAlbum)
router.patch('/updateAlbum/:id', songController.updateAlbum)
router.delete('/deleteAlbum', songController.deleteAlbum)
router.get('/getAllAlbum', songController.getAllAlbum)
router.get('/getAllArtist', songController.getAllArtist)

module.exports= router; 