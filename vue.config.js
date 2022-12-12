const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081, // 클라이언트 포트 번호
    proxy: {
      '/mailCheck': { // /api/로 시작하는 url은 아래의 전체 도메인을 추가하고, 옵션을 적용 
        target: 'http://localhost:3100', // 클라이언트에서 api로 보내는 요청은 주소를 바꿔서 보내겠다 라는 뜻
        changeOrigin: true, // cross origin 허용 설정
      },
    },
  },
})
