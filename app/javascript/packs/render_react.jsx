import React from 'react'
import ReactDOM from 'react-dom'
import Game from './Components/Game'

document.addEventListener('DOMContentLoaded', () => {
  const game = document.getElementById('game')
  if(!!document.getElementById('game')) {
    ReactDOM.render(<Game />, game)
  }
})
