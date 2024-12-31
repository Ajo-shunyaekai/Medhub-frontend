const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/uploads',
        createProxyMiddleware({
            target: process.env.REACT_APP_SERVER_URL,
            changeOrigin: true,
        })
    );
};
