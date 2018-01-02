import React, {Component} from 'react';
import queryString from 'query-string';

import {Card, CardMedia, CardTitle} from 'material-ui/Card';

class Song extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            total: this.props.totalString,
            play: false
        }
    }
    
     onToggle(e) {
        this.setState({play: !this.state.play});
        if(this.state.play) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }
    
    render() {
        
        var total = queryString.parse(this.state.total);
        var parsedTotal = {};
        parsedTotal.features = queryString.parse(total.features);
        parsedTotal.track = queryString.parse(total.track);
        
        var style_album_play = {
            'margin':'10px',
            'opacity':'0.5',
            'padding' : '10px'
        }
        
        var style_album_pause = {
            'margin':'10px',
        }
        
        var style_info_hidden = {
            'hidden':'true'
        }
        
        var style_info = {
            'margin':'auto'
        }
        
        return (
            <Card >
                <div style={this.state.play ? style_album_play : style_album_pause} onClick={e => this.onToggle(e)}>
                    <CardMedia 
                      overlay={<CardTitle title={this.props.name} subtitle={this.props.artist} />}
                    >
                        <img src={parsedTotal.track.album_artwork} alt="" />
                    </CardMedia>
                </div>
                <audio src={this.props.preview_url} ref={(audio) => { this.audio = audio }} volume=".5" />
            </Card>
            )
    }
}

export default Song;