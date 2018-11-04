function sendGameStart ( gameComponent ) {
  gameComponent.pubnub.publish({
    message: {startConnection: true},
    channel: gameComponent.state.gameId,
  });
}

function fetchKeysAndStartConnection ( gameComponent ) {
  fetch('pnkeys')
    .then(response => response.json())
    .then( pnData => {
      gameComponent.pubnub = new PubNub(pnData);
      gameComponent.pubnub.subscribe({
        channels: [gameComponent.state.gameId],
      });
      gameComponent.pubnub.addListener({
        message: (m) => {
          const {endRow, endCol, movement, startConnection} = m.message;
          if ( m.message.startConnection ) {
            gameComponent.setState({isOpponentConnected: true})
            !gameComponent.state.isOpponentConnected && sendGameStart( gameComponent );
          } else {
            m.publisher !== gameComponent.state.playerId && gameComponent.moveCard(endRow, endCol, false, movement);
          }
        }
      });
      sendGameStart(gameComponent);
    });
}

function publishMove (send, endRow, endCol, movesLeft, activeDeck, board, winner, moveData) {
  if( send ) {
    this.sendGameUpdate(movesLeft, activeDeck, board, winner, moveData);
    const movement = this.state.movement;
    this.pubnub.publish({
      message: {endRow, endCol, movement},
      channel: this.state.gameId,
    },
      (status, response) => console.log('publish', status, response)
    )
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

export { fetchKeysAndStartConnection, publishMove, sendGameUpdate }
