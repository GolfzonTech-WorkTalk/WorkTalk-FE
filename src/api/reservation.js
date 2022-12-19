import { instance, posts } from "./index"

// 방의 예약조회
function reservationData(spaceType, roomId, roomType, initDate, endDate, initTime, endTime){
  return instance.get('reservations/isBooked',{
    params:{
      roomId,
      roomType,
      initDate,
      endDate,
      initTime,
      endTime,
      spaceType,
    },
  })
}

// 예약임시DB저장
function reserveChoose(reservaData){
  return posts.post('/reservation/choose', reservaData)
}

// 예약임시DB불러오기
function reserveChooseCall(tempRedisReserveId){
  return posts.get('/redis/reservation/findById', {
    params:{
      tempRedisReserveId,
    },
  })
}

// 임시DB삭제
function reserveChooseDelete(tempRedisReserveId){
  return posts.get('/reservation/delete/'+tempRedisReserveId)
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

// 유저결제내역
function paymentHistory(pageNum, payStatus, reserveDate){
  return posts.get('/payments/history',{
    params: {
      pageNum,
      payStatus,
      reserveDate,
    },
  })
}

// 호스트 예약된 방
function paymentRoom(pageNum, payStatus, reserveDate, spaceType){
  return posts.get('/payments/history',{
    params: {
      pageNum,
      payStatus,
      reserveDate,
      spaceType,
    },
  })
}

// 호스트결제내역
function paymentHistoryHost(pageNum, payStatus, reserveDate, spaceType, roomName){
  return posts.get('/payments/history',{
    params: {
      pageNum,
      payStatus,
      reserveDate,
      spaceType,
      roomName,
    },
  })
}

export {
    reservationData,
    reserveChoose,
    reserveChooseCall,
    reserveChooseDelete,
    reservationReserve,
    reservation,
    reservationCancel,
    reservationCompletion,
    reservationPrepaid,
    paymentHistory,
    paymentRoom,
    paymentHistoryHost,
}