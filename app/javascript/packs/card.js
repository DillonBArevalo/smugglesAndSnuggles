class Card {
  constructor(value, deck) {
    this.value = value;
    this.deck = deck;
    this.name = deck + value
    this.faceDown = false;
    this.snuggled = false;
    this.zIndex = 1;
    this.snuggling = [];
  }

  flip(){
    this.faceDown = !this.faceDown
    return this
  }

  static buildDeck(deck){
    const cards = [];
    for(let i=1; i<=8; i++){
      cards.push(new Card(i, deck));
    }
    return cards;
  }
}

export default Card;
