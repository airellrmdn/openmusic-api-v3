const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongsDBToModel } = require('../utils');
const NotFoundError = require('../exception/NotFoundError');
const InvariantError = require('../exception/InvariantError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('An error occured while create song');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query;
    if (title || performer) {
      title = title ? `${title}%` : null;
      performer = performer ? `${performer}%` : null;
      query = {
        text: `SELECT id, title, performer 
        FROM songs 
        WHERE ($1::text IS NULL OR title ILIKE $1) AND ($2::text IS NULL OR performer ILIKE $2)`,
        values: [title, performer],
      };
    } else {
      query = 'SELECT id, title, performer FROM songs';
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs not found');
    }

    return result.rows.map(mapSongsDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows.map(mapSongsDBToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = COALESCE($5, duration), album_id = COALESCE($6, album_id) WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async verifySong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }
}

module.exports = SongsService;
