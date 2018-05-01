import Card from './card';

class Game {
  constructor(player1, player2, board){
    this.player1 = player1 || 1;
    this.player2 = player2 || 2;
    this.board = board || this.constructNewBoard()
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
                      [cityCards.pop(), cityCards.pop().flip()],
                      [],
                      []
                    ],
                    [
                      [],
                      ['law' + lawNum],
                      []
                    ],
                    [
                      [],
                      [],
                      [countryCards.pop(), countryCards.pop().flip()]
                    ],
                    [
                      [countryCards.pop(), countryCards.pop().flip()],
                      [countryCards.pop(), countryCards.pop().flip()],
                      [countryCards.pop(), countryCards.pop().flip()]
                    ]
                  ];
    return board
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
}

export default Game;
