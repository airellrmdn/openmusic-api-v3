const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exception/InvariantError');
const NotFoundError = require('../exception/NotFoundError');
const { mapAlbumSongDB } = require('../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('An error occured while create album');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const query1 = {
      text: ' SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const songs = await this._pool.query(query1);

    return mapAlbumSongDB(result.rows[0], songs.rows);
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }

  async updateAlbumCoverById(url, id) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [url, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }

  async addLikeToAlbumById(credentialId, albumId) {
    await this.verifyDuplicateLike(credentialId, albumId);

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('An error occured');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
    return result.rows[0].id;
  }

  async deleteAlbumLikeById(credentialId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data not found');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getAlbumLikesById(id) {
    try {
      const headerValue = 'cache';
      const result = await this._cacheService.get(`albumLikes:${id}`);
      return { likes: parseInt(result), headerValue };
    } catch {
      const headerValue = 'server';
      const query = {
        text:'SELECT COUNT (album_id) FROM user_album_likes WHERE album_id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count);

      if (!result.rows.length) {
        throw new NotFoundError('An error occured');
      }

      await this._cacheService.set(`albumLikes:${id}`, likes);

      return { likes, headerValue };
    }
  }

  async verifyAlbumById(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }

  async verifyDuplicateLike(credentialId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Failed to like album. User already liked.');
    }
  }
}

module.exports = AlbumsService;
