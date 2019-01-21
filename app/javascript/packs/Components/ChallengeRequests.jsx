import React, { Component } from 'react';
import Request from './Request';

class ChallengeRequests extends Component {
  render() {
    return (
      <div className="challenge-requests">
        {this.props.requests.map(
          (requestData) => <Request key={requestData.id} {...requestData} />
        )}
      </div>
    );
  }
}

export default ChallengeRequests;
