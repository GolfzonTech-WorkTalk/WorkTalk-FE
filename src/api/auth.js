// auth : 로그인, 회원가입, 탈퇴가 들어가는 api 구성
import { instance } from "./index"

// 이메일체크
function mailCheck(email){
  return instance.post('mailCheck', email)
}

// 닉네임체크
function nickCheck(nickcheck){
  return instance.post('nameCheck', nickcheck)
}

// 회원가입
function registerMember(memberData){
  return instance.post('join', memberData)
}

// 로그인
function loginMember(memberData){
  return instance.post('login', memberData)
}

export {
  mailCheck,
  registerMember,
  loginMember,
  nickCheck,
}