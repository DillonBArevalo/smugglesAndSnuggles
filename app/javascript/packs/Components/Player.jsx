import React, { Component } from 'react';

class Player extends Component {
  render() {
    return (
      <button className="player__card" onClick={this.props.popup}>
        <span className="player__label">{this.props.name}</span>
      </button>
    );
  };
}

export default Player;
