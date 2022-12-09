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

// 예약임시DB저장
function reserveChoose(reservaData){
  return posts.post('/reservation/choose', reservaData)
}

// 임시DB삭제
function reserveChooseDelete(reserveId){
  return posts.get('/reservation/delete/'+reserveId)
}

// 예약확정 DB저장
function reservationReserve(reservationData){
  return posts.post('reservation/reserve', reservationData)
}

// 예약리스트조회
function reservation(pageNum, spaceType, reserveStatus){
  return posts.get('/reservation/find',{
    params:{
      pageNum,
      spaceType,
      reserveStatus,
    },
  })
}

// 예약취소
function reservationCancel(cancelData){
  return posts.post('/reservation/cancel', cancelData)
}

// 이용완료
function reservationCompletion(reserveId){
  return posts.get('/reservation/end/'+reserveId)
}

// 잔금결제
function reservationPrepaid(paymentData){
  return posts.post('/payments/prepaid', paymentData)
}

// 결제내역
function paymentHistory(pageNum, payStatus, reserveDate){
  return posts.get('/payments/history',{
    params: {
      pageNum,
      payStatus,
      reserveDate,
    },
  })
}

export {
    reservationData,
    reserveChoose,
    reserveChooseDelete,
    reservationReserve,
    reservation,
    reservationCancel,
    reservationCompletion,
    reservationPrepaid,
    paymentHistory,
}