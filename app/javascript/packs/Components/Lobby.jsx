import React, { Component } from 'react';
import Player from "./Player";
import { enterLobby } from "../modules/apiRequests";

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: {},
      challengeMessage: '',
      pending: false,
    };

    this.messageResponseMapper = {
      join: 'addNewPlayer',
      leave: 'removePlayer',
      request: 'receiveRequest',
      ignore: 'receiveRequestIgnored',
      accept: 'receiveRequestAccepted',
      startGame: 'startGame',
    }
    this.cleanUp = this.cleanUp.bind(this);
    this.invite = this.invite.bind(this);
    this.ignoreRequest = this.ignoreRequest.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  componentDidMount(){
    enterLobby(this, this.handleMessage.bind(this), {
      id: this.props.id,
      name: this.props.name,
    });
    window.addEventListener('beforeunload', this.cleanUp);
  }

  componentWillUnmount(){
    this.acceptTimeout && window.clearTimeout(this.acceptTimeout);
    window.removeEventListener('beforeunload', this.cleanUp);
    this.cleanUp();
  }

  cleanUp () {
    this.channel.leave();
    // there's a race condition here where if you disconnect first it will ignore
    // the leave message and other components won't remove this user from the list
    window.setTimeout(() => this.channel.consumer.disconnect(), 500);
  }

  removePlayer ({playerDetails}) {
    const players = Object.assign({}, this.state.players);
    players[playerDetails.id] && delete players[playerDetails.id];

    this.setState({players});
  }

  addNewPlayer ({playerDetails, recipient}) {
    const players = Object.assign(
      {},
      this.state.players,
      {
        [ playerDetails.id ]: playerDetails
      }
    )
    this.setState({players});

    !recipient && this.channel.sendUpdate('join', playerDetails.id)
  }

  handleMessage (message) {
    if (message.playerDetails.id !== this.props.id && (!message.recipient || message.recipient === this.props.id)) {
      this[this.messageResponseMapper[message.type]](message);
    }
  }

  receiveRequest ({playerDetails}) {
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

  receiveRequestIgnored ({playerDetails}) {
    this.modifyPlayer(playerDetails.id, {type: 'rejected'});
    window.setTimeout(
      this.modifyPlayer.bind(this, playerDetails.id, {type: 'default'}),
      5000
    );
  }

  receiveRequestAccepted ({playerDetails, url}) {
    this.channel.sendUpdate('startGame', playerDetails.id, {url})
    window.setTimeout(() => window.location.href = url, 500);
  }

  startGame ({url, errors}) {
    window.location.href = url;
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
    this.channel.sendUpdate('request', recipient)
    this.modifyPlayer(recipient, {type: 'pending'});
  }

  ignoreRequest (recipient) {
    this.channel.sendUpdate('ignore', recipient)
    this.modifyPlayer(recipient, {isRequested: false});
  }

  acceptRequest (recipient) {
    this.channel.sendUpdate(
      'accept',
      recipient,
      {
        isLocal: false,
        player1: this.props.id,
        player2: recipient,
      }
    );
    this.setState({pending: true});
    this.acceptTimeout = window.setTimeout(() => {
      this.setState({pending: false});
      window.alert('Something went wrong. the request could not be accepted.');
    }, 5000);
  }

  renderPlayer (playerData, type, callbacks, pending) {
    return (
      <Player
        name={playerData.name}
        id={playerData.id}
        key={`${type}-${playerData.id}`}
        type={type}
        {...callbacks}
        pending={pending}
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
                    {
                      ignore: this.ignoreRequest,
                      accept: this.acceptRequest,
                    },
                    this.state.pending
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
                    {invite: this.invite},
                    this.state.pending
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
