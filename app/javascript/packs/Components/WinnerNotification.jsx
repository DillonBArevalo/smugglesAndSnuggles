import React, { Component } from 'react';
import { renderPendingDots } from "../modules/sharedJSX";
import Modal from "./Modal";

class WinnerNotification extends Component {

  constructor(props) {
    super(props);
    this.state = {renderModal: false};
    this.renderModal = this.renderModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  renderModal () {
    this.setState({renderModal: true});
  }

  closeModal () {
    this.setState({renderModal: false});
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
    const reviewButtonId = 'reviewGame';
    return(
      <section className={`winner-notification winner-notification--${playerDeck}`} aria-labelledby="victoryState">
        <h2 id="victoryState" className="winner-notification__heading">{playerDeck === winner ? 'Victory!' : 'Defeat'}</h2>
        <div className="winner-notification__options-container">
          <button
            onClick={this.renderModal}
            className={`winner-notification__button winner-notification__button--${playerDeck}`}
            id={reviewButtonId}
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
        {this.state.renderModal && <Modal
          closeModal={this.closeModal}
          returnFocusTo={reviewButtonId}
        />}
      </section>
    );
  }
}

export default WinnerNotification;
