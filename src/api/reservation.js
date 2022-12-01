import { instance, posts } from "./index"

// 방의 예약조회
function reservationData(roomId, reservationDate){
  return instance.get('reservationData/'+roomId+'/'+reservationDate)
}

// 예약인원정보
function buyer(reservaData){
  return posts.get('buyer', reservaData)
}

// 예약
function reserve(reservaData){
  return posts.get('reserve', reservaData)
}

// 결제
function payment(paymentData){
  return posts.get('payment', paymentData)
}

// 예약리스트조회
function reservationList(pageNowNum, sortWord1, sortWord2){
  return posts.get('reservationList/'+pageNowNum+'/'+sortWord1+'/'+sortWord2)
}

// 예약취소
function reservationCancel(cancelData){
  return posts.get('reservationCancel', cancelData)
}

export {
    reservationData,
    reserve,
    payment,
    buyer,
    reservationList,
    reservationCancel,
}