// react component for a game
import React, { Component } from 'react';
import Card from './Card'
import PropTypes from 'prop-types';

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerDeck: this.props.playerDeck,
      board: this.props.gameData
    };
  }

  render() {
    return(
      <div id='main-game-container' className="board">
        {this.state.board.map((row, rowI) => {
          return <div key={`row${rowI}`} className="board__row">
            {row.map((cell, colI) =>{
              return <div key={`column${rowI}${colI}`} className="board__cell">
                {cell.map((card, idx) => {
                  return <Card key={`card${rowI}${colI}${idx}`} deck={card.deck} value={card.value} zIndex={idx} />
                })}
              </div>
            })}
          </div>
        })}
      </div>
    );
  }
}

export default Game;
