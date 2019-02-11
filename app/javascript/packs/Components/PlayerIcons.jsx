import React, { Component } from 'react';

class PlayerIcons extends Component {
  constructor(props){
    super(props);
    this.state = {
      mapping: {
        country: this.props.flipped ? 'top' : 'bottom',
        city: this.props.flipped ? 'bottom' : 'top',
        top: this.props.flipped ? 'country' : 'city',
        bottom: this.props.flipped ? 'city' : 'country',
      }
    }
    this.getPlayerData = this.getPlayerData.bind(this);
    this.generateUserPicture = this.generateUserPicture.bind(this);
  }

  getPlayerData(position, key) {
    return this.props.playersData[this.state.mapping[position]][key]
  }

  generateUserPicture(position){
    return (
      <div className="player-icons__user-data">
        <img
          alt={`user ${this.getPlayerData(position, 'username')}'s' profile picture`}
          src={this.getPlayerData(position, 'url')}
          className="player-icons__profile-picture"
        />
        <p className={`player-icons__user-name player-icons__user-name--${this.state.mapping[position]}`}>
          {this.getPlayerData(position, 'username')}
        </p>
      </div>
    );
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
          <div className="player-icons__move-data">
          </div>
          {this.generateUserPicture('top')}
        </div>
        <div className={classes.bottom.join(' ')}>
          {this.generateUserPicture('bottom')}
          <div className="player-icons__move-data">
          </div>
        </div>
      </div>
    );
  };
}

export default PlayerIcons;
