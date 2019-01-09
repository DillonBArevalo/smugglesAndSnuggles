function sendGameStart ( gameComponent ) {
  gameComponent.pubnub.publish({
    message: {
      startConnection: true,
      connected: gameComponent.state.isOpponentConnected,
    },
    channel: gameComponent.state.gameId,
  });
}

function fetchKeys(component) {
  return fetch('/pnkeys')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        component.setState({pubNubError: true});
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

function fetchKeysAndEnterLobby (component, displayInvite) {
  fetchKeys(component)
    .then(pnData => {
      component.pubnub = new PubNub(pnData);

      component.pubnub.addListener({
        presence: component.modifyLobby,
        status: currySetUserState(component, pnData),
        message: component.displayInvite,
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
        channels: [gameComponent.state.gameId],
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
  } else if ( this.state.isLocal ) {
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

export { fetchKeysAndStartConnection, publishMove, sendGameUpdate, fetchKeysAndEnterLobby, challengePlayerById }
