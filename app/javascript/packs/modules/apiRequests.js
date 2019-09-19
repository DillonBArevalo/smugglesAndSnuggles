import { createConsumer } from '@rails/actioncable';

function createSubscription (component, channel, room, callbacks) {
  component.channel = createConsumer().subscriptions.create({channel, room}, callbacks)
}

export function enterLobby (component, received, playerDetails) {
  createSubscription(component, 'LobbyChannel', 'lobby', {
    connected () {
      this.send({
        type: 'join',
        playerDetails,
      });
    },
    received,
    leave () {
      this.send({
        type: 'leave',
        playerDetails,
      });
    },
    sendUpdate (type, recipient, additionalArgs={}) {
      this.send({type, recipient, playerDetails, ...additionalArgs});
    }
  });
}

// no longer necessary
function fetchKeys (component) {
  return fetch('/pnkeys')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        component.setState({pubNubError: true});
      }
    });
}

export function fetchKeysAndStartConnection ( gameComponent ) {
  fetchKeys(gameComponent)
    .then( pnData => {
      gameComponent.pubnub = new PubNub(pnData);
      gameComponent.pubnub.subscribe({
        channels: [gameComponent.props.gameId],
      });
      gameComponent.pubnub.addListener({
        message: (m) => {
          const {endRow, endCol, movement, startConnection, connected} = m.message;
          if ( m.message.startConnection && m.publisher !== gameComponent.state.playerId ) {
            gameComponent.setState({isOpponentConnected: true});
            !connected && sendGameStart( gameComponent );
          } else {
            m.publisher !== gameComponent.state.playerId && gameComponent.moveCard(endRow, endCol, false, movement);
          }
        },
        status: (s) => {
          if (s.error || s.category === "PNNetworkDownCategory") {
            gameComponent.setState({pubNubError: true});
          }
        }
      });
      sendGameStart(gameComponent);
    });
}

export function publishMove (send, endRow, endCol, movesLeft, activeDeck, board, winner, moveData) {
  const gameComponent = this;
  if( send ) {
    this.sendGameUpdate(movesLeft, activeDeck, board, winner, moveData);
    const movement = this.state.movement;
    this.pubnub.publish(
      {
        message: {endRow, endCol, movement},
        channel: this.state.gameId,
      },
      (status, response) => {
        if (status.error) {
          gameComponent.setState({pubNubError: true});
        }
      }
    );
  } else if ( this.props.isLocal ) {
    this.sendGameUpdate(movesLeft, activeDeck, board, winner, moveData);
  }
}

export function sendGameUpdate(movesLeft, activeDeck, board, winner, moveData) {
  const {playerDeck, playerId, gameId} = this.state;
  const authenticity_token = this.props.authToken;
  const data = JSON.stringify({movesLeft, activeDeck, board, playerDeck, playerId, winner, authenticity_token, moveData});
  fetch(
    `/games/${this.props.gameId}`,
    {
      method: 'PATCH',
      body: data,
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      }
    }
  );
}
