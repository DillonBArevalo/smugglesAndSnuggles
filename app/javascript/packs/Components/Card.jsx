// react component for a single card
import React, { Component } from 'react';

class Card extends Component {
  constructor(props){
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    if(!(this.props.faceDown || this.props.isSmuggled)){
      if(this.props.active){
        this.props.cancelMove();
      }else{
        this.props.highlightMoves();
      }
    }
  }

  render() {
    return(
      <img
        src={this.props.url}
        className={`card ${this.props.stackClass} card--${this.props.deck} ${this.props.selected ? 'card--selected' : ''} ${this.props.class || ''}`}
        onClick={this.clickHandler}
        alt={this.props.faceDown ? `Facedown ${this.props.deck} card` : `${this.props.deck} ${this.props.value} card`}
      />
    );
  }
}

export default Card;
