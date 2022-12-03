import { instance, posts } from "./index"

// QnA작성
function qnaCreate(qnaData){
  return posts.get('qnaCreate', qnaData)
}

// QnA수정
function qnaUpdata(qnaId, qnaUpdataData){
  return posts.get('qnaUpdate/'+{qnaId}, qnaUpdataData)
}

// QnA삭제
function qnaDelete(qnaId){
  return posts.get('qnaDelete/'+{qnaId})
}

// QnA 답글작성
function qnacommentCreate(qnaCommentData){
  return posts.get('qnacommentCreate', qnaCommentData)
}

// QnA 답글수정
function qnacommentUpdate(qnaId, qnaCommentData){
  return posts.get('qnacommentUpdate'+'/'+qnaId, qnaCommentData)
}

// 공간에서의 QnA 리스트
function spaceReviewList(spaceId){
  return instance.get('spaceOne/'+{spaceId}+'/qnas')
}

// 마이페이지에서 QnA 리스트
function mypageReviewList(){
  return posts.get('myqnas')
}

export {
  qnaCreate,
  qnaUpdata,
  qnaDelete,
  qnacommentCreate,
  qnacommentUpdate,
  spaceReviewList,
  mypageReviewList,
}