// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';
import PropTypes from 'prop-types';

class Cell extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div
        className="board__cell"
      >
        {this.props.cards.map((card, idx) => {
          return  <Card
                    key={`${card.deck}${card.value}`}
                    deck={card.deck}
                    value={card.value}
                    zIndex={idx}
                    url={card.faceDown ? this.props[`${card.deck}FlippedUrl`] : card.url}
                    faceDown={card.faceDown}
                    highlightMoves={this.props.highlightMoves}
                    cancelMove={this.props.cancelMove}
                    active={card.active}
                  />
        })}
        {this.props.highlighted && <div
          className="board__highlight"
          ></div>}
      </div>
    );
  }
}

export default Cell;
