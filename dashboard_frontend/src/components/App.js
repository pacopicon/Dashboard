import React, { Component } from 'react'
import Nav from './Nav'
import Dashboard from './Dashboard'
import '../styles/styles.css'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav
          linkClicked={true}
        />
        <div className="stockDashboard">
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default App;
