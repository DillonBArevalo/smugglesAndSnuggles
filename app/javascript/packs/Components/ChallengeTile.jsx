import React, { Component } from 'react';

class ChallengeTile extends Component {
  render() {
    return this.props.player ?
        <div>
          <h3>{this.props.player.name}</h3>
          <button className="lobby__challenge-button" onClick={this.props.challenge}>Challenge {this.props.player.name}!</button>
        </div> :
        <p>Select a player from the list to see their details</p>
  };
}

export default ChallengeTile;
