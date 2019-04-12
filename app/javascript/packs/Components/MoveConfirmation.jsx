import React, { Component } from 'react';

class MoveConfirmation extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div className="move-confirmation">
        <div className="move-confirmation__input-container">
          <input
            id="confirmMove"
            type="checkbox"
            className="move-confirmation__confirmation-checkbox"
            checked={this.props.confirmMove}
            onChange={this.props.toggleConfirmMove}
          />
          <label
            className="move-confirmation__confirmation-label"
            htmlFor="confirmMove"
          >
            enable move confirmation
          </label>
        </div>
        <button
          className='move-confirmation__cancel-button'
          onClick={this.props.cancelMove}
          disabled={!this.props.movement.active}
        >
          CANCEL MOVE
        </button>
      </div>
    );
  }
}

export default MoveConfirmation;
