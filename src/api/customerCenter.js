import { posts } from "./index"

// cc작성
function ccCreate(CCData){
  return posts.post('ccCreate', CCData)
}

// cc수정
function ccUpdata(CCId, CCUpdataData){
  return posts.post('ccUpdate/'+CCId, CCUpdataData)
}

// cc삭제
function ccDelete(CCId){
  return posts.delete('ccDelete/'+CCId)
}

// cc 답글작성
function cccommentCreate(CCCommentData){
  return posts.post('customercommentCreate', CCCommentData)
}

// cc 답글수정
function cccommentUpdate(CCId, CCCommentData){
  return posts.post('customercommentUpdate/'+CCId, CCCommentData)
}

// cc 답글삭제
function cccommentDelete(CCId){
  return posts.delete('customercommentDelete/'+CCId)
}

// 마이페이지에서 cc 리스트
function mypageCCList(searchccType){
  return posts.get('myCustomerCenter',{
    params:{
      searchccType,
    },
  })
}

// 마스터페이지 cc 리스트
function masterCCList(searchMemberType, searchccType){
  return posts.get('customerCenter', {
    params:{
      searchMemberType,
      searchccType,
    },
  })
}

export {
  ccCreate,
  ccUpdata,
  ccDelete,
  cccommentCreate,
  cccommentUpdate,
  mypageCCList,
  cccommentDelete,
  masterCCList,
}