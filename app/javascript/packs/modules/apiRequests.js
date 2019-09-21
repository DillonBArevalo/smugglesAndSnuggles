import { createConsumer } from '@rails/actioncable';

function createSubscription (component, channel, room, callbacks) {
  component.channel = createConsumer().subscriptions.create({channel, room}, callbacks)
}

export function enterGame (component, received, playerId, gameId, isLocal) {
  createSubscription(component, 'GameChannel', `game${gameId}`, {
    received,
    connected () {
      this.send({
        type: 'join',
        gameId,
        playerId,
        isLocal,
        isInitialJoin: true,
      });
    },
    sendUpdate(type, additionalArgs = {}) {
      this.send({type, gameId, isLocal, playerId, ...additionalArgs});
    }
  });
}

export function enterLobby (component, received, playerDetails) {
  createSubscription(component, 'LobbyChannel', 'lobby', {
    connected () {
      this.send({
        type: 'join',
        playerDetails,
      });
    },
    received,
    leave () {
      this.send({
        type: 'leave',
        playerDetails,
      });
    },
    sendUpdate (type, recipient, additionalArgs={}) {
      this.send({type, recipient, playerDetails, ...additionalArgs});
    }
  });
}
