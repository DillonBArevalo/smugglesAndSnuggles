import React, { Component } from 'react';

class Player extends Component {
  renderButtons () {
    if(this.props.type === 'default' || !this.props.type) {
      return (
        <div className="player__button-container player__button-container--single">
          <button className="player__button player__button--primary">Invite</button>
        </div>
        );
    } else if (this.props.type === 'pending'){
      return (
        <div className="player__button-container player__button-container--single">
          <p className="player__static-notification">Pending...</p>
        </div>
      );
    } else if (this.props.type === 'rejected'){
      return (
        <div className="player__button-container player__button-container--single">
          <p className="player__static-notification">Ignored</p>
        </div>
      );
    } else if (this.props.type === 'request'){
      return [
        <div key="primary" className="player__button-container">
          <button className="player__button player__button--primary">Accept</button>
        </div>,
        <div key="secondary" className="player__button-container">
          <button className="player__button player__button--secondary">Ignore</button>
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
