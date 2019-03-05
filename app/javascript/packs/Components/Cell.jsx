// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';

class Cell extends Component {
  constructor(props){
    super(props);
    this.highlightClick = this.highlightClick.bind(this);
  }

  highlightClick () {
    this.props.showStack();
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
        className={`board__cell ${(this.props.highlighted && 'board__cell--highlighted') || ''}`}
        onClick={this.props.highlighted ? this.highlightClick : this.props.showStack}
      >
        {this.props.cards.map((card, idx) => {
          return  <Card
                    key={`${card.deck}${card.value}`}
                    deck={card.deck}
                    value={card.value}
                    zIndex={idx}
                    url={this.props.getCardUrl(card.deck, card.value, card.faceDown)}
                    faceDown={card.faceDown}
                    highlightMoves={this.props.highlightMoves}
                    cancelMove={this.props.cancelMove}
                    active={card.active}
                    isSmuggled={card.isSmuggled}
                    class={(this.props.selected && idx === this.props.cards.length - 1 && 'card--selected') || ''}
                  />
        })}
      </div>
    );
  }
}

export default Cell;
