exports.up = (pgm) => {
  /*
    Menambahkan constraint UNIQUE.
  */
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');

  // memberikan constraint foreign key
  pgm.addConstraint(
    'collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
};
