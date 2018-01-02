import React, {Component} from 'react';
import queryString from 'query-string';
import spotifyWebAPI from 'spotify-web-api-node';

import {Card, CardTitle, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


import Song from './Song';

function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class Dashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            averages: {},
            totals: [],
            time_range: 'short_term'
        };
    }
    
    componentDidMount() {
        this.loadTracks();
    }
    
    short() {
        this.setState({time_range: 'short_term'});
        this.loadTracks();
    }
    
    medium() {
        this.setState({time_range: 'medium_term'});
        this.loadTracks();
    }
    
    long() {
        this.setState({time_range: 'long_term'});
        this.loadTracks();
    }
    
    loadTracks() {

        localStorage.setItem( 'token_exp', Date.now() + 3600000 );

        const tokenString = window.location.href.split('/')[4];
        var tokens = queryString.parse(tokenString);
        
        if( tokens !== null && 
        localStorage.state === tokens.state /* && 
        parseInt(localStorage.getItem('token_exp')) > Date.now() */ ) {
            localStorage.setItem('token', tokens.access_token);
        
            // Working with the spotify api
            
            var Spotify = new spotifyWebAPI();
            
            Spotify.setAccessToken(tokens.access_token);
            
            // Get the authenticated user
            Spotify.getMe().then( data => {
                this.setState({name: data.body.display_name});
                
            }, function(err) {
                console.log('Something went wrong!', err);
            });
            
            Spotify.getMyTopTracks({limit: 10, time_range: this.state.time_range}).then( trackData => {
                
                console.log(trackData.body);

                var tracks = trackData.body.items.map( item => {
                    var track = {
                        id: item.id,
                        name: item.name,
                        album: item.album.name,
                        artist: item.artists[0].name,
                        artist_id: item.artists[0].id,
                        album_artwork: item.album.images[1].url,
                        popularity: item.popularity,
                        preview_url: item.preview_url
                    }
                        
                    return track;
                }); 
                
                return tracks;
            }, function(err) {
                console.log(err);
            })
            .then( tracks => { 
                var trackIds = tracks.map( track => { return track.id });
                
                Spotify.getAudioFeaturesForTracks(trackIds).then( features => {
                    var totals = [];
                    var featureSums = {    
                            target_acousticness: 0.,
                            target_danceability: 0.,
                            target_duration_ms: 0.,
                            target_energy: 0.,
                            target_instrumentalness: 0.,
                            target_liveness: 0.,
                            target_loudness: 0.,
                            target_speechiness: 0.,
                            target_tempo: 0.,
                            target_valence: 0.
                        }
                        
                    for(var i = 0; i < features.body.audio_features.length; i++) {
                        
                        featureSums = {    
                            target_acousticness: featureSums.target_acousticness + features.body.audio_features[i].acousticness * .1,
                            target_danceability: featureSums.target_danceability + features.body.audio_features[i].danceability * .1,
                            target_duration_ms: featureSums.target_duration_ms + features.body.audio_features[i].duration_ms * .1,
                            target_energy: featureSums.target_energy + features.body.audio_features[i].energy * .1,
                            target_instrumentalness: featureSums.target_instrumentalness + features.body.audio_features[i].instrumentalness * .1,
                            target_liveness: featureSums.target_liveness + features.body.audio_features[i].liveness * .1,
                            target_loudness: featureSums.target_loudness + Math.pow(10, features.body.audio_features[i].loudness) * .1,
                            target_speechiness: featureSums.target_speechiness + features.body.audio_features[i].speechiness * .1,
                            target_tempo: featureSums.target_tempo + features.body.audio_features[i].tempo * .1,
                            target_valence: featureSums.target_valence + features.body.audio_features[i].valence * .1
                        }
                        
                        var total = {
                            track: tracks[i],
                            features: features.body.audio_features[i]
                        }
                        
                        totals.push(total);
                    }
                    
                    featureSums.target_loudness = Math.log10(featureSums.target_loudness);
                    
                    this.setState({averages: featureSums});
                    this.setState({totals: totals});
                    
                    var packed = {
                        t: tracks,
                        f: featureSums
                    }
                    
                    return packed;
                }).then( packed => {
                    
                    // var seed = packed.f;
                    var seed = {};
                    var ids = packed.t.map( track => {
                        return track.artist_id;
                    })
                    
                    var subtracks = ids.splice(0,5);
                    seed.seed_tracks = subtracks;
                    
                    Spotify.getRecommendations(seed).then( seeds => {
                        console.log(seeds);
                    });
                    
                });
            })
            
        } // end of if checking for good tokens
    }
    
    render() {
        
        console.log(this.state.totals);
            
        var container_style = {
            'position': 'relative',
            'margin' : 'auto',
            'display' : 'grid',
            'gridTemplateColumns' : '1fr',
            'width' : 'auto',
        }
        
        return (
            
            <div style={container_style}>
                <Card>
                    <CardTitle title={this.state.name.split(" ")[0] + "'s Top Tracks"} />
                    <CardActions>
                      <FlatButton label="4 weeks" onClick={ (e) => { this.short() } }/>
                      <FlatButton label="6 months" onClick={ (e) => { this.medium() } }/>
                      <FlatButton label="all time" onClick={ (e) => { this.long() } }/>
                    </CardActions>                
                    </Card>
                    {this.state.totals.map( total => {
                    
                        var trackString = queryString.stringify(total.track);
                        var featureString = queryString.stringify(total.features);
                        var totalString = queryString.stringify({track: trackString, features: featureString});
                        return (
                            <Song key={randomString(5)} preview_url={total.track.preview_url} name={total.track.name} artist={total.track.artist} album_artwork={total.track.album_artwork} totalString={totalString} />
                        );
                    })}
            </div>
            );
    }
    
}

export default Dashboard;