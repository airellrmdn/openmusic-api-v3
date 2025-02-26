const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => handler.deleteCollaborationByIdHandler(request),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
