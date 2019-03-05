// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';

class CellWindow extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div
        className="cell-window"
      >
        {this.props.cards.map((card, idx) => {
          return  <Card
                    key={`${card.deck}${card.value}`}
                    deck={card.deck}
                    value={card.value}
                    zIndex={idx}
                    url={this.props.getCardUrl(card.deck, card.value, card.faceDown)}
                    faceDown={card.faceDown}
                    class="cell-window__card"
                    highlightMoves={_ => {}}
                  />
        })}
      </div>
    );
  }
}

export default CellWindow;
