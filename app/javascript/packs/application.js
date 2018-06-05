/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import Game from './game';
import Card from './card';
import Visualizer from './visualizer';
console.log('Hello World from Webpacker');
let game = new Game
console.log( game );
console.log( game.legalMoves(0,0))

