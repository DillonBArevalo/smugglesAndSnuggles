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
        this.props.setPreppedMove(this.props.moveCard);
    } else {
      this.props.moveCard();
    }
  }

  render() {
    const numCards = this.props.cards.length;
    const isOverflowing = numCards > 3;
    const stackSize = numCards - 3;
    const overflowingCard = this.props.cards[stackSize - 1];
    return(
      <div
        className={`board__cell${this.props.highlighted ? ' board__cell--highlighted' : ''}`}
        onClick={this.props.highlighted ? this.highlightClick : this.props.showStack}
      >
        {isOverflowing && <div key={`${overflowingCard.deck}${overflowingCard.value}-container`} className="card-container"><Card
              key={`${overflowingCard.deck}${overflowingCard.value}`}
              deck={overflowingCard.deck}
              url={this.props.getCardUrl(overflowingCard.deck, 'overflow')}
              faceDown={true}
              isOVerflow={true}
              highlightMoves={this.props.highlightMoves}
              cancelMove={this.props.cancelMove}
              active={false}
              isSmuggled={true}
              customClass="card--4-of-4"
            /></div>}
        {this.props.cards.map((card, idx) => {
          const position = numCards - idx;
          return idx >= stackSize && <div key={`${card.deck}${card.value}-container`} className="card-container"><Card
              key={`${card.deck}${card.value}`}
              deck={card.deck}
              value={card.value}
              url={this.props.getCardUrl(card.deck, card.value, card.faceDown)}
              faceDown={card.faceDown}
              highlightMoves={!(this.props.confirmMove && this.props.highlighted) && this.props.highlightMoves}
              cancelMove={this.props.cancelMove}
              active={card.active}
              isSmuggled={card.isSmuggled}
              selected={this.props.selected && position === 1}
              customClass={`card--${position}-of-${isOverflowing ? 4 : numCards}`}
            /></div>
        })}
        {this.props.hoverCard && ((card) => <Card
            deck={card.deck}
            value={card.value}
            url={this.props.getCardUrl(card.deck, card.value)}
            faceDown={false}
            customClass="card--hovering"
          />)(this.props.hoverCard)}
      </div>
    );
  }
}

export default Cell;
