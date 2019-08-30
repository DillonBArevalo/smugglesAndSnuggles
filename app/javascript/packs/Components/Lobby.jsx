import React, { Component } from 'react';
import Player from "./Player";
import { enterLobby } from "../modules/apiRequests";

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: {},
      challengeMessage: '',
      requests: [],
    };

    this.messageResponseMapper = {
      join: 'addNewPlayer',
      leave: 'removePlayer',
    }
    this.handleMessage = this.handleMessage.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  componentDidMount(){
    enterLobby(this, this.handleMessage, {
      id: this.props.id,
      name: this.props.name,
    });
    window.addEventListener('beforeunload', this.cleanUp);
  }

  componentWillUnmount(){
    window.removeEventListener('beforeunload', this.cleanUp);
    this.cleanUp();
  }

  cleanUp () {
    this.channel.leave();
    // there's a race condition here where if you disconnect first it will ignore
    // the leave message and other components won't remove this user from the list
    window.setTimeout(() => this.channel.consumer.disconnect(), 500);
  }

  removePlayer (playerDetails) {
    const players = Object.assign({}, this.state.players);
    players[playerDetails.id] && delete players[playerDetails.id];

    this.setState({players});
  }

  addNewPlayer (playerDetails, targeted) {
    const players = Object.assign(
      {},
      this.state.players,
      {
        [ playerDetails.id ]: playerDetails
      }
    )
    this.setState({players});

    !targeted && this.channel.send({
      type: 'join',
      recipient: playerDetails.id,
      playerDetails: {
        id: this.props.id,
        name: this.props.name,
      },
    })
  }

  handleMessage (message) {
    if (message.playerDetails.id !== this.props.id && (!message.recipient || message.recipient === this.props.id)) {
      this[this.messageResponseMapper[message.type]](message.playerDetails, !!message.recipient);
    }
  }

  renderPlayer (playerData, type, callbacks) {
    return (
      <Player
        name={playerData.name}
        id={playerData.id}
        key={`${type}-${playerData.id}`}
        type={type}
        {...callbacks}
      />
    );
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
                request => {return this.renderPlayer(this.state.players[request.id], 'request')}
              )}
            </ul>
          </div>
          <div className="lobby__players-online-container">
            <h3 className="lobby__grouping-heading">Players Online <hr className="lobby__heading-rule" aria-hidden="true"/></h3>
            <ul className="lobby__player-list">
              {Object.keys(this.state.players).map(
                playerId => {
                  const player = this.state.players[playerId];
                  return !player.isRequested && this.renderPlayer(
                    player,
                    player.type || 'default',
                    // {challenge: this.placeholder.bind(this, this.state.players[playerId])}
                  );
                }
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
