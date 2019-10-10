import React, { Component } from 'react';
import { renderPendingDots } from "../modules/sharedJSX";

class Player extends Component {
  constructor (props) {
    super(props);
    this.invitePlayer = this.invitePlayer.bind(this);
    this.ignorePlayer = this.ignorePlayer.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  invitePlayer () {
    this.props.invite(this.props.id);
  }

  ignorePlayer () {
    this.props.ignore(this.props.id);
  }

  acceptRequest () {
    this.props.accept(this.props.id);
  }

  renderButtons () {
    if(this.props.type === 'default' || !this.props.type) {
      return (
        <div className="player__button-container player__button-container--single">
          <button
            disabled={this.props.pending}
            onClick={this.invitePlayer}
            className="player__button player__button--primary"
          >
            Invite
          </button>
        </div>
        );
    } else if (this.props.type === 'pending'){
      return (
        <div className="player__button-container player__button-container--single">
          {renderPendingDots('player', 'static-notification', 'invitation pending')}
        </div>
      );
    } else if (this.props.type === 'rejected'){
      return (
        <div className="player__button-container player__button-container--single">
          <p className="player__static-notification player__static-notification--rejected">Ignored</p>
        </div>
      );
    } else if (this.props.type === 'request'){
      return [
        <div key="primary" className="player__button-container">
          <button
            disabled={this.props.pending}
            className="player__button player__button--primary"
            onClick={this.acceptRequest}
          >
            Accept
          </button>
        </div>,
        <div key="secondary" className="player__button-container">
          <button
            disabled={this.props.pending}
            className="player__button player__button--secondary"
            onClick={this.ignorePlayer}
          >
            Ignore
          </button>
        </div>
      ];
    }
  }

  render() {
    return (
      <li className="player">
        {this.renderButtons()}
        <div className="player__name-container">
          {this.props.name}
        </div>
      </li>
    );
  };
}

export default Player;
