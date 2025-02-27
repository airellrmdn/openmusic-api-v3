class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportHandler(request, h) {
    this._validator.validateExportPayload(request.payload);
    const { targetEmail } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Your request has been sent'
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
