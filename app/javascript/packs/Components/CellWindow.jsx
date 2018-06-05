// react component for a board cell
import React, { Component } from 'react';
import Card from './Card';
import PropTypes from 'prop-types';

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
                    url={card.faceDown ? this.props[`${card.deck}FlippedUrl`] : card.url}
                    faceDown={card.faceDown}
                    class="cell-window__card"
                  />
        })}
      </div>
    );
  }
}

export default CellWindow;
