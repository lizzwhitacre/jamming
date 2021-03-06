import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SavedPlaylists from '../SavedPlaylists/SavedPlaylists';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Jammms',
      playlistTracks: [],
      savedPlaylists: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  };

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  };

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri
    });
    if (this.state.playlistTracks.length && this.state.playlistName) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs)
    } else {
      this.setState({
        playlistName: 'New Jammms',
        playlistTracks: []
      })
    }
  };

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.state.playlistTracks.push(track);
    }
  };

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    const newTracks = playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({
      playlistTracks: newTracks
    });
  };

  search(term) {
    Spotify.search(term).then(res => {
      this.setState({
        searchResults: res
      });
    });
  };

  getPlaylists() {
    Spotify.getPlaylists().then(res => {
      this.setState({
        savedPlaylists: res
      });
    });
  };

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
          <div className="App-SavedPlaylist">
            <SavedPlaylists playlists={this.state.savedPlaylists} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
