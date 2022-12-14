// auth : 로그인, 회원가입, 탈퇴가 들어가는 api 구성
import { instance, posts } from "./index"

// 이메일체크
function mailCheck(email){
  return instance.post('mailCheck', email)
}

// 닉네임체크
function nickCheck(nickcheck){
  return instance.post('member/nameCheck', nickcheck)
}

// 회원가입
function registerMember(memberData){
  return instance.post('member/join', memberData)
}

// 로그인
function loginMember(memberData){
  return instance.post('login', memberData)
}

// 프로필정보
function userData(){
  return posts.get('member/profile')
}

// 프로필수정
function profileUpdate(updateData){
  return posts.post('member/update',updateData)
}

// 프로필수정
function memberLeave(memberId){
  return posts.post('member/leave/'+memberId)
}

// 이메일체크
function mailFind(email){
  return instance.get('member/findEmail', {
    params:{
      email,
    },
  })
}

// 비밀번호찾기
function pwFind(email){
  return instance.get('member/findPw', {
    params:{
      email,
    },
  })
}

export {
  mailCheck,
  registerMember,
  loginMember,
  nickCheck,
  userData,
  profileUpdate,
  mailFind,
  pwFind,
  memberLeave,
}