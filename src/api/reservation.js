import { instance, posts } from "./index"

// 방의 예약조회
function reservationData(roomId, roomType, initDate, endDate, initTime, endTime){
  return instance.get('reservations/isBooked',{
    params:{
      roomId,
      roomType,
      initDate,
      endDate,
      initTime,
      endTime,
    },
  })
}

// 예약임시
function reserveChoose(reservaData){
  return posts.post('/reservation/choose', reservaData)
}

// 임시삭제
function reserveChooseDelete(reserveId){
  return posts.post('/reservation/choose'+reserveId)
}

// 예약확정
function reservationReserve(reservationData){
  return posts.post('reservation/reserve', reservationData)
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
    reserveChoose,
    reserveChooseDelete,
    reservationReserve,
    reservation,
    reservationCancel,
}