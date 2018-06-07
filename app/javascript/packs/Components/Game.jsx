// react component for a game
import React, { Component } from 'react';
import Card from './Card'
import Cell from './Cell'
import PropTypes from 'prop-types';

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      law: this.props.gameData.law,
      winner: this.props.winner || null,
      isLocal: this.props.isLocal,
      playerDeck: this.props.playerDeck,
      board: this.props.gameData.currentBoard,
      movesLeft: this.props.gameData.movesLeft,
      activeDeck: this.props.gameData.activeDeck,
      movedCardValue: this.props.gameData.movedCardValue || [],
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
    this.canMove = this.canMove.bind(this);
    this.newTurnVars = this.newTurnVars.bind(this);
    this.flippedBoard = this.flippedBoard.bind(this);
    this.setSmuggleAndFlip = this.setSmuggleAndFlip.bind(this);
    this.isOnLaw = this.isOnLaw.bind(this);
    this.isSnuggle = this.isSnuggle.bind(this);
  }

  flippedBoard(){
    const board = this.state.board;
    board.map((row) => {
      return row.reverse();
    });
    return board.reverse();
  }

  canMove(board, deck, movedCardValue){
    return board.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        let top = this.topCard(cell);
        return top.deck === deck && !top.faceDown && top.value !== movedCardValue && !!this.legalMoves(rowIndex, colIndex).length;
      })
    })
  }

  setSmuggleAndFlip(previousTop, newTop){
    if(previousTop.deck && previousTop.deck !== 'laws'){
      previousTop.isSmuggled = true;
    }
    if(newTop.deck && newTop.deck !== 'laws') {
      newTop.isSmuggled = false;
      newTop.faceDown = false;
    }
  }

  moveCard(endRow, endCol){
    const board = this.state.board.slice();
    const previousTop = this.topCard(board[endRow][endCol]);
    const movingCard = board[this.state.movement.startingLocation[0]][this.state.movement.startingLocation[1]].cards.pop();
    const newTop = this.topCard(board[this.state.movement.startingLocation[0]][this.state.movement.startingLocation[1]]);
    let movesLeft = this.state.movesLeft;
    let movedCardValue = this.state.movedCardValue;
    let activeDeck, winner;
    board[endRow][endCol].cards.push(movingCard);

    this.setSmuggleAndFlip(previousTop, newTop);

    ({movesLeft, movedCardValue, winner, activeDeck} = this.checkScore(endRow, movingCard, board, movesLeft, movedCardValue));
    if(this.state.law === 1 && this.isOnLaw(endRow, endCol)){
      activeDeck = this.state.activeDeck;
      movedCardValue.push(movingCard.value);
    }else if(movesLeft === 1){
      ({movesLeft, activeDeck, movedCardValue} = this.newTurnVars(this.state.activeDeck));
    }else if(movesLeft === 2){
      movesLeft = 1;
      activeDeck = this.state.activeDeck;
      if(!(this.state.law === 3 && this.topCard(board[2][1]).deck === activeDeck)){
        movedCardValue.push(movingCard.value);
      }
    }

    if(!this.canMove(board, activeDeck, movedCardValue)){
      ({movesLeft, activeDeck, movedCardValue} = this.newTurnVars(activeDeck));
    }

    this.clearStatuses(board);
    this.setState({board, movesLeft, activeDeck, movedCardValue, winner, movement: {active:false, startingLocation: []}});
  }

  newTurnVars(activeDeck){
    return {
      movesLeft: 2,
      activeDeck: activeDeck === 'city' ? 'country' : 'city',
      movedCardValue: []
    }
  }

  checkScore(endRow, card, board, movesLeft, movedCardValue){
    const activeDeck = this.state.activeDeck;
    const playerDeck = this.state.playerDeck;
    if(activeDeck === playerDeck && endRow === 0 || activeDeck !== playerDeck && endRow === 4){
      card.faceDown = true;
      if(!board[endRow].some((cell) => this.topCard(cell).deck !== activeDeck)){
        return {movesLeft: 0, movedCardValue: [], winner: activeDeck, activeDeck: null}
      }
    }
    return {movesLeft: movesLeft, movedCardValue: movedCardValue, winner: null}
  }

  cancelMove(){
    const board = this.state.board.slice();
    this.clearStatuses(board);
    this.setState({board, movement: {active: false, startingLocation: []}});
  }

  topCard(cell){
    if(cell.cards.length){
      return cell.cards[cell.cards.length - 1];
    }else{
      return {}
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

  isOnLaw(row, col){
    return row === 2 && col === 1;
  }

  isSmuggle(startCard, endRow, endCol){
    const endCell = this.state.board[endRow][endCol];
    const end = this.topCard(endCell);
    if(this.state.law === 2 && this.isOnLaw(endRow, endCol)){
      return startCard.deck === end.deck && end.value < startCard.value;
    }
    return startCard.deck === end.deck && end.value > startCard.value;
  }

  adjacentLegal(startCard, endRow, endCol){
    if( endRow > 4 || endRow < 0 || endCol > 2 || endCol < 0 ){
      return false;
    }
    const endCell = this.state.board[endRow][endCol];
    const end = this.topCard(endCell);
    if(!end.deck || end.deck === 'laws'){ // not a card or a law
      return true;
    }else if(end.faceDown){ // pile has scored
      return false;
    }else if(startCard.deck === end.deck){ // moving onto ally
      return true;
    }else if(this.isSnuggle(startCard, end, endRow, endCol)){ // snuggling
      return true;
    }else{ // illegal
      return false;
    }
  }

  isSnuggle(startCard, end, endRow, endCol){
    if(this.state.law === 1 && this.isOnLaw(endRow, endCol)){
      return true;
    }else if(this.state.law === 4 && this.isOnLaw(endRow, endCol)){
      return startCard.deck !== end.deck && startCard.value <= end.value;
    }else{
      return startCard.deck !== end.deck && startCard.value >= end.value;
    }
  }

  clearStatuses(board){
    this.modifyAllCards(board, (card) => {
      card.active = false;
    })
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.highlighted = false;
      });
    });
  }

  highlightMoves(row, col) {
    const card = this.topCard(this.state.board[row][col]);
    if((this.state.isLocal && card.deck !== this.state.activeDeck)
      || (!this.state.isLocal && this.state.activeDeck !== this.state.playerDeck)
      || this.state.movedCardValue.some((value) => card.value === value)
      || this.state.winner ){
      return;
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
        <div className="game-container__center-box">
          {this.state.winner && <h2>{this.state.winner} Bears Win!</h2>}
          <h3>Moves Left: {this.state.movesLeft}</h3>
          <h3>Active Deck: {this.state.activeDeck} bears</h3>
          <button
            className='game__cancel-button'
            onClick={this.cancelMove}
            disabled={!this.state.movement.active}
            >
            Cancel move
            </button>
        </div>
      </div>
    );
  }
}

export default Game;
