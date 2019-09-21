import { createConsumer } from '@rails/actioncable';

function createSubscription (component, channel, room, callbacks) {
  component.channel = createConsumer().subscriptions.create({channel, room}, callbacks)
}

export function enterGame (component, received, playerId, gameId, isLocal) {
  createSubscription(component, 'GameChannel', `game${gameId}`, {
    received,
    connected () {
      this.send({
        type: 'join',
        gameId,
        playerId,
        isLocal,
        isInitialJoin: true,
      });
    },
    sendUpdate(type, additionalArgs = {}) {
      this.send({type, gameId, isLocal, playerId, ...additionalArgs});
    }
  });
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

// export function fetchKeysAndStartConnection ( gameComponent ) {
//   fetchKeys(gameComponent)
//     .then( pnData => {
//       gameComponent.pubnub = new PubNub(pnData);
//       gameComponent.pubnub.subscribe({
//         channels: [gameComponent.props.gameId],
//       });
//       gameComponent.pubnub.addListener({
//         message: (m) => {
//           const {endRow, endCol, movement, startConnection, connected} = m.message;
//           if ( startConnection && m.publisher !== gameComponent.state.playerId ) {
//             gameComponent.setState({isOpponentConnected: true});
//             !connected && sendGameStart( gameComponent );
//           } else {
//             m.publisher !== gameComponent.state.playerId && gameComponent.moveCard(endRow, endCol, false, movement);
//           }
//         },
//         status: (s) => {
//           if (s.error || s.category === "PNNetworkDownCategory") {
//             gameComponent.setState({pubNubError: true});
//           }
//         }
//       });
//       sendGameStart(gameComponent);
//     });
// }

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
