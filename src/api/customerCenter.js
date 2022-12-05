import { posts } from "./index"

// QnA작성
function CCCreate(CCData){
  return posts.get('CCCreate', CCData)
}

// QnA수정
function CCUpdata(CCId, CCUpdataData){
  return posts.get('CCUpdate/'+{CCId}, CCUpdataData)
}

// QnA삭제
function CCDelete(CCId){
  return posts.get('CCDelete/'+{CCId})
}

// QnA 답글작성
function CCcommentCreate(CCCommentData){
  return posts.get('CCcommentCreate', CCCommentData)
}

// QnA 답글수정
function CCcommentUpdate(CCId, CCCommentData){
  return posts.get('CCcommentUpdate'+'/'+CCId, CCCommentData)
}

// 마이페이지에서 QnA 리스트
function mypageReviewList(){
  return posts.get('myCCs')
}

export {
  CCCreate,
  CCUpdata,
  CCDelete,
  CCcommentCreate,
  CCcommentUpdate,
  mypageReviewList,
}