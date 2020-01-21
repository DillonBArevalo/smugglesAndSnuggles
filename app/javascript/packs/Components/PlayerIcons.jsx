import React, { Component } from 'react';

const MOVE_CONTAINER_HEIGHT = 3;
const TURN_MARGIN_HEIGHT = 1;
const PICTURE_CONTAINER_MARGIN_HEIGHT = 3;
const STATIC_ITEMS_HEIGHT = MOVE_CONTAINER_HEIGHT + TURN_MARGIN_HEIGHT + PICTURE_CONTAINER_MARGIN_HEIGHT;
const WRAPPING_WIDTHS_IN_PX = {
  country: [1337, 787],
  city: [1076, 749]
};
const LINE_HEIGHT = 2.5;

const getActivePlayerTextHeight = (screenWidth, deck) => {
  const numberOfLines = WRAPPING_WIDTHS_IN_PX[deck].reduce(
    (wraps, size) => size < screenWidth ? wraps + 1 : wraps,
    1
  );
  return numberOfLines * LINE_HEIGHT;
};

const getImageHeight = (deck, isActive) => {
  const userPane = ((isActive ? 0.6 : 0.4) * document.body.offsetHeight) / 16;
  const playerTextHeight = isActive ? getActivePlayerTextHeight(document.body.offsetWidth, deck) : 0;
  return userPane - STATIC_ITEMS_HEIGHT - playerTextHeight;
};

const getImageSize = (containerWidth, deck, isActive) => {
  const usableWidth = (containerWidth / 16) - 1;
  return Math.min(usableWidth, getImageHeight(deck, isActive));
}

const getAllImageSizes = containerWidth => ({
  city: {
    active: getImageSize(containerWidth, 'city', true),
    notActive: getImageSize(containerWidth, 'city', false),
  },
  country: {
    active: getImageSize(containerWidth, 'country', true),
    notActive: getImageSize(containerWidth, 'country', false),
  }
});

class PlayerIcons extends Component {
  constructor(props){
    super(props);
    this.mapping = {
      country: this.props.flipped ? 'top' : 'bottom',
      city: this.props.flipped ? 'bottom' : 'top',
      top: this.props.flipped ? 'country' : 'city',
      bottom: this.props.flipped ? 'city' : 'country',
    }
    const defaultContainerWidth = document.body.offsetWidth * 0.3;
    this.state = {
      imageSizes: getAllImageSizes(defaultContainerWidth)
    };
  }

  getPlayerData(position, key) {
    return this.props.playersData[this.mapping[position]][key]
  }

  generateUserPicture(position, isActive){
    const deck = this.mapping[position];
    const imageSize = `${this.state.imageSizes[deck][isActive ? 'active' : 'notActive']}rem`;
    const imageStyle = {height: imageSize, width: imageSize};
    return (
      <div className="player-icons__user-picture-container">
        {this.props.winner && this.props.winner === deck &&
          <img
            alt="Winner"
            src={this.props.banners[deck]}
            className="player-icons__winner-banner"
          />
        }
        <img
          alt={`${this.getPlayerData(position, 'username')}'s profile picture`}
          src={this.getPlayerData(position, 'url')}
          className="player-icons__profile-picture"
          style={imageStyle}
        />
        <p className={`player-icons__user-name player-icons__user-name--${deck}`}>
          {this.getPlayerData(position, 'username')}
        </p>
      </div>
    );
  }

  generateMovesCircles() {
    return [1, 2]
      .map((num)=> {
          const classes = `player-icons__move-bubble${num > this.props.movesLeft ? ' player-icons__move-bubble--hidden' : ''}`
        return (
          <span
            key={`bubble-${num}`}
            className={classes}
          ></span>
        );
      });
  }

  generateTurnData(activePosition, position) {
    const baseClass = 'player-icons__turn-data';
    const hiddenClass = activePosition !== position && `${baseClass}--hidden`;
    const attrs = {
      className: `${baseClass} ${baseClass}--${position} ${hiddenClass || ''}`,
      'aria-hidden': position !== activePosition,
    };
    return (
      <p
        {...attrs}
      >
        {`${this.mapping[position]} Bears' Turn`}
      </p>
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
    const activePosition = this.mapping[this.props.active];
    classes[this.mapping.country].push('player-icons__player-container--country');
    classes[this.mapping.city].push('player-icons__player-container--city');
    classes[activePosition].push('player-icons__player-container--active');

    return (
      <section className="player-icons" aria-label="Player information">
        <div className={classes.top.join(' ')}>
          <div className='player-icons__move-container'>
            {activePosition === 'top' &&
              <p className="player-icons__move-data" aria-label={`Moves left: ${this.props.movesLeft}`}>
                Moves: {this.generateMovesCircles()}
              </p>
            }
          </div>
          {this.generateUserPicture('top', activePosition === 'top')}
          {this.generateTurnData(activePosition, 'top')}
        </div>
        <div className={classes.bottom.join(' ')}>
          {this.generateTurnData(activePosition, 'bottom')}
          {this.generateUserPicture('bottom', activePosition !== 'top')}
          <div className='player-icons__move-container'>
            {activePosition === 'bottom' &&
              <p className="player-icons__move-data" aria-label={`Moves left: ${this.props.movesLeft}`}>
                Moves: {this.generateMovesCircles()}
              </p>
            }
          </div>
        </div>
      </section>
    );
  };
}

export default PlayerIcons;
