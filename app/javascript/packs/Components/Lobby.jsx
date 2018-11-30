import React, { Component } from 'react';
import Player from "./Player"
import ChallengeTile from "./ChallengeTile"

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: [],
      selectedPlayer: null,
    }
    this.pingPlayerById = this.pingPlayerById.bind(this);
  }

  componentDidMount(){
    const mockData = [
      {
        id: 1,
        name: "player1",
      },
      {
        id: 2,
        name: "player2",
      },
      {
        id: 3,
        name: "player3",
      },
      {
        id: 4,
        name: "player4",
      },
      {
        id: 5,
        name: "player5",
      },
    ];
    this.setState({players: mockData});
    // connect pubnub and generate list
  }

  componentWillUnmount(){
    // disconnect pubnub and send message of removal
    // might have to do a timer?
  }

  addPlayer(){
    //run when pubnub receives a new message that a new player has joined
  }

  removePlayer(){
    // ru
  }

  pingPlayerById(){
    // ping another player by id
    const id = this.state.selectedPlayer.id;
    console.log(id);
  }

  newRequest(){
    // render new request
  }

  popup(selectedPlayer){
    console.log(selectedPlayer)
    this.setState({selectedPlayer});
  }

  render() {
    return(
      <div className="lobby">
        <h2>Online Game Lobby:</h2>
        <p>
          To play an online game select a potential opponent from the list below to challenge them to a match!
        </p>
        <div className="lobby__players-tile">
          <div className="lobby__player-container">
            {this.state.players.map( player => <Player name={player.name} id={player.id} key={player.id} popup={this.popup.bind(this, player)}/>)}
          </div>
          <div className="lobby__challenge-tile">
            <ChallengeTile player={this.state.selectedPlayer} challenge={this.pingPlayerById}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
