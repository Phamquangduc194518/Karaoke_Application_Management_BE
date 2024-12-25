const User = require('./User');
const Song = require('./Song');
const Artist = require('./Artist');
const Album = require('./Album');
const AlbumSong = require('./AlbumSong');
const Favorite = require('./Favorites');

// Thiết lập quan hệ giữa các model

// belongsTo	1-1 hoặc N-1	
// hasMany	1-N	
// belongsToMany	N-N	

// User - Favorites - Song
User.belongsToMany(Song, { through: Favorite, foreignKey: 'user_id', as: 'favoriteSongs' });
Song.belongsToMany(User, { through: Favorite, foreignKey: 'song_id', as: 'usersWhoFavorited' });

// Artist - Songs
Artist.hasMany(Song, { foreignKey: 'artist_id', as: 'songs' });
Song.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

// Artist - Albums
Artist.hasMany(Album, { foreignKey: 'artist_id', as: 'albums' });
Album.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

// Album - Songs (many-to-many)
Album.belongsToMany(Song, { through: AlbumSong, foreignKey: 'album_id', as: 'songs' });
Song.belongsToMany(Album, { through: AlbumSong, foreignKey: 'song_id', as: 'albums' });

// Export các model
module.exports = {
  User,
  Song,
  Artist,
  Album,
  AlbumSong,
  Favorite,
};
