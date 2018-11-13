import React, { Component } from 'react';

class Lobby extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentDidMount(){
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

  pingPlayer(){
    // ping another player by username
  }

  newRequest(){
    // render new request
  }

  render() {
    return(
      <div>
        <h2>Online Game Lobby:</h2>
        <div>

        </div>
      </div>
    );
  }
}

export default Lobby;
