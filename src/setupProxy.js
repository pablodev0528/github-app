const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/login',
    createProxyMiddleware({
      target: 'https://github.com',
      pathRewrite: {
        '^/api': '/',
      },
      headers: {
        accept: 'application/json',
      },
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.github.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/',
      },
    })
  );
};
