// auth : 로그인, 회원가입, 탈퇴가 들어가는 api 구성
import { instance } from "./index"

// 회원가입
function registerMember(memberData){
  return instance.post('singup', memberData)
}

// 로그인
function loginMember(memberData){
  return instance.post('login', memberData)
}

export {
  registerMember,
  loginMember,
}