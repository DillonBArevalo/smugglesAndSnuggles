import React, { Component } from 'react';

class ChallengeTile extends Component {
  renderForm () {
    return (
      <form>
        <label>
          <input
            type="text"
            value={this.props.challengeMessage}
            onChange={this.props.updateChallengeMessage}
          />
        </label>
        <button className="lobby__challenge-button" onClick={this.props.challenge}>
          Challenge {this.props.player.name}!
        </button>
      </form>
    );
  }

  renderMessage () {
    return (
      <p>You have successfully sent this player an invitation to play.</p>
    );
  }

  render() {
    return this.props.player ?
        <div>
          <h3>{this.props.player.name}</h3>
          {this.props.player.requestSent ? this.renderMessage() : this.renderForm()}
        </div> :
        <p></p>
  };
}

export default ChallengeTile;
