import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import queryString from 'query-string';

function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class Landing extends Component {
    
    login() {
        
        var url = 'https://accounts.spotify.com/authorize';
        
        var stateKey = randomString(8);
        localStorage.setItem('state', stateKey);
        
        var params = {
            client_id: '898ce043624a4b3fa215a8819f8db66f',
            response_type: 'token',
            redirect_uri: 'http://spot-sum.herokuapp.com/#/callback',
            state: stateKey,
            scope: 'user-top-read'
        }
        
        var paramString = queryString.stringify(params);
        
        var reqURL = url + '?' + paramString;
        
        window.open(reqURL);
    }
    
    render() {
        return (
            <div>
                <FlatButton label="login" onClick={e => this.login()} />
            </div>
            )
    }
}

export default Landing;