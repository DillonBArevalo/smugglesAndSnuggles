// react component for a single card
import React, { Component } from 'react';

class Card extends Component {
  constructor(props){
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.generateAlt = this.generateAlt.bind(this);
  }

  clickHandler(){
    if(!(this.props.faceDown || this.props.isSmuggled)){
      if(this.props.active){
        this.props.cancelMove();
      }else{
        this.props.highlightMoves && this.props.highlightMoves();
      }
    }
  }

  generateAlt(){
    let alt = `${this.props.deck} ${this.props.value} card`;
    if (this.props.faceDown) {
      alt = `Facedown ${this.props.deck} card`;
    } else if (this.props.isOverflow) {
      // maybe use alt to list all extra cards?
      alt = 'more cards';
    }
    return alt;
  }

  render() {
    return(
      <img
        src={this.props.url}
        className={`card ${this.props.customClass || ''} card--${this.props.deck} ${this.props.selected ? 'card--selected' : ''}`}
        onClick={this.clickHandler}
        alt={this.generateAlt()}
      />
    );
  }
}

export default Card;
