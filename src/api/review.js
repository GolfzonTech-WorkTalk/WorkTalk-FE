import { instance, posts } from "./index"

// 후기작성
function reviewCreate(reviewData){
  return posts.get('reviewCreate', reviewData)
}

// 후기수정
function reviewUpdata(reviewId, reviewUpdata){
  return posts.get('reviewUpdate/'+{reviewId}, reviewUpdata)
}

// 후기삭제
function reviewDelete(reviewId){
  return posts.get('reviewDelete/'+{reviewId})
}

// 공간에서의 후기 리스트
function spaceReviewList(spaceId){
  return instance.get('spaceOne/'+{spaceId}+'/reviews')
}

// 마이페이지에서 후기 리스트
function mypageReviewList(){
  return posts.get('myreviews')
}

export {
  reviewCreate,
  reviewUpdata,
  reviewDelete,
  spaceReviewList,
  mypageReviewList,
}