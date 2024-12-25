const { where } = require('sequelize');
const { Artist, Album } = require('../model');
const Song = require('../model/Song');

const createSong = async(req, res) => {
    const {title, subTitle, artist_id, genre, lyrics, audio_url, url_image} = req.body
        try{ 
        if (!title || !artist_id || !audio_url || !url_image) {
          return res.status(400).send({ message: 'Title, artist, and audio URL are required' });
        }
          const newSong = await Song.create({
            title,
            subTitle,
            artist_id,
            genre,
            lyrics,
            audio_url,
            url_image,
        });
            res.status(201).send({message: 'Tạo bài hát thành công', newSong});
        }catch(error){
            res.status(500).send("Lưu bài hát gặp sự cố")
        };
    };

const getSong = async(req, res)=>{
    try{
        const song = await Song.findAll();
        res.status(200).json(song)
    }catch(error){
        console.error('Error fetching songs:', error);
        res.status(500).send({ message: 'Failed to fetch songs', error: error.message });
    }
};

const createArtist = async (req, res)=>{
    const {name, bio, avatar_url} = req.body
    try{
        const artist = await Artist.create({name, bio, avatar_url})
        res.status(201).send({message: 'Tạo ca sĩ thành công', artist});
    }catch(error){
        console.error('Error create artist:', error);
        res.status(500).send({ message: 'Tạo ca sĩ chưa thành công', error: error.message });
    }
}

const updateArtist = async (req, res)=>{
    const artistId = req.params.id;
    const {name, bio, avatar_url} = req.body
    try{
        const artist = await Artist.update({name, bio, avatar_url}, {where:{id: artistId}})
        res.status(201).send({message: 'Thay đổi thông tin ca sĩ thành công', artist});
    }catch(error){
        console.error('Error create artist:', error);
        res.status(500).send({ message: 'Thay đổi ca sĩ chưa thành công', error: error.message });
    }
}

const deleteArtist = async (req, res)=>{
    const artistId = req.params.id;
    try{
        const artist = await Artist.findByIdAndDelete(artistId)
        if (!artist) {
            return res.status(404).send({ message: 'Ca sĩ không tồn tại!' });
        }
        res.status(201).send({message: 'Xóa ca sĩ thành công', artist});
    }catch(error){
        console.error('Error create artist:', error);
        res.status(500).send({ message: 'Xóa ca sĩ chưa thành công', error: error.message });
    }
}

const createAlbum = async (req, res)=>{
    const {title, subTitle, artist_id, cover_url}= req.body
    try{
        const album = await Album.create({title, subTitle, artist_id, cover_url})
        res.status(201).json({ message: 'Tạo Album thành công', album: album });
    }catch(error){
        console.error('Error create album:', error);
        res.status(500).send({ message: 'Xóa Album chưa thành công', error: error.message });
    }
}

const updateAlbum = async (req, res)=>{
    const AlbumId = req.params.id
    const {title, subTitle, artist_id, cover_url}= req.body
    try{
        const updatedAlbum  = await Album.update({title, subTitle, artist_id, cover_url},{where:{id:AlbumId}})
        if (updatedAlbum[0] === 0) {
            return res.status(404).send({ message: 'Album không tồn tại!' });
          }
          res.status(200).send({ message: 'Album được cập nhật thành công!', album: updatedAlbum });
    }catch(error){
        console.error('Error editing album:', error);
        res.status(500).send({ message: 'Cập nhật album không thành công', error: error.message });
    }
}

const deleteAlbum = async (req, res)=>{
    const AlbumId = req.params.AlbumId
    try{
        const deleteAlbum = await Album.findByIdAndDelete(AlbumId)
        if(!deleteAlbum) {
            return res.status(404).send({ message: 'Album không tồn tại!' });
          }
          res.status(200).send({ message: 'Album đã được xóa thành công!', album: deleteAlbum });
    }catch(error){
        console.error('Error deleting album:', error);
        res.status(500).send({ message: 'Xóa album không thành công', error: error.message });
    }
}

const getAllArtist = async(req, res)=>{
    try{
        const artist = await Artist.findAll();
        res.status(200).json(artist)
    }catch(error){
        console.error('Error fetching:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách ca sĩ', error: error.message });
    }
}

const getAllAlbum = async(req, res)=>{
    try{
        const album = await Album.findAll();
        res.status(200).json(album)
    }catch(error){
        console.error('Error fetching:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách album', error: error.message });
    }
}

module.exports={
    createSong,
    getSong,
    createArtist,
    updateArtist,
    deleteArtist,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAllArtist,
    getAllAlbum
}