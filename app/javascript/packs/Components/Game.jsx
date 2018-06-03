// react component for a game
import React, { Component } from 'react';
import Card from './Card'
import Cell from './Cell'
import PropTypes from 'prop-types';

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      winner: this.props.winner,
      isLocal: this.props.isLocal,
      playerDeck: this.props.playerDeck,
      board: this.props.gameData.currentBoard,
      movesLeft: this.props.gameData.movesLeft,
      activeDeck: this.props.gameData.activeDeck,
      movedCardValue: this.props.gameData.movedCardValue,
      movement: {
        active: false,
        startingLocation: []
      }
    };

    this.highlightMoves = this.highlightMoves.bind(this);
    this.legalMoves = this.legalMoves.bind(this);
    this.buildLegalMovesBoard = this.buildLegalMovesBoard.bind(this);
    this.constructSingleListFromMovesBoard = this.constructSingleListFromMovesBoard.bind(this);
    this.isSmuggle = this.isSmuggle.bind(this);
    this.adjacentLegal = this.adjacentLegal.bind(this);
    this.clearStatuses = this.clearStatuses.bind(this);
    this.modifyAllCards = this.modifyAllCards.bind(this);
    this.cancelMove = this.cancelMove.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  moveCard(endRow, endCol){
    const board = this.state.board.slice();
    const previousTop = this.topCard(board[endRow][endCol]);
    const movingCard = board[this.state.movement.startingLocation[0]][this.state.movement.startingLocation[1]].cards.pop();
    const newTop = this.topCard(board[this.state.movement.startingLocation[0]][this.state.movement.startingLocation[1]]);
    let movesLeft = this.state.movesLeft
    let activeDeck, movedCardValue, winner;
    board[endRow][endCol].cards.push(movingCard);
    if(previousTop && previousTop.deck !== 'laws'){
      previousTop.isSmuggled = true;
    }
    if(newTop && newTop.deck !== 'laws') {
      newTop.isSmuggled = false;
      newTop.faceDown = false;
    }

    ({movesLeft, activeDeck, movedCardValue, winner} = this.checkScore(endRow, movingCard, board, movesLeft));
    if(movesLeft === 1){
      movesLeft = 2;
      activeDeck = this.state.activeDeck === 'city' ? 'country' : 'city';
      movedCardValue = null;
    }else if(movesLeft === 2){
      movesLeft = 1;
      activeDeck = this.state.activeDeck;
      movedCardValue = movingCard.value;
    }

    this.clearStatuses(board);
    this.setState({board, movesLeft, activeDeck, movedCardValue, winner, movement: {active:false, startingLocation: []}});
  }

  checkScore(endRow, card, board, movesLeft){
    const activeDeck = this.state.activeDeck;
    const playerDeck = this.state.playerDeck;
    if(activeDeck === playerDeck && endRow === 0 || activeDeck !== playerDeck && endRow === 4){
      card.faceDown = true;
      if(!board[endRow].some((cell) => this.topCard(cell).deck !== activeDeck )){
        return{movesLeft: 0, activeDeck: null, movedCardValue: null, winner: activeDeck}
      }
    }
    return {movesLeft: movesLeft}
  }

  cancelMove(){
    const board = this.state.board.slice();
    this.clearStatuses(board);
    this.setState({board, movement: {active: false, startingLocation: []}});
  }

  topCard(cell){
    if(cell.cards.length){
      return cell.cards[cell.cards.length - 1]
    }else{
      return undefined
    }
  }

  modifyAllCards(board, modifier){
    board.forEach( (row) => {
      row.forEach((cell) => {
        cell.cards.forEach((card) => {
          card.deck !== 'laws' && modifier(card);
        });
      });
    });
  }

  legalMoves(startRow, startCol){
    const possibleMoves = [[],[],[],[],[]];
    possibleMoves[startRow][startCol] = false;

    const startCell = this.state.board[startRow][startCol];
    this.buildLegalMovesBoard(possibleMoves, startRow, startCol, this.topCard(startCell));
    return this.constructSingleListFromMovesBoard(possibleMoves);
  }

  buildLegalMovesBoard(possibleMoves, startRow, startCol, card) {
    // dynamic, recursive. For all neighbors, checks if legal, then, if smuggle, run on that space.
    let endRow = startRow + 1 > 4 ? startRow : startRow + 1;
    let endCol = startCol + 1 > 2 ? startCol : startCol + 1;
    for(let i = (startRow === 0 ? startRow : startRow - 1); i <= endRow; i++){
      for(let j = (startCol === 0 ? startCol : startCol - 1); j <= endCol; j++){
        if(typeof possibleMoves[i][j] === 'undefined'){ // if not already checked
          possibleMoves[i][j] = this.adjacentLegal(card, i, j); // record check
          if(possibleMoves[i][j] && this.isSmuggle(card, i, j)){ // if smuggle
            this.buildLegalMovesBoard(possibleMoves, i, j, card); // check next
          }
        }
      }
    }
  }

  constructSingleListFromMovesBoard(possibleMoves){
    const moves = [];
    for(let i = 0; i < 5; i++){
      for(let j = 0; j < 3; j++){
        if(possibleMoves[i][j]){
          moves.push([i, j]);
        }
      }
    }
    return moves;
  }

  isSmuggle(startCard, endRow, endCol){
    const endCell = this.state.board[endRow][endCol];
    const end = this.topCard(endCell);
    return typeof end === 'object' && startCard.deck === end.deck && end.value > startCard.value;
  }

  adjacentLegal(startCard, endRow, endCol){
    if( endRow > 4 || endRow < 0 || endCol > 2 || endCol < 0 ){
      return false;
    }
    const endCell = this.state.board[endRow][endCol]
    const end = this.topCard(endCell);
    if( typeof end !== 'object' || end.deck === 'laws'){ // not a card or a law
      return true;
    }else if(end.faceDown){ // pile has scored
      return false;
    }else if( startCard.deck === end.deck && end.value > startCard.value){ // smuggling
      return true;
    }else if( startCard.deck !== end.deck && startCard.value >= end.value){ // snuggling
      return true;
    }else{ // illegal
      return false;
    }
  }

  clearStatuses(board){
    this.modifyAllCards(board, (card) => {
      card.active = false
    })
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.highlighted = false;
      });
    });
  }

  highlightMoves(row, col) {
    const card = this.topCard(this.state.board[row][col]);
    if((this.state.isLocal && card.deck === this.state.activeDeck) || (!this.state.isLocal && this.state.activeDeck !== this.state.playerDeck) || card.value === this.state.movedCardValue ){
      return
    }
    const legalMoves = this.legalMoves(row, col);
    const board = this.state.board.slice();
    this.clearStatuses(board);
    card.active = true;

    legalMoves.forEach((legalXY) => {
      board[legalXY[0]][legalXY[1]].highlighted = true;
    });
    this.setState({board, movement: {active: true, startingLocation: [row, col]}});
  }

  render() {
    return(
      <div className='game-container'>
        <div id='main-game-container' className="board">
          {this.state.board.map((row, rowIndex) => {
            return <div key={`row${rowIndex}`} className="board__row">
              {row.map((cell, colIndex) => {
                return  <Cell
                          key={`column${rowIndex}${colIndex}`}
                          cards={cell.cards}
                          highlighted={cell.highlighted}
                          highlightMoves={this.highlightMoves.bind(this, rowIndex, colIndex)}
                          cancelMove={this.cancelMove}
                          cityFlippedUrl={this.props.cityFlippedUrl}
                          countryFlippedUrl={this.props.countryFlippedUrl}
                          moveCard={this.moveCard.bind(this, rowIndex, colIndex)}
                        />
              })}
            </div>
          })}
        </div>
        {this.state.winner && <h2></h2>}
        {this.state.movement.active && <button
          className='game__cancel-button'
          onClick={this.cancelMove}
          >
          Cancel move
          </button>}
      </div>
    );
  }
}

export default Game;
