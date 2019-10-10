import React, { Component } from 'react';
import { renderPendingDots } from "../modules/sharedJSX";

class WinnerNotification extends Component {
  noFeature () {
    window.alert('Feature coming soon\u2122');
  }

  renderRequestButton () {
    const {rematch, isOpponentPresent, requestPending, icons, rematchRequested, playerDeck } = this.props;
    let contents = [];
    if (requestPending) {
      const label = rematchRequested ? 'starting rematch' : 'rematch invitation pending';
      contents.push(renderPendingDots('winner-notification', 'pending-dots-container', label));
    } else {
      !rematchRequested && contents.push(<img
        className="winner-notification__icon"
        alt=""
        src={icons.redoIcon}
        key="rematchIcon"
      />);
      contents.push(<span className="winner-notification__button-label" key="rematchLabel">
        { rematchRequested ?
          'Play Rematch!' :
          'Rematch?'
        }
      </span>);
    }

    const requestedClass = rematchRequested ? 'winner-notification__button--rematch' : '';
    return (<button
      onClick={rematch}
      disabled={ !isOpponentPresent || requestPending }
      className={`winner-notification__button winner-notification__button--${playerDeck} ${requestedClass}`}
    >
      {contents}
    </button>);
  }

  render() {
    const { icons, playerDeck, winner } = this.props;
    return(
      <section className={`winner-notification winner-notification--${playerDeck}`} aria-labelledby="victoryState">
        <h2 id="victoryState" className="winner-notification__heading">{playerDeck === winner ? 'Victory!' : 'Defeat'}</h2>
        <div className="winner-notification__options-container">
          <button
            onClick={this.noFeature}
            className={`winner-notification__button winner-notification__button--${playerDeck}`}
          >
            <img
              className="winner-notification__icon"
              alt=""
              src={icons.inspectIcon}
            />
            <span className="winner-notification__button-label">Review Game</span>
          </button>
          {this.renderRequestButton()}
        </div>
      </section>
    );
  }
}

export default WinnerNotification;
