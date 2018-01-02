import React, {Component} from 'react';
import queryString from 'query-string';

import BarChart from 'react-bar-chart';

/*
Graph: given a set of data, return a bar chart.
*/
class Graph extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            features: queryString.parse(this.props.features)
        }
    }
    
    componentDidMount() {
        
    }
    
    render() {
        
        var data = [ 
            {text: 'acousticness', value: this.state.features.acousticness},
            {text: 'danceability', value: this.state.features.danceability},
            {text: 'energy', value: this.state.features.energy},
            {text: 'instrumentalness', value: this.state.features.instrumentalness},
            {text: 'liveness', value: this.state.features.liveness},
            {text: 'speechiness', value: this.state.features.speechiness},
            {text: 'valence', value: this.state.features.valence}
        ]
        
        console.log(this.state.features);
        
        return (
            <div>
                <BarChart width={500}
                  height={100}
                  data={data}/>
            </div>
            )
    }
}

export default Graph;