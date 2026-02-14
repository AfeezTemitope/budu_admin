const ENDPOINTS = {
  auth: {
    login: '/auth/admin-login/',
    me: '/auth/me/',
    refresh: '/auth/jwt/refresh/',
  },
  dashboard: {
    stats: '/admin/dashboard/stats/',
    recentPlayers: '/admin/dashboard/recent-players/',
    positionBreakdown: '/admin/dashboard/position-breakdown/',
  },
  players: {
    list: '/admin/players/',
    create: '/admin/players/',
    detail: (id) => `/admin/players/${id}/`,
    update: (id) => `/admin/players/${id}/`,
    delete: (id) => `/admin/players/${id}/`,
    uploadPhoto: (id) => `/admin/players/${id}/upload-photo/`,
    downloadPdf: (id) => `/admin/players/${id}/download-pdf/`,
    extractFromPdf: '/admin/players/extract-from-pdf/',
  },
  schedule: {
    list: '/admin/events/',
    create: '/admin/events/',
    detail: (id) => `/admin/events/${id}/`,
    update: (id) => `/admin/events/${id}/`,
    delete: (id) => `/admin/events/${id}/`,
  },
  content: {
    list: '/admin/posts/',
    create: '/admin/posts/',
    detail: (id) => `/admin/posts/${id}/`,
    update: (id) => `/admin/posts/${id}/`,
    delete: (id) => `/admin/posts/${id}/`,
    uploadImage: (id) => `/admin/posts/${id}/upload-image/`,
  },
  store: {
    products: '/admin/products/',
    createProduct: '/admin/products/',
    detail: (id) => `/admin/products/${id}/`,
    update: (id) => `/admin/products/${id}/`,
    delete: (id) => `/admin/products/${id}/`,
    uploadImage: (id) => `/admin/products/${id}/upload-image/`,
    orders: '/admin/orders/',
    orderDetail: (id) => `/admin/orders/${id}/`,
  },
  upload: {
    image: '/admin/uploads/image/',
  },
}

export default ENDPOINTS
