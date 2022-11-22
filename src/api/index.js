import axios from "axios"
import { setInterceptors } from "./common/interceptors"

function createInstance(){
  return axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  })
}

// 액시오스 초기화 함수
function createInstanceWithAuth(url){
  // instance : 인스턴스를 생성하여 공통화 작업을 할 수 있다.
  // interceptor : axios는 javascript로 먼저 생성 후 vue처럼 자동으로 최신화 해주지 않기 때문에
  // interceptor를 이용하여 최신화 하는 로직을 만들어 주어야 한다.
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_API_URL}${url}`,
    // headers: {
    //   // 토큰 활용시 사용하는 속성
    //   // 네크워트 Request Headers에 Authorization에서 확인 가능
    //   Authorization: store.state.token,
    // },
  })
  // interceptors.js로 넘겨준 것을 리턴
  return setInterceptors(instance)
}

export const instance = createInstance()
export const posts = createInstanceWithAuth('posts')