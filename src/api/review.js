import { instance, posts } from "./index"

// 후기작성
function reviewCreate(reviewData){
  return posts.post('reviewCreate', reviewData)
}

// 후기수정
function reviewUpdata(reviewId, reviewUpdata){
  return posts.post('reviewUpdate/'+reviewId, reviewUpdata)
}

// 후기삭제
function reviewDelete(reviewId){
  return posts.delete('reviewDelete/'+reviewId)
}

// 공간에서의 후기 리스트
function spaceReviewList(pageNum, spaceId){
  return instance.get('spaceOne/reviews', {
    params:{
      spaceId,
      pageNum,
    },
  })
}

// 마이페이지에서 후기 리스트
function mypageReviewList(pageNum){
  return posts.get('myreviews',{
    params:{
      pageNum,
    },
  })
}

export {
  reviewCreate,
  reviewUpdata,
  reviewDelete,
  spaceReviewList,
  mypageReviewList,
}