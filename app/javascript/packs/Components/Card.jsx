// react component for a single card
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component {
  constructor(props){
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    if(!(this.props.faceDown || this.props.deck === 'laws' || this.props.isSmuggled)){
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
        className={`card stack-${this.props.zIndex} card--${this.props.deck}`}
        onClick={this.clickHandler}
      />
    );
  }
}

export default Card;
