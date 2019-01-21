import React, { Component } from 'react';
import Player from "./Player";
import ChallengeTile from "./ChallengeTile";
import ChallengeRequests from "./ChallengeRequests";
import {fetchKeysAndEnterLobby, challengePlayerById} from "../modules/apiRequests";

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: {},
      selectedPlayer: null,
      id: Number(this.props.id),
      challengeMessage: '',
      requests: [],
      name: this.props.name,
    };
    this.pingPlayerById = this.pingPlayerById.bind(this);
    this.modifyLobby = this.modifyLobby.bind(this);
    this.setPlayerInviteStatus = this.setPlayerInviteStatus.bind(this);
    this.challengePlayerById = challengePlayerById.bind(this, this.setPlayerInviteStatus);
    this.updateChallengeMessage = this.updateChallengeMessage.bind(this);
    this.displayInvite = this.displayInvite.bind(this);
  }

  componentDidMount(){
    fetchKeysAndEnterLobby(this);
  }

  setPlayerInviteStatus (status, response) {
    if (!status.error) {
      const selectedPlayer = Object.assign({}, this.state.selectedPlayer, {requestSent: true});
      this.setState({selectedPlayer});
    }
  }

  displayInvite (message) {
    if (message.message.type === 'challenge' && message.message.foe === this.state.id) {
      const requests = this.state.requests;
      requests.push({
        id: message.message.challengerId,
        name: message.message.challengerName,
        message: message.message.message,
      });
      this.setState({requests});
    }
  }

  updateChallengeMessage (event) {
    this.setState({challengeMessage: event.target.value});
  }

  // this probably wants to move to apiRequests
  modifyLobby (presenceEvent) {
    const players = this.state.players;
    let selectedPlayer = this.state.selectedPlayer;
    if (presenceEvent.action === 'state-change') {
      if (presenceEvent.state && this.state.id !== presenceEvent.state.id) {
        players[presenceEvent.state.id] = presenceEvent.state;
      }
    } else if (presenceEvent.action === 'leave' && presenceEvent.state) {
      delete players[presenceEvent.state.id];
      if (selectedPlayer && presenceEvent.state.id === selectedPlayer.id) {
        selectedPlayer = null;
      }
    }
    this.setState({players, selectedPlayer});
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
    this.setState({selectedPlayer, challengeMessage: ''});
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
            <ChallengeTile
              player={this.state.selectedPlayer}
              challenge={this.challengePlayerById}
              challengeMessage={this.state.challengeMessage}
              updateChallengeMessage={this.updateChallengeMessage}
            />
          </div>
          <ChallengeRequests requests={this.state.requests} />
        </div>
      </div>
    );
  }
}

export default Lobby;
