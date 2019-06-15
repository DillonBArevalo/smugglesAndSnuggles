import React, { Component } from 'react';
import Player from "./Player";
import ChallengeTile from "./ChallengeTile";
import ChallengeRequests from "./ChallengeRequests";
import {fetchKeysAndEnterLobby, challengePlayerById, acceptChallenge, newGame} from "../modules/apiRequests";

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
    this.acceptChallenge = acceptChallenge.bind(this);
    this.confirmInvitation = this.confirmInvitation.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.managePlayerPresence = this.managePlayerPresence.bind(this);
    this.pingPlayerById = this.pingPlayerById.bind(this);
    this.setPlayerInviteStatus = this.setPlayerInviteStatus.bind(this);
    this.challengePlayerById = challengePlayerById.bind(this, this.setPlayerInviteStatus);
    this.updateChallengeMessage = this.updateChallengeMessage.bind(this);
  }

  componentDidMount(){
    fetchKeysAndEnterLobby(this);
  }

  confirmInvitation(data){
    this.acceptChallenge(data.id);
    // change message to accepted and disable button
  }

  setPlayerInviteStatus (status, response) {
    if (!status.error) {
      const selectedPlayer = Object.assign({}, this.state.selectedPlayer, {requestSent: true});
      this.setState({selectedPlayer});
    }
  }

  handleMessage (message) {
    if (message.message.foe === this.state.id) {
      if (message.message.type === 'challenge') {
        const requests = this.state.requests;
        requests.push({
          id: message.message.challengerId,
          name: message.message.challengerName,
          message: message.message.message,
        });
        this.setState({requests});
      } else if (message.message.type === 'accept') {
        newGame(message.message.challengerId, this);
      } else if (message.message.type === 'game start') {
        window.location.href = message.message.href;
      }
    }
  }

  updateChallengeMessage (event) {
    this.setState({challengeMessage: event.target.value});
  }

  // this probably wants to move to apiRequests?
  managePlayerPresence (presenceEvent) {
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

  placeholder(selectedPlayer){
    console.log(selectedPlayer)
    this.setState({selectedPlayer, challengeMessage: ''});
  }

  test() {
    this.setState({
      players: {
        '1': {
          name: 'name 1',
          id: '1'
        },
        '2': {
          name: 'name 2',
          id: '2'
        },
        '3': {
          name: 'name 3',
          id: '3'
        },
        '4': {
          name: 'name 4',
          id: '4'
        },
        '5': {
          name: 'name 5',
          id: '5'
        },
        '6': {
          name: 'name 6',
          id: '6'
        },
        '7': {
          name: 'name 7',
          id: '7'
        },
      },
      requests: [
        {
          id: '1',
          name: 'name 1',
          message: 'not used anymore'
        },
        {
          id: '2',
          name: 'name 2',
          message: 'not used anymore'
        },
        {
          id: '3',
          name: 'name 3',
          message: 'not used anymore'
        },
      ]
    });
  }

  render() {
    return(
      <div className="lobby">
        <h2 className="lobby__heading">Challenge Players</h2>
        <div className="lobby__container">
          <div className="lobby__pending-invite-container">
            <h3 className="lobby__grouping-heading">Pending Invites <hr className="lobby__heading-rule" aria-hidden="true"/></h3>
            <ul className="lobby__player-list">
              {this.state.requests.map(
                request => {
                  const playerData = this.state.players[request.id];
                  return <Player
                    name={playerData.name}
                    id={playerData.id}
                    key={playerData.id}
                    type="request"
                  />
                })}
            </ul>
          </div>
          <div className="lobby__players-online-container">
            <h3 className="lobby__grouping-heading">Players Online <hr className="lobby__heading-rule" aria-hidden="true"/></h3>
            <ul className="lobby__player-list">
              {Object.keys(this.state.players).map(
                playerId => <Player
                              name={this.state.players[playerId].name}
                              id={playerId}
                              key={playerId}
                              type={this.state.players.type || 'default'}
                              challenge={this.placeholder.bind(this, this.state.players[playerId])}
                            />)}
            </ul>
          </div>
          <button className="sessions__button" onClick={this.test.bind(this)}>test</button>
        </div>
        {false ?
        (<div>

          <div className="lobby__challenge-tile">
            <ChallengeTile
              player={this.state.selectedPlayer}
              challenge={this.challengePlayerById}
              challengeMessage={this.state.challengeMessage}
              updateChallengeMessage={this.updateChallengeMessage}
              />
          </div>
          <ChallengeRequests
            requests={this.state.requests}
            confirmInvitation={this.confirmInvitation}
            />

        </div>)
            : ''
          }
      </div>

    );
  }
}

export default Lobby;
