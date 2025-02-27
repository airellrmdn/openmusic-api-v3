/* eslint-disable camelcase */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT2',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INT2',
    },
    album_id: {
      type: 'VARCHAR(50)',
    },
  });
};

/**
   * @param pgm {import('node-pg-migrate').MigrationBuilder}
   * @param run {() => void | undefined}
   * @returns {Promise<void> | void}
   */
exports.down = (pgm) => {
  pgm.dropTable('songs');
};