const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = InvariantError;
