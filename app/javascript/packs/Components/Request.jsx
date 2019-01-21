import React, { Component } from 'react';

class Request extends Component {
  render() {
    return (
      <div className="challenge-request">
        <p>
          The following player has issued you a challenge: {this.props.name}
          {this.props.message &&<blockquote>{this.props.message}</blockquote>}
          <button className="challenge-request__accept-button">Accept Challenge</button>
        </p>
      </div>
    );
  }
}

export default Request;
