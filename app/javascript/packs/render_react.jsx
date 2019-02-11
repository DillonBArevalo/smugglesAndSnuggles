import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Components/Game';
import Lobby from './Components/Lobby';

document.addEventListener('turbolinks:load', () => {
  const game = document.getElementById('game');
  const lobby = document.getElementById('new-game-lobby-container');
  if(!!game) {
    const gameData = {
      gameData: JSON.parse(game.dataset.boardState),
      playerDeck: game.dataset.playerDeck,
      cityFlippedUrl: game.dataset.cityFlippedUrl,
      countryFlippedUrl: game.dataset.countryFlippedUrl,
      isLocal: game.dataset.isLocal === 'true',
      id: game.dataset.id,
      gameId: game.dataset.gameId,
      authToken: game.dataset.authToken,
      playersData: JSON.parse(game.dataset.playersData),
    }
    ReactDOM.render(<Game {...gameData} />, game);
  }else if(!!lobby) {
    const id = lobby.dataset.id;
    const name = lobby.dataset.name;
    ReactDOM.render(<Lobby id={id} name={name}/>, lobby);
  }
})
