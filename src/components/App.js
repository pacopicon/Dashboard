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

        {/* <div className="App-header">
          <p>Stocks</p>
          <button className="linkBtn" aria-hidden="true" name="tradesLinkClicked" value={tradesLinkClicked} onClick={(e) => this.handleLinkToggle(e, true)}></button>
        </div> */}

        <div className="stockDashboard">
          <StockDashboard />
        </div>
      </div>
    );
  }
}

export default App;
