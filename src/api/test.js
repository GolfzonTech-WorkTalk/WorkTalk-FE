import { posts } from "./index"

// 예약임시DB저장
function test(reservaData){
  return posts.post('redis/reservation/choose', reservaData)
}


export {
  test,
}