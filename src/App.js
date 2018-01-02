import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Route,
  Navlink,
  HashRouter
} from 'react-router-dom';

import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

class App extends Component {
  
  
  render() {
    
    var styles = {
      'margin': '10px'
    }
  
    
    return (
      <div className="App" style={styles}>
        <HashRouter>
          <MuiThemeProvider>
            <div className='container'>
              <Route exact path='/' component={Landing} />
              <Route path='/:tokens' component={Dashboard} />
            </div>
          </MuiThemeProvider>
        </HashRouter>
      </div>
    );
  }
}

export default App;
