import React from 'react';

class Clock extends React.Component {
  constructor() {
    super();
    this.state = {
      time: new Date()
    }
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  componentDidMount() {
    this.clock = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  render() {
    return(
      <b><p className="col-sm-3 col-xs-12 navHeading">{this.state.time.toLocaleTimeString()}</p></b>
    )
  }

}

Clock.propTypes = {
  // tagline: 'React.PropTypes.string' is the old syntax.  As of React v15.5, propTypes has become a library that should be imported ('import PropTypes from 'prop-types';').  Syntax has dropped 'React'.
  // tagline: PropTypes.string.isRequired
}

export default Clock;
