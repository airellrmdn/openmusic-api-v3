const InvariantError = require('../../exception/InvariantError');
const { ExportPayloadSchema } = require('./schema');

const validator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = validator;
