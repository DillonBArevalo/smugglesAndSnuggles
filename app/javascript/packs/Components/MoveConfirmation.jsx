import React, { Component } from 'react';

class MoveConfirmation extends Component {
  constructor(props){
    super(props);
  }

  

  render() {
    return(
      <div className="game-container__center-box">
        {this.props.displayWinner()}
        <div className="game-container__move-confirmation">
          <input
            id="confirmMove"
            type="checkbox"
            className="game-container__confirmation-checkbox"
            checked={this.props.confirmMove}
            onChange={this.props.toggleConfirmMove}
          />
          <label
            className="game-container__confirmation-label"
            htmlFor="confirmMove"
          >Enable move confirmation</label>
        </div>
        <button
          className='game__cancel-button'
          onClick={this.cancelMove}
          disabled={!this.props.movement.active}
          >
          Cancel move
          </button>
      </div>
    );
  }
}

export default MoveConfirmation;
