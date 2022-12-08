import { instance, posts } from "./index"

// 방의 예약조회
function reservationData(reservedData){
  return instance.get('reservations/isBooked', reservedData)
}

// 예약인원정보
function buyer(reservaData){
  return posts.get('buyer', reservaData)
}

// 예약
function reserve(reservaData){
  return posts.post('/reservations/reserve', reservaData)
}

// 결제
function paymentPrepaid(paymentData){
  return posts.post('payment', paymentData)
}
function paymentSchedule(paymentData){
  return posts.post('payment', paymentData)
}

// 예약리스트조회
function reservation(){
  return posts.get('/reservation')
}

// 예약취소
function reservationCancel(cancelData){
  return posts.get('/reservation/cancel', cancelData)
}

export {
    reservationData,
    reserve,
    paymentPrepaid,
    paymentSchedule,
    buyer,
    reservation,
    reservationCancel,
}