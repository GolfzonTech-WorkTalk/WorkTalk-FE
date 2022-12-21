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
function cccommentUpdate(ccCommentId, CCCommentData){
  return posts.post('customercommentUpdate/'+ccCommentId, CCCommentData)
}

// cc 답글삭제
function cccommentDelete(ccCommentId){
  return posts.delete('customercommentDelete/'+ccCommentId)
}

// 마이페이지에서 cc 리스트
function mypageCCList(pageNum, searchccType){
  return posts.get('myCustomerCenter',{
    params:{
      pageNum,
      searchccType,
    },
  })
}

// 마스터페이지 cc 리스트
function masterCCList(pageNum, searchMemberType, searchccType){
  return posts.get('customerCenter', {
    params:{
      pageNum,
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