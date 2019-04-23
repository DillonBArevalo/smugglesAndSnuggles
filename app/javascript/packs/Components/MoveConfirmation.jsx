import React, { Component } from 'react';

class MoveConfirmation extends Component {
  constructor(props){
    super(props);
  }

  renderCancelMoveButton () {
    return  (<button
              className="move-confirmation__cancel-move-button"
              onClick={this.props.cancelMove}
              disabled={!this.props.movement.active}
            >
              CANCEL MOVE
            </button>)
  }

  renderMoveConfirmation () {
    return (<div className="move-confirmation__button-container">
              <button
                onClick={this.props.cancelMove}
                className="move-confirmation__button move-confirmation__button--cancel"
              >
                <img className="move-confirmation__button-image" src={this.props.assets.xIcon} alt="Cancel Move"/>
              </button>
              <button
                onClick={this.props.makeMove}
                className="move-confirmation__button move-confirmation__button--confirm"
              >
                <img className="move-confirmation__button-image" src={this.props.assets.checkIcon} alt="Confirm Move"/>
              </button>
            </div>)
  }

  render() {
    return(
      <div className="move-confirmation">
        <div className="move-confirmation__input-container">
          <div className="move-confirmation__checkbox-container">
            <input
              id="confirmMove"
              type="checkbox"
              className="move-confirmation__checkbox"
              checked={this.props.confirmMove}
              onChange={this.props.toggleConfirmMove}
              />
            <img
              className={'move-confirmation__checkbox-image move-confirmation__checkbox-image--' + (this.props.confirmMove ? 'checked' : 'unchecked')}
              onClick={this.props.toggleConfirmMove}
              src={this.props.assets[this.props.confirmMove ? 'checkboxChecked' : 'checkboxUnchecked']}
              alt=""
            />
          </div>
          <label
            className="move-confirmation__label"
            htmlFor="confirmMove"
          >
            enable move confirmation
          </label>
        </div>
        {this.props.confirmMove ? this.renderMoveConfirmation() : this.renderCancelMoveButton()}
      </div>
    );
  }
}

export default MoveConfirmation;
