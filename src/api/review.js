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

// 유저 마이페이지에서 후기 리스트
function mypageReviewList(pageNum){
  return posts.get('myreviews',{
    params:{
      pageNum,
    },
  })
}

// 호스트 마이페이지에서 후기 리스트
function mypageReviewListHost(pageNum, spaceName){
  return posts.get('manageHostReview',{
    params:{
      pageNum,
      spaceName,
    },
  })
}


// 호스트 공간불러오기
function reviewSpaceName(){
  return posts.get('getHostSpaceNames')
}


export {
  reviewCreate,
  reviewUpdata,
  reviewDelete,
  spaceReviewList,
  mypageReviewList,
  mypageReviewListHost,
  reviewSpaceName,
}