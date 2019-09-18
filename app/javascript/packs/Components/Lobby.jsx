import React, { Component } from 'react';
import Player from "./Player";
import { enterLobby } from "../modules/apiRequests";

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: {},
      challengeMessage: '',
    };

    this.messageResponseMapper = {
      join: 'addNewPlayer',
      leave: 'removePlayer',
      request: 'receiveRequest',
      ignore: 'receiveRequestIgnored',
    }
    this.handleMessage = this.handleMessage.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.invite = this.invite.bind(this);
    this.ignoreRequest = this.ignoreRequest.bind(this);
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

  receiveRequest ( playerDetails ) {
    if(!this.alreadyRequested(playerDetails.id)) {
      const {players} = this.state;
      const player = Object.assign({}, players[playerDetails.id]);
      player.isRequested = true;
      const newPlayers = Object.assign({}, players, {[playerDetails.id]: player});
      this.setState({players: newPlayers});
    }
  }

  alreadyRequested (playerId) {
    return this.state.players[playerId].isRequested;
  }

  receiveRequestIgnored (playerDetails) {
    console.log('rejecting');
    this.modifyPlayer(playerDetails.id, {type: 'rejected'});
    window.setTimeout(
      this.modifyPlayer.bind(this, playerDetails.id, {type: 'default'}),
      5000
    );
  }


  modifyPlayer (playerId, propsToChange) {
    const {players} = this.state;
    const player = Object.assign({}, players[playerId]);
    Object.keys(propsToChange).forEach(prop => {
      player[prop] = propsToChange[prop];
    });
    const newPlayers = Object.assign({}, players, {[playerId]: player});
    this.setState({players: newPlayers});
  }

  invite (recipient) {
    const {id, name} = this.props;
    const playerDetails = {id, name};
    this.channel.send({
      type: 'request',
      recipient,
      playerDetails,
    });
    this.modifyPlayer(recipient, {type: 'pending'});
  }

  ignoreRequest (recipient) {
    const {id, name} = this.props;
    const playerDetails = {id, name};
    this.channel.send({
      type: 'ignore',
      recipient: recipient,
      playerDetails,
    })
    this.modifyPlayer(recipient, {isRequested: false});
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
              {Object.keys(this.state.players).map(
                playerId => {
                  const player = this.state.players[playerId];
                  return player.isRequested && this.renderPlayer(
                    this.state.players[playerId],
                    'request',
                    {ignore: this.ignoreRequest}
                  );
                }
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
                    {invite: this.invite}
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
