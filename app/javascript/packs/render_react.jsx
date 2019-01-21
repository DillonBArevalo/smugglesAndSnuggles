import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Components/Game';
import Lobby from './Components/Lobby';

document.addEventListener('turbolinks:load', () => {
  const game = document.getElementById('game');
  const lobby = document.getElementById('new-game-lobby-container');
  if(!!game) {
    const gameData = JSON.parse(game.dataset.boardState);
    const playerDeck = game.dataset.playerDeck;
    const cityFlippedUrl = game.dataset.cityFlippedUrl;
    const countryFlippedUrl = game.dataset.countryFlippedUrl;
    const isLocal = game.dataset.isLocal === 'true';
    const id = game.dataset.id;
    const gameId = game.dataset.gameId;
    const authToken = game.dataset.authToken;
    ReactDOM.render(
      <Game
        gameData={gameData}
        id={id}
        gameId={gameId}
        playerDeck={playerDeck}
        countryFlippedUrl={countryFlippedUrl}
        cityFlippedUrl={cityFlippedUrl}
        isLocal={isLocal}
        authToken={authToken}
      />,
      game
    );
  }else if(!!lobby) {
    const id = lobby.dataset.id;
    const name = lobby.dataset.name;
    ReactDOM.render(<Lobby id={id} name={name}/>, lobby);
  }
})
