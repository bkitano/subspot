import React, {Component} from 'react';

class Player extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
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
        return ( 
            <div>
                <div onClick={e => this.onToggle(e)} className={!this.state.play ? "icon ion-play" : "icon ion-pause"} />
                <audio src={this.props.preview_url} ref={(audio) => { this.audio = audio }}/>
            </div>
            )
    }
}

export default Player;