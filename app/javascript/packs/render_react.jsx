import React from 'react'
import ReactDOM from 'react-dom'
import Game from './Components/Game'

document.addEventListener('DOMContentLoaded', () => {
  const game = document.getElementById('game');

  if(!!document.getElementById('game')) {
    const gameData = JSON.parse(game.dataset.boardState);
    const playerDeck = game.dataset.playerDeck;
    const cityFlippedUrl = game.dataset.cityFlippedUrl;
    const countryFlippedUrl = game.dataset.countryFlippedUrl;
    ReactDOM.render(<Game gameData={gameData} playerDeck={playerDeck} countryFlippedUrl={countryFlippedUrl} cityFlippedUrl={cityFlippedUrl} />, game)
  }
})
