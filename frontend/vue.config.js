const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  // Set the publicPath according to the environment
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
}) 