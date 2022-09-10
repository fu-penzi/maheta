export const locales = {
  MAHETA: {
    PLAYLIST: {
      lengthCaption: (trackNumber: number) => trackNumber + ' songs',
    },
    BOTTOM_NAVIGATION: {
      player: 'Player',
      songs: 'Songs',
      albums: 'Albums',
      playlists: 'Playlists',
    },
    ADD_TO_PLAYLIST_DIALOG: {
      message: (trackName: string, playlistName: string) =>
        `Track is already in playlist ${playlistName}`,
      action: 'Close',
    },
  },
};
