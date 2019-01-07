import React, { Component } from 'react';
import Player from "./Player";
import ChallengeTile from "./ChallengeTile";
import {fetchKeysAndEnterLobby} from "../modules/apiRequests";

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: {},
      selectedPlayer: null,
      id: Number(this.props.id),
    };
    this.pingPlayerById = this.pingPlayerById.bind(this);
    this.modifyLobby = this.modifyLobby.bind(this);
  }

  componentDidMount(){
    fetchKeysAndEnterLobby(this);
  }

  // this probably wants to move to apiRequests
  modifyLobby (presenceEvent) {
    const players = this.state.players;
    if (presenceEvent.action === 'state-change') {
      if (presenceEvent.state && this.state.id !== presenceEvent.state.id) {
        players[presenceEvent.state.id] = presenceEvent.state;
      }
    } else if (presenceEvent.action === 'leave' && presenceEvent.state) {
      delete players[presenceEvent.state.id];
    }
    this.setState({players});
  }

  componentWillUnmount(){
    this.pubnub.unsubscribeAll();
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
            {Object.keys(this.state.players).map(
              playerId => <Player
                            name={this.state.players[playerId].name}
                            id={playerId}
                            key={playerId}
                            popup={this.popup.bind(this, this.state.players[playerId])}
                          />)}
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
