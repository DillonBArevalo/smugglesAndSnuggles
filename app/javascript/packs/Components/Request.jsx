import React, { Component } from 'react';

class Request extends Component {
  render() {
    return (
      <div className="challenge-request">
        <p>The following player has issued you a challenge: {this.props.name}</p>
          {this.props.message &&<blockquote>{this.props.message}</blockquote>}
          <button
            className="challenge-request__accept-button"
            onClick={this.props.confirmInvitation}
          >
            Accept Challenge
          </button>
      </div>
    );
  }
}

export default Request;
