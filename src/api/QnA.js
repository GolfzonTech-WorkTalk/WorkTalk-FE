import { instance, posts } from "./index"

// QnA작성
function qnaCreate(qnaData){
  return posts.post('qnaCreate', qnaData)
}

// QnA수정
function qnaUpdata(qnaId, qnaUpdataData){
  return posts.post('qnaUpdate/'+qnaId, qnaUpdataData)
}

// QnA삭제
function qnaDelete(qnaId){
  return posts.delete('qnaDelete/'+qnaId)
}

// QnA 답글작성
function qnacommentCreate(qnaCommentData){
  return posts.post('qnacommentCreate', qnaCommentData)
}

// QnA 답글수정
function qnacommentUpdate(qnaCommentId, qnaCommentData){
  return posts.post('qnacommentUpdate/'+qnaCommentId, qnaCommentData)
}

// QnA 답글삭제
function qnacommentDelete(qnaCommentId){
  return posts.delete('qnacommentDelete/'+qnaCommentId)
}

// 공간에서의 QnA 리스트
function spaceQnAList(pageNum, spaceId){
  return instance.get('spaceOne/'+spaceId+'/qnas', {
    params:{
      spaceId,
      pageNum,
    },
  })
}

// 마이페이지에서 QnA 리스트
function mypageQnAList(){
  return posts.get('myqnas')
}

export {
  qnaCreate,
  qnaUpdata,
  qnaDelete,
  qnacommentCreate,
  qnacommentUpdate,
  qnacommentDelete,
  spaceQnAList,
  mypageQnAList,
}