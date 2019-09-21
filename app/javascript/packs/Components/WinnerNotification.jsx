import React, { Component } from 'react';

class WinnerNotification extends Component {
  noFeature () {
    window.alert('Feature coming soon');
  }

  render() {
    return(
      <section className={`winner-notification winner-notification--${this.props.playerDeck}`} aria-labelledby="victoryState">
        <h2 id="victoryState" className="winner-notification__heading">{this.props.playerDeck === this.props.winner ? 'Victory!' : 'Defeat'}</h2>
        <div className="winner-notification__options-container">
          <button
            onClick={this.noFeature}
            className={`winner-notification__button winner-notification__button--${this.props.playerDeck}`}
          >
            <img
              className="winner-notification__icon"
              alt=""
              src={this.props.icons.inspectIcon}
            />
            <span className="winner-notification__button-label">Review Game</span>
          </button>
          <button
            onClick={this.noFeature}
            className={`winner-notification__button winner-notification__button--${this.props.playerDeck}`}
          >
            <img
              className="winner-notification__icon"
              alt=""
              src={this.props.icons.redoIcon}
            />
            <span className="winner-notification__button-label">Rematch</span>
          </button>
        </div>
      </section>
    );
  }
}

export default WinnerNotification;
