import React, { Component } from 'react';
import Card from './Card';

class StackPreview extends Component {
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     sliderValue: 1,
  //   };
  //   this.changeSlider = this.changeSlider.bind(this);
  // }

  // changeSlider (event) {
  //   this.setState({sliderValue: event.target.value})
  // }

  render() {
    const numCards = this.props.cards.length;
    return(
      <section
        className="stack-preview"
        aria-labelledby="preview-title"
      >
        <h2 className="stack-preview__title" id="preview-title">Stack Preview</h2>
        <div className="stack-preview__stack-container">
          {this.props.cards.map((card, idx) => {
            return  <Card
              key={`${card.deck}${card.value}`}
              deck={card.deck}
              value={card.value}
              url={this.props.getCardUrl(card.deck, card.value, card.faceDown)}
              faceDown={card.faceDown}
              highlightMoves={_ => {}}
              stackClass={`stack-preview__card--${idx + 1}-of-${numCards}`}
              class="stack-preview__card"
            />
          })}
        </div>
        {/* <input
          className="stack-preview__slider"
          type="range"
          min="1"
          max={this.props.cards.length || "1"}
          value={this.state.sliderValue}
          onChange={this.changeSlider}
        /> */}
      </section>
    );
  }
}

export default StackPreview;
