import React, { Component } from 'react'
import Nav from './Nav'
import StockDashboard from './StockDashboard'
import '../styles/App.css'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav
          linkClicked={true}
        />
        <div className="stockDashboard">
          <StockDashboard />
        </div>
      </div>
    );
  }
}

export default App;
