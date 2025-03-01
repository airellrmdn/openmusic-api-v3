/* eslint-disable camelcase */
const mapSongsDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapAlbumSongDB = ({ id, name, year, cover }, songs = []) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs,
});

const mapPlaylistSongDB = ({ id, name, username }, songs = []) => ({
  id,
  name,
  username,
  songs,
});

module.exports = { mapSongsDBToModel, mapAlbumSongDB, mapPlaylistSongDB };
