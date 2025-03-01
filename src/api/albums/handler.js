class AlbumsHandler {
  constructor(albumsService, storageService, albumsValidator, uploadsValidator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._albumsValidator = albumsValidator;
    this._uploadsValidator = uploadsValidator;
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const albumId = await this._albumsService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album has been updated',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album has been deleted',
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/images/covers/${filename}`;

    await this._albumsService.updateAlbumCoverById(url, id);

    const response = h.response({
      status: 'success',
      message: 'Cover upload success'
    });
    response.code(201);
    return response;
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.verifyAlbumById(albumId);
    await this._albumsService.addLikeToAlbumById(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album liked',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeByIdHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.deleteAlbumLikeById(credentialId, albumId);

    return {
      status: 'success',
      message: 'Unlike success',
    };
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id } = request.params;
    const { likes, headerValue } = await this._albumsService.getAlbumLikesById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', headerValue);
    return response;
  }
}

module.exports = AlbumsHandler;
