// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';

class stackPreview extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div
        className="stack-preview"
      >
        {this.props.cards.map((card, idx) => {
          return  <Card
                    key={`${card.deck}${card.value}`}
                    deck={card.deck}
                    value={card.value}
                    zIndex={idx}
                    url={this.props.getCardUrl(card.deck, card.value, card.faceDown)}
                    faceDown={card.faceDown}
                    class="stack-preview__card"
                    highlightMoves={_ => {}}
                  />
        })}
      </div>
    );
  }
}

export default stackPreview;
