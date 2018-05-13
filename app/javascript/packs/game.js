import Card from './card';

class Game {
  constructor(player1, player2, board){
    this.player1 = player1 || 1;
    this.player2 = player2 || 2;
    this.board = board || this.constructNewBoard();
  }

  constructNewBoard(){
    const lawNum = Math.ceil(Math.random() * 4);
    const cityCards = this.shuffleArray(Card.buildDeck('city'));
    const countryCards = this.shuffleArray(Card.buildDeck('country'));
    const board = [
                    [
                      [cityCards.pop(), cityCards.pop().flip()],
                      [cityCards.pop(), cityCards.pop().flip()],
                      [cityCards.pop(), cityCards.pop().flip()]
                    ],
                    [
                      [cityCards.pop(), cityCards.pop().flip()],[],[]
                    ],
                    [
                      [],['law' + lawNum],[]
                    ],
                    [
                      [],[],[countryCards.pop(), countryCards.pop().flip()]
                    ],
                    [ [countryCards.pop(), countryCards.pop().flip()],
                      [countryCards.pop(), countryCards.pop().flip()],
                      [countryCards.pop(), countryCards.pop().flip()]
                    ]
                  ];
    return board;
  }

  legalMoves(startRow, startCol){
    const possibleMoves = [[],[],[],[],[]];
    possibleMoves[startRow][startCol] = false;
    this.buildLegalMovesBoard(possibleMoves, startRow, startCol, this.board[startRow][startCol][0]);
    return this.constructSingleListFromMovesBoard(possibleMoves);
  }

  buildLegalMovesBoard(possibleMoves, startRow, startCol, card) {
    // dynamic, recursive. For all neighbors, checks if legal, then, if smuggle, run on that space.
    let endRow = startRow + 1 > 2 ? startRow : startRow + 1;
    let endCol = startCol + 1 > 4 ? startCol : startCol + 1;
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
    const end = this.board[endRow][endCol][0];
    return typeof end === 'object' && startCard.deck === end.deck && end.value > startCard.value;
  }

  adjacentLegal(startCard, endRow, endCol){
    if( endRow > 2 || endRow < 0 || endCol > 4 || endCol < 0 ){
      return false;
    }
    console.log('endRow', endRow, 'endCol', endCol);
    const end = this.board[endRow][endCol][0]
    if( typeof end !== 'object'){ // not a card
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

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default Game;
