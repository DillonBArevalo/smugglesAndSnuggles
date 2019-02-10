import React, { Component } from 'react';

class PlayerIcons extends Component {
  constructor(props){
    super(props);
    this.state = {
      mapping: {
        country: this.props.flipped ? 'top' : 'bottom',
        city: this.props.flipped ? 'bottom' : 'top',
      }
    }
  }

  render() {
    const classes = {
      top: [
        'player-icons__player-container',
        'player-icons__player-container--top',
      ],
      bottom: [
        'player-icons__player-container',
        'player-icons__player-container--bottom',
      ],
    };
    classes[this.state.mapping.country].push('player-icons__player-container--country');
    classes[this.state.mapping.city].push('player-icons__player-container--city');
    classes[this.state.mapping[this.props.active]].push('player-icons__player-container--active');
    return (
      <div className="player-icons">
        <div className={classes.top.join(' ')}>

        </div>
        <div className={classes.bottom.join(' ')}>
        </div>
      </div>
    );
  };
}

export default PlayerIcons;
