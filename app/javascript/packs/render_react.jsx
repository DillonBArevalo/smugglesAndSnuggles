import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Components/Game';
import Lobby from './Components/Lobby';
import Profile from './Components/Profile';

document.addEventListener('turbolinks:load', () => {
  const game = document.getElementById('game');
  const lobby = document.getElementById('new-game-lobby-container');
  const profile = document.getElementById('profile-edit-picture-button');
  if(!!game) {
    const gameData = {
      gameData: JSON.parse(game.dataset.boardState),
      playerDeck: game.dataset.playerDeck,
      assets: JSON.parse(game.dataset.assets),
      isLocal: game.dataset.isLocal === 'true',
      id: game.dataset.id,
      gameId: game.dataset.gameId,
      authToken: game.dataset.authToken,
      playersData: JSON.parse(game.dataset.playersData),
    }
    ReactDOM.render(<Game {...gameData} />, game);
  } else if (!!lobby) {
    const id = lobby.dataset.id;
    const name = lobby.dataset.name;
    ReactDOM.render(<Lobby id={id} name={name}/>, lobby);
  } else if (!!profile) {
    ReactDOM.render(<Profile triggerId="profile-edit-picture-button" imgSrc={profile.dataset.imgSrc} />, profile);
  }

  function unmount () {
    game && ReactDOM.unmountComponentAtNode(game);
    lobby && ReactDOM.unmountComponentAtNode(lobby);
    document.removeEventListener('turbolinks:before-render', unmount);
  }

  document.addEventListener('turbolinks:before-render', unmount);
});
