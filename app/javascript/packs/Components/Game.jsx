import React, { Component } from 'react';
import Cell from './Cell';
import PlayerIcons from './PlayerIcons';
import StackPreview from './StackPreview';
import MoveConfirmation from './MoveConfirmation';
import Modal from "./Modal";
import WinnerNotification from './WinnerNotification';
import {enterGame} from '../modules/apiRequests'

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeDeck: this.props.gameData.activeDeck,
      board: this.props.gameData.currentBoard,
      confirmMove: false,
      isFlippedBoard: this.props.playerDeck === 'city',
      isOpponentConnected: this.props.isLocal,
      movedCardValue: this.props.gameData.movedCardValue || [],
      movement: {
        active: false,
        startingLocation: [],
      },
      movesLeft: this.props.gameData.movesLeft,
      playerDeck: this.props.playerDeck,
      preppedMove: {},
      stackView: null,
      winner: this.props.gameData.winner || null,
    };

    this.messageResponseMapper = {
      join: 'startGame',
      leave: 'opponentLeave',
      move: 'moveOpponent',
      message: 'message',
      rematch: 'receiveRematchRequest',
      accept: 'receiveRequestAccepted',
      startGame: 'startNewGame',
    };

    this.cancelMove = this.cancelMove.bind(this);
    this.docKeyup = this.docKeyup.bind(this);
    this.hideStack = this.hideStack.bind(this);
    this.highlightMoves = this.highlightMoves.bind(this);
    this.toggleConfirmMove = this.toggleConfirmMove.bind(this);
    this.getCardUrl = this.getCardUrl.bind(this);
    this.resign = this.resign.bind(this);
    this.requestRematch = this.requestRematch.bind(this);
    this.acceptRematch = this.acceptRematch.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.toggleRenderResignModal = this.toggleRenderResignModal.bind(this);
  }

  componentDidMount () {
    enterGame(this, this.handleMessage.bind(this), this.props.id, this.props.gameId, this.props.isLocal);
    document.addEventListener('keyup', this.docKeyup);
    window.addEventListener('beforeunload', this.cleanUp);
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.docKeyup);
    this.cleanUp();
  }

  cleanUp () {
    this.channel.sendUpdate('leave');
    // there's a race condition here where if you disconnect first it will ignore
    // the leave message and other components won't remove this user from the list
    window.setTimeout(() => this.channel.consumer.disconnect(), 500);
  }

  handleMessage (message) {
    if (message.playerId !== this.props.id) {
      this[this.messageResponseMapper[message.type]](message);
    }
  }

  startGame({isInitialJoin}) {
    this.setState({isOpponentConnected: true});
    if (isInitialJoin) {
      this.channel.sendUpdate('join');
    }
  }

  moveOpponent({endRow, endCol, movement}) {
    this.moveCard(endRow, endCol, movement, true);
  }

  requestRematch () {
    this.channel.sendUpdate('rematch');
    this.setState({requestPending: true});
  }

  receiveRematchRequest () {
    this.setState({rematchRequested: true});
  }

  acceptRematch () {
    const player2 = this.props.playersData[this.props.playerDeck === 'city' ? 'country' : 'city'].id
    this.channel.sendUpdate(
      'accept',
      {
        isLocal: false,
        player1: this.props.id,
        player2,
      }
    );
    this.setState({requestPending: true});
    this.acceptTimeout = window.setTimeout(() => {
      this.setState({requestPending: false});
      window.alert('Something went wrong. Please return to the Lobby to try again.');
    }, 5000);
  }

  receiveRequestAccepted ({url}) {
    console.log(url)
    this.channel.sendUpdate('startGame', {url})
    window.setTimeout(() => window.location.href = url, 500);
  }

  startNewGame ({url, errors}) {
    console.log(url)
    window.location.href = url;
  }

  opponentLeave () {
    this.setState({isOpponentConnected: false});
  }

  resign () {
    window.location.href = '/games/new';
  }

  getCardUrl (deck, number, flipped = false) {
    const key = flipped ? 'flipped' : number;
    return this.props.assets.cards[deck][key];
  }

  setPreppedMove (location, boundMoveFunction) {
    const {startingLocation} = this.state.movement;
    const card = this.topCard(this.state.board[ startingLocation[0] ][ startingLocation[1] ])
    this.setState({preppedMove: {card, location, boundMoveFunction}});
  }

  toggleConfirmMove () {
    this.setState({confirmMove: !this.state.confirmMove});
  }

  flippedBoard () {
    return this.state.board.map((row) => row.slice().reverse()).reverse();
  }

  showStack(row, col){
    this.setState({stackView: {row: row, col: col}});
  }

  hideStack(){
    this.setState({stackView: null});
  }

  canMove(board, deck, movedCardValue){
    return board.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        let top = this.topCard(cell);
        return top.deck === deck && !top.faceDown && !movedCardValue.some((value) => top.value === value) && !!this.legalMoves(rowIndex, colIndex).length;
      })
    })
  }

  setSmuggleAndFlip(previousTop, newTop){
    if(previousTop.deck){
      previousTop.isSmuggled = true;
    }
    if(newTop.deck) {
      newTop.isSmuggled = false;
      newTop.faceDown = false;
    }
  }

  generateMoveData(endRow, endCol, startingLocation, card) {
    const [startCol, startRow] = startingLocation;
    const {deck, value} = card;
    return {endRow, endCol, startCol, startRow, deck, value};
  }

  moveCard(endRow, endCol, movement = false, isOpponentMove = false){
    const board = this.state.board.slice();
    const previousTop = this.topCard(board[endRow][endCol]);
    const startingLocation = movement && movement.startingLocation ?
      movement.startingLocation :
      this.state.movement.startingLocation;
    const movingCard = board[startingLocation[0]][startingLocation[1]].cards.pop();
    const newTop = this.topCard(board[startingLocation[0]][startingLocation[1]]);
    const moveData = this.generateMoveData(endRow, endCol, startingLocation, movingCard);
    let {movesLeft, movedCardValue} = this.state;
    let activeDeck, winner;
    board[endRow][endCol].cards.push(movingCard);

    this.setSmuggleAndFlip(previousTop, newTop);

    ({movesLeft, movedCardValue, winner, activeDeck} = this.checkScore(endRow, movingCard, board, movesLeft, movedCardValue));
    if(movesLeft === 1){
      ({movesLeft, activeDeck, movedCardValue} = this.newTurnVars(this.state.activeDeck));
    }else if(movesLeft === 2){
      movesLeft = 1;
      activeDeck = this.state.activeDeck;
      movedCardValue.push(movingCard.value);
    }

    if(!this.canMove(board, activeDeck, movedCardValue)){
      ({movesLeft, activeDeck, movedCardValue} = this.newTurnVars(activeDeck));
    }

    !isOpponentMove && this.channel.sendUpdate('move', {endRow, endCol, movesLeft, activeDeck, board, winner, moveData, movement: this.state.movement});
    this.clearStatuses(board);
    this.setState({board, movesLeft, activeDeck, movedCardValue, winner, movement: {active:false, startingLocation: []}, preppedMove: {}});
  }

  newTurnVars(activeDeck){
    return {
      movesLeft: 2,
      activeDeck: activeDeck === 'city' ? 'country' : 'city',
      movedCardValue: [],
    }
  }

  checkScore(endRow, card, board, movesLeft, movedCardValue){
    const activeDeck = this.state.activeDeck;
    const playerDeck = this.state.playerDeck;
    // later use commented instead of current generation of scoring for when flipped happens
    // const scoring = card.deck === playerDeck && endRow === 0 || card.deck !== playerDeck && endRow === 4;
    const scoring = card.deck === 'country' && endRow === 0 || card.deck === 'city' && endRow === 4;
    if(scoring){
      card.faceDown = true;
      if(!board[endRow].some((cell) => this.topCard(cell).deck !== activeDeck)){
        return {movesLeft: 0, movedCardValue: [], winner: activeDeck, activeDeck: null}
      }
    }
    return {movesLeft: movesLeft, movedCardValue: movedCardValue, winner: null}
  }

  cancelMove(){
    if (this.state.movement.active) {
      const board = this.state.board.slice();
      this.clearStatuses(board);
      this.setState({board, preppedMove: {}, movement: {active: false, startingLocation: []}});
    }
  }

  docKeyup(event){
    if(event.keyCode === 27){
      this.cancelMove();
    }
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
          modifier(card);
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
    return startCard.deck === end.deck && end.value > startCard.value;
  }

  adjacentLegal(startCard, endRow, endCol){
    if( endRow > 4 || endRow < 0 || endCol > 2 || endCol < 0 ){
      return false;
    }
    const endCell = this.state.board[endRow][endCol];
    const end = this.topCard(endCell);
    if(!end.deck){ // not a card
      return true;
    }else if(end.faceDown){ // pile has scored
      return false;
    }else if(startCard.deck === end.deck){ // moving onto ally
      return true;
    }else if(this.isSnuggle(startCard, end)){ // snuggling
      return true;
    }else{ // illegal
      return false;
    }
  }

  isSnuggle(startCard, endCard){
    return startCard.deck !== endCard.deck && startCard.value >= endCard.value;
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
    if(card.deck !== this.state.activeDeck
      || (!this.props.isLocal && card.deck !== this.state.playerDeck)
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

  generateRowModifier(index, isFlipped) {
    const rowParity = `board__row--${index % 2 ? 'even' : 'odd'}`;
    if (index === 0  && isFlipped || index === 4 && !isFlipped) {
      return `${rowParity} board__row--country`;
    } else if (index === 0  && !isFlipped || index === 4 && isFlipped) {
      return `${rowParity} board__row--city`;
    } else {
      return rowParity;
    }
  }

  isSelectedCell (rowIndex, colIndex) {
    const isCorrectRow = this.state.movement.startingLocation[0] === (this.state.isFlippedBoard ? 4 - rowIndex : rowIndex);
    const isCorrectCol = this.state.movement.startingLocation[1] === (this.state.isFlippedBoard ? 2 - colIndex : colIndex);
    return  this.state.movement.active && isCorrectRow && isCorrectCol;
  }

  closeModal () {
    this.setState({renderResignModal: false})
  }

  toggleRenderResignModal () {
    this.setState({renderResignModal: !this.state.renderResignModal});
  }

  renderGameBoard () {
    let gameContents = <h2>Waiting for your opponent to connect...</h2>;
    if (this.state.isOpponentConnected || this.state.winner) {
      const isFlipped = this.state.isFlippedBoard;
      const board = isFlipped ? this.flippedBoard() : this.state.board;
      gameContents = board.map((row, rowIndex) => {
        const rowIdx = isFlipped ? (4 - rowIndex) : rowIndex;
        const modifier = this.generateRowModifier(rowIndex, isFlipped)
        return <div key={`row${rowIdx}`} className={`board__row ${modifier}`}>
          {row.map((cell, colIndex) => {
            const col = isFlipped ? (2 - colIndex) : colIndex;
            const selected = this.isSelectedCell(rowIndex, colIndex);
            const hasHover = this.state.preppedMove.location && this.state.preppedMove.location[0] === rowIndex && this.state.preppedMove.location[1] === colIndex;
            return  <Cell
                      key={`column${rowIdx}${col}`}
                      cards={cell.cards}
                      highlighted={cell.highlighted}
                      highlightMoves={this.highlightMoves.bind(this, rowIdx, col)}
                      selected={selected}
                      cancelMove={this.cancelMove}
                      confirmMove={this.state.confirmMove}
                      getCardUrl={this.getCardUrl}
                      moveCard={this.moveCard.bind(this, rowIdx, col)}
                      showStack={this.showStack.bind(this, rowIdx, col)}
                      hideStack={this.hideStack}
                      setPreppedMove={this.state.confirmMove && this.setPreppedMove.bind(this, [rowIndex, colIndex])}
                      hoverCard={hasHover && this.state.preppedMove.card}
                    />
          })}
        </div>
      });
    }
    return gameContents;
  }

  renderResignModal () {
    return (
      <Modal
        closeModal={this.toggleRenderResignModal}
        firstFocusId="modalHeading"
        returnFocusTo="resignButton"
        tabbableElementIds={['quitButton', 'cancelButton']}
      >
        <h1
          className="modal__heading"
          id="modalHeading"
          tabIndex="-1"
        >Resign game</h1>
        <p className="modal__body">Are you sure you want to quit? You will forefit the game!</p>
        <div className="modal__button-container">
        <button
          id="quitButton"
          className="modal__button modal__button--quit"
          onClick={this.resign}
          >Quit game</button>
        <button
          id="cancelButton"
          className="modal__button modal__button--cancel"
          onClick={this.toggleRenderResignModal}
        >Cancel</button>
        </div>
      </Modal>
    );
  }

  render() {
    return(
      <div className='game-container'>
        <PlayerIcons
          flipped={this.state.isFlippedBoard}
          active={this.state.activeDeck}
          playersData={this.props.playersData}
          movesLeft={this.state.movesLeft}
          banners={this.props.assets.banners}
          winner={this.state.winner}
        />
        <div id='main-game-container' className="board">
          {this.renderGameBoard()}
        </div>
        <div className="game-container__right-cell">
          <button
            className={`resign-game-button resign-game-button--${this.state.playerDeck}`}
            onClick={this.state.winner ? this.resign : this.toggleRenderResignModal}
            id="resignButton"
          >
            RETURN TO LOBBY
          </button>
          <StackPreview
            cards={this.state.stackView ? this.state.board[this.state.stackView.row][this.state.stackView.col].cards.map((i) => i).reverse() : []}
            getCardUrl={this.getCardUrl}
          />
          {this.state.winner ?
            <WinnerNotification
              winner={this.state.winner}
              playerDeck={this.state.playerDeck}
              icons={this.props.assets.icons}
              rematchRequested={this.state.rematchRequested}
              rematch={this.state.rematchRequested ? this.acceptRematch : this.requestRematch}
              isOpponentPresent={this.state.isOpponentConnected}
              requestPending={this.state.requestPending}
            />
            : <MoveConfirmation
              confirmMove={this.state.confirmMove}
              toggleConfirmMove={this.toggleConfirmMove}
              makeMove={this.state.preppedMove.boundMoveFunction}
              cancelMove={this.cancelMove}
              movement={this.state.movement}
              assets={this.props.assets.moveConfirmation}
              preppedMove={this.state.preppedMove}
            />
          }
        </div>
        {this.state.renderResignModal && this.renderResignModal()}
      </div>
    );
  }
}

export default Game;
