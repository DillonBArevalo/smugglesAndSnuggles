// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';
import PropTypes from 'prop-types';

class Cell extends Component {
  constructor(props){
    super(props);
    this.highlightClick = this.highlightClick.bind(this);
  }

  highlightClick () {
    if(this.props.confirmMove) {
      if (window.confirm('Move to the highlighted square?')) {
        this.props.moveCard();
      }
    } else {
      this.props.moveCard();
    }
  }

  render() {
    return(
      <div
        className="board__cell"
        onClick={this.props.showStack}
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
                    isSmuggled={card.isSmuggled}
                  />
        })}
        {this.props.highlighted && <div
          className="board__highlight"
          onClick={this.highlightClick}
          ></div>}
      </div>
    );
  }
}

export default Cell;
