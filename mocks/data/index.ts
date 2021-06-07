import { YtMusicSong, YtMusicVideo, YtMusicAlbum, YtMusicPlaylist } from "kainet-scraper";

import suggestions from "./suggestions.json";
import searchedSongs from "./searchedSongs.json";
import searchedVideos from "./searchedVideos.json";
import searchedAlbums from "./searchedAlbums.json";
import searchedPlaylists from "./searchedPlaylists.json";
import album from "./album.json";
import playlist from "./playlist.json";

export const suggestionsMock = suggestions as YtMusicPlaylist[];
export const searchedSongsMock = searchedSongs as YtMusicSong[];
export const searchedVideosMock = searchedVideos as YtMusicVideo[];
export const searchedAlbumsMock = searchedAlbums as YtMusicAlbum[];
export const searchedPlaylistsMock = searchedPlaylists as YtMusicPlaylist[];
export const albumMock = album as YtMusicAlbum;
export const playlistMock = playlist as YtMusicPlaylist;
