const InvariantError = require('../../exception/InvariantError');
const { SongPayloadSchema } = require('./schema');

const validator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = validator;
