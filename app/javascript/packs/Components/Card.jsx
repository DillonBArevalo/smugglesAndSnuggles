// react component for a single card
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: this.props.value,
      deck: this.props.deck,
      faceDown: this.props.faceDown,
      snuggled: this.props.false,
      zIndex: this.props.zIndex
    };
  }

  render() {
    return(
      <img src={this.props.url} className={`card stack-${this.state.zIndex} card--${this.state.deck}`} />
    );
  }
}

export default Card;
