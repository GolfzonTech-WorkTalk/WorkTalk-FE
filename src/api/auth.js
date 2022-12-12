// auth : 로그인, 회원가입, 탈퇴가 들어가는 api 구성
import { instance, posts } from "./index"

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

// 프로필정보
function userData(){
  return posts.get('userData')
}

// 프로필수정
function profileUpdate(updateData){
  return posts.get('update',updateData)
}

export {
  mailCheck,
  registerMember,
  loginMember,
  nickCheck,
  userData,
  profileUpdate,
}