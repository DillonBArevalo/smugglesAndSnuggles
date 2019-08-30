import { createConsumer } from '@rails/actioncable';

function createGameSubscription (component, room, callbacks) {
  component.channel = createConsumer().subscriptions.create({channel: 'GameChannel', room}, callbacks)
}

export function enterLobby (component, received, playerDetails) {
  createGameSubscription(component, 'lobby', {
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
      })
    },
  });
}

function sendGameStart (gameComponent) {
  gameComponent.pubnub.publish({
    message: {
      startConnection: true,
      connected: gameComponent.state.isOpponentConnected,
    },
    channel: gameComponent.state.gameId,
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

function newGame (player2, component) {
  fetch('/games', {
    method: 'POST',
    body: JSON.stringify({
      game: {is_local: false},
      player2,
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': Rails.csrfToken()
    },
    credentials: 'same-origin'
  }).then(response => {
    if (response.ok) {
      const message = {
        type: 'game start',
        foe: player2,
        href: response.url,
      };
      component.pubnub.publish({
        message,
        channel: 'gameLobby',
      });
      window.location.href = response.url;
    }
  });
}

function challengePlayerById (handleResponse, event) {
  event.preventDefault();
  const message = {
    type: 'challenge',
    foe: this.state.selectedPlayer.id,
    challengerId: this.state.id,
    challengerName: this.state.name,
    message: this.state.challengeMessage,
  };
  this.pubnub.publish(
    {
      message,
      channel: 'gameLobby',
    },
    handleResponse,
  );
}

function acceptChallenge (foe) {
  event.preventDefault();
  const message = {
    type: 'accept',
    foe,
    challengerId: this.state.id,
  };
  this.pubnub.publish(
    {
      message,
      channel: 'gameLobby',
    }
  );
}

function currySetUserState (component, pnData) {
  return function setUserState(statusEvent) {
    if (statusEvent.category === "PNConnectedCategory") {
      component.pubnub.setState({
        channels: ['gameLobby'],
        state: {
          name: component.state.name,
          id: pnData.uuid,
        },
        uuid: pnData.uuid,
      },
      () => {
        component.pubnub.hereNow(
          {
            channels: ["gameLobby"],
            includeUUIDs: true,
            includeState: true,
          },
          currySetupPlayersList(component)
        );
      });
    }
  }
}

function currySetupPlayersList (component) {
  return (status, response) => {
          const channelOccupants = response.channels.gameLobby.occupants;
          const players = channelOccupants.reduce(
            (players, stateObj) => {
              if(stateObj && stateObj.state && stateObj.state.id !== component.state.id) {
                players[stateObj.state.id] = stateObj.state;
              }
              return players;
            },
            {}
          );
          component.setState({players});
        }
}

function fetchKeysAndEnterLobby (component) {
  fetchKeys(component)
    .then(pnData => {
      component.pubnub = new PubNub(pnData);

      component.pubnub.addListener({
        presence: component.managePlayerPresence,
        status: currySetUserState(component, pnData),
        message: component.handleMessage,
      });

      component.pubnub.subscribe({
        channels: ['gameLobby'],
        withPresence: true,
      });
    });
}

function fetchKeysAndStartConnection ( gameComponent ) {
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

function publishMove (send, endRow, endCol, movesLeft, activeDeck, board, winner, moveData) {
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

function sendGameUpdate(movesLeft, activeDeck, board, winner, moveData) {
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

export { newGame, acceptChallenge, fetchKeysAndStartConnection, publishMove, sendGameUpdate, fetchKeysAndEnterLobby, challengePlayerById }
