import { posts } from "./index"

// 유저관리
function spaceAll(pageNum, spaceStatus, spaceType){
  return posts.get('master/spaceAll',{
    params:{
      pageNum,
      spaceStatus,
      spaceType,
    },
  })
}
function spaceApprove(spaceId){
  return posts.post('spaceApproved/'+spaceId)
}
function spaceRejected(spaceId){
  return posts.post('spaceRejected/'+spaceId)
}

// 유저관리
function penaltyUser(activated){
  return posts.get('penalty',{
    params: {
      activated,
    },
  })
}

function penaltyRemove(penaltyId){
  return posts.get('penalty/remove/'+penaltyId)
}

// 호스트관리
function deactivatedHost(activated){
  return posts.get('member/deactivated',{
    params: {
      activated,
    },
  })
}

function memberApprove(memberId){
  return posts.get('member/approve/'+memberId)
}

export {
  spaceAll,
  spaceApprove,
  spaceRejected,
  deactivatedHost,
  penaltyUser,
  penaltyRemove,
  memberApprove,
}