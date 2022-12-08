import { posts } from "./index"

// 유저관리
function deactivatedHost(){
  return posts.get('member/deactivated')
}

function penaltyRemove(penaltyId){
  return posts.get('penalty/remove/'+penaltyId)
}

// 호스트관리
function penaltyUser(){
  return posts.get('penalty')
}

function memberApprove(memberId){
  return posts.get('member/approve/'+memberId)
}

export {
  deactivatedHost,
  penaltyUser,
  penaltyRemove,
  memberApprove,
}