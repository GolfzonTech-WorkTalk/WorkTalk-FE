<template>
  <div class="reservationContainer">
    <div class="reservationTitle">
      <select v-model="sortPayment" class="sortBox" @change="reservationDataCall()">
        <option value="" hidden>
          결제상태
        </option>
        <option v-for="item in sortPaymentData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <select v-model="sortSpace" class="sortBox" @change="reservationDataCall()">
        <option value="" hidden>
          공간종류
        </option>
        <option v-for="item in sortSpaceData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="reservationItems">
      <div class="reservationItem">
        <span class="roomTypeTitle">방종류</span>
        <span class="roomName itemTitle">방이름</span>
        <span class="reserveTimeTitle itemTitle">예약일</span>
        <span class="reservaStatusTitle">예약상태</span>
        <span class="paymentTypeTitle itemTitle">결제종류</span>
        <span class="amountTitle itemTitle">금액</span>
        <span class="paymentSatusTitle itemTitle">결제상태</span>
        <span class="reservationCancel itemTitle">비 고</span>
      </div>
      <div v-for="(item, index) in reservationData" :key="item" class="reservationItem">
        <span class="roomType" :class="item.roomType">{{ roomTypeRename(item.roomType) }}</span>
        <span class="roomName">{{ item.roomName }}</span>
        <span class="reserveTime">{{ reserveTime(item.bookDate.checkInDate, item.bookDate.checkInTime, item.bookDate.checkOutTime) }}</span>
        <span class="reserveStatus" :class="item.reserveStatus">{{ reserveStatusRename(item.reserveStatus) }}</span>
        <span class="paymentType" :class="item.paymentStatus">{{ paymentTypeRename(item.paymentStatus) }}</span>
        <span class="amount">{{ item.reserveAmount }}</span>
        <span class="paymentSatus" :class="(item.paid == '0' && item.paymentStatus != 'REFUND')?'paymentWaiting':'paymentDone'">{{ paymentSatusRename(item.paid, item.paymentStatus) }}</span>
        <span v-if="cancelPossible(item)" class="reservationCancelBtn" @click="reservationCancel(index)">예약취소</span>
        <template v-if="cancelIndex == index">
          <div class="reservationCancelBox">
            <p :class="(cancelReason.length >= 100)?'warning':''">
              {{ cancelReason.length }}/100자
            </p>
            <textarea v-model="cancelReason" cols="30" rows="5" placeholder="취소사유를 입력해주세요" />
            <span @click="cencelCencel()">닫기</span>
            <span @click="reservationCancelOK(item)">취소</span>
          </div>
        </template>
        <span v-if="cancelPossible(item)" class="reservationDoneBtn" @click="reservationCancel(item)">이용완료</span>
        <span v-if="cancelReasonView(item)" class="cancelReason" @click="cancelReasonOpen(index)">취소사유보기</span>
        <template v-if="cancelReasonIndex == index">
          <div class="reservationCancelReasonBox">
            <p>{{ item.cancelReason }}</p>
            <span @click="cencelCencel()">닫기</span>
          </div>
        </template>
      </div>
    </div>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="paging(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { reservationList, reservationCancel } from '@/api/reservation.js'
import {nowYYmmDDhhMM} from '@/utils/common.js'
import {reservationDataDeskMeetingroom} from '@/utils/dummy.js'
export default {
  data(){
    return {
      reservationData: [],
      // 정렬데이터
      sortSpaceData:[
        // api로 받아야 함...
        {'name':'전 체','value':''},
        {'name':'데스크','value':'DESK'},
        {'name':'오피스','value':'OFFICE'},
      ],
      sortPaymentData: [
        {'name':'전 체','value':''},
        {'name':'보증금','value':'DEPOSIT'},
        {'name':'선납','value':'PREPAID'},
        {'name':'후납','value':'POSTPAID'},
        {'name':'취소/환불','value':'REFUND'},
      ],
      // 페이지 관리데이터
      sortPayment: '',
      sortSpace:'',
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
      // 취소관리
      cancelIndex: '취소번호',
      cancelReason:'',
      // 취소사유보기
      cancelReasonIndex: '취소사유',
    }
  },
  created(){
    // 초기 api로 데이터 가죠오기
    this.reservationDataCall(this.pageNowNum)
    this.paging(this.pageNowNum)
    /*
    let response = await reservationList(pageNowNum)
    this.reservationData = response.data
    */
  },
  methods: {
    //데이터 API로 불러오기
    async reservationDataCall(pageNowNum){
      let sortSpace
      let sortPayment
      if (this.sortSpace != ''){
        sortSpace = this.sortSpace
      }
      if (this.sortPayment != ''){
        sortPayment = this.sortPayment
      }
      console.log(pageNowNum, sortSpace, sortPayment)
      this.reservationData = reservationDataDeskMeetingroom
      /*
      let response = await reservationData(pageNowNum)
      this.reservationData = response.data
      */
    },
    // 템플릿 디자인 함수
    roomTypeRename(roomType){
      if (roomType == 'DESK'){
        return roomType = '데스크'
      } else if (roomType == 'OFFICE'){
        return roomType = '오피스'
      } else {
        return roomType = '회의실'
      }
    },
    reserveStatusRename(reserveStatus){
      if (reserveStatus == 'BOOKED'){
        return reserveStatus = '예약완료'
      } else if (reserveStatus == 'CANCELED_BY_USER'){
        return reserveStatus = '사용자취소'
      } else if (reserveStatus == 'CANCELED_BY_HOST'){
        return reserveStatus = '호스트취소'
      } else if (reserveStatus == 'NOSHOW'){
        return reserveStatus = '노쇼'
      } else {
        return reserveStatus = '사용완료'
      }
    },
    paymentTypeRename(status){
      if (status == 'DEPOSIT'){
        status = '보증금'
      } else if (status == 'PREPAID'){
        status = '선납'
      } else if (status == 'POSTPAID_BOOKED'){
        status = '후납'
      } else {
        status = '환불'
      }
      return status
    },
    paymentSatusRename(paid, status){
      if (status == 'REFUND'){
        return paid = '-'
      }
      if (paid == '0'){
        paid = '결제진행중'
      } else if (paid == '1'){
        paid = '결제완료'
      }
      return paid
    },
    reserveTime(date, inTime, outTime){
      return `${date} ${inTime}:00~${outTime}:00`
    },
    cancelPossible(item){
      if (item.reserveStatus == 'BOOKED'){
        return true
      }
      return false
    },
    cancelReasonView(item){
      if (item.reserveStatus == 'CANCELED_BY_USER' || item.reserveStatus == 'CANCELED_BY_HOST'){
        return true
      } 
      return false
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      // 전체 데이터의 길이... this.reservationData.length
      let total = this.reservationData.length
      if (total%10 != 0){
        this.pageTotal = parseInt(total/10)+1
      } else { 
        this.pageTotal = total/10
      }
      // console.log(this.pageTotal)
      let lastPage = this.pageStartNum+5
      if (lastPage >= this.pageTotal ){
        lastPage = this.pageTotal
      }
      if (this.pageTotal == 1){
        this.pageData.push({'value':'1','class':'pageNowNum'})
      }
      for (let i = this.pageStartNum; i < lastPage; i++){
        if (pageNowNum == i){
          this.pageData.push({'value':i,'class':'pageNowNum'})
        } else {
          this.pageData.push({'value':i,'class':''})
        }
      }
      this.reservationDataCall(this.pageNowNum)
    },
    // 페이지 번호 넘기기
    pageMove(value){
      if (value == 'next'){
        this.pageStartNum = this.pageStartNum + 5
        this.paging(this.pageStartNum)
      } else {
        if (this.pageStartNum == 1){
          this.paging(this.pageStartNum)
        }
        this.pageStartNum = this.pageStartNum - 5
        this.paging(this.pageStartNum)
      }
      this.reservationDataCall(this.pageNowNum)
    },
    // 예약취소창 열기
    reservationCancel(index){
      this.cancelIndex = index
    },
    cancelReasonOpen(index){
      this.cancelReasonIndex = index
    },
    // 예약취소창 닫기
    cencelCencel(){
      this.cancelIndex = '취소번호'
      this.cancelReasonIndex = '취소사유'
      this.cancelReason = ''
    },
    // 예약취소
    reservationCancelOK(item){
      if (this.cancelReason.length >= 100){
        let message = '취소사유가 100자를 초과했습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        return false
      } else if (this.cancelReason.length == ''){
        let message = '취소사유가 비어있습니다.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        return false
      } 
      let cancelData = {
        reserveId : item.reserveId,
        cencelReason : this.cancelReason,
        cancelDate : nowYYmmDDhhMM(),
        reserveStatus: "CANCELED_BY_HOST",
      }
      console.log(cancelData)
      this.cancelIndex = '취소번호'
      this.cancelReason = ''
      /*
      try {
        let response = await reservationCancel(cancelData)
        console.log(response)
      } catch (error){
        console.log(error)
      }
      */
    },
  },
}
</script>

<style scoped>
.reservationTitle{
  width: 70vw;
  font-size: 2rem;
  font-weight: bold;
  text-align: right;
}
.sortBox{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-right: 2vw;
}
/* 예약리스트 출력 */
.reservationItems{
  position: relative;
  margin: 3vh 2vw;
  margin-bottom: 3vh;
}
.reservationItem{
  position: relative;
  border: 1px solid gray;
  border-left: 0;
  border-right: 0;
  padding: 1.5vh 0vw;
  width: 66vw;
}
.reservationItem span{
  text-align: center;
  display: inline-block;
}
.itemTitle{
  font-weight: bold;
}
/* 방타입 출려 */
.roomTypeTitle{
  font-weight: bold;
  width: 4vw;
  margin: 0 1vw;
}
.roomType{
  border: 1px solid gray;
  border-radius: 10px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  width: 4vw;
  margin: 0 1vw;
}
.DESK{
  background: rgba(139, 98, 9, 0.527);
}
.OFFICE{
  background: rgba(4, 90, 4, 0.527);
}
.MEETING4, .MEETING6, .MEETING8, .MEETING20{
  background: rgba(9, 44, 139, 0.527);
}
/* 방이름 */
.roomName{
  width: 13vw;
  text-align: center;
}
/* 예약상태 */
.reservaStatusTitle{
  width: 5vw;
  font-weight: bold;
}
.reserveStatus{
  width: 5vw;
  font-size: 0.9rem;
  font-weight: bold;
}
.BOOKED, .paymentWaiting{
  color: rgb(44, 44, 175);
}
.CANCELED_BY_USER, .CANCELED_BY_HOST, .REFUND{
  color: rgb(223, 33, 33);
}
.NOSHOW{
  color: rgb(195, 0, 255);
}
.USED, .paymentDone{
  color: green;
}
/* 예약시간 */
.reserveTimeTitle{
  width: 13vw;
}
.reserveTime{
  width: 13vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 예약종류,상태 */
.paymentTypeTitle, .paymentType{
  width: 6vw;
}
.paymentSatusTitle, .paymentSatus{
  width: 7vw;
}
.paymentType, .paymentSatus{
  font-size: 0.9rem;
  font-weight: bold;
}
/* 가격 */
.amountTitle{
  width: 6vw;
}
.amount{
  width: 6vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 비고 예약취소 */
.reservationCancel{
  width: 10vw;
}
.reservationCancelBtn, .reservationDoneBtn{
  padding: 0 0.2vw;
  width: 4vw;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
}
.reservationCancelBtn{
  background: rgb(212, 49, 49);
  margin-right: 1vw;
}
.reservationDoneBtn{
  background: rgb(78, 86, 197);
}
.pageNumber{
  text-align: center;
  font-size: 1.2rem;
}
.pageNumber span{
  margin: 1vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
/* 취소창 */
.reservationCancelBox{
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  border: 3px solid gray;
  width: 20vw;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.reservationCancelBox textarea{
  width: 20vw;
  resize: none;
}
.reservationCancelBox span{
  padding: 0 1vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-left: 1vw;
  float: right;
}
.reservationCancelBox span:hover{
  background: rgb(93, 93, 214);
  color: white;
}
.reservationCancelBox p {
  float: right;
}
.warning{
  color: red;
}
/* 취소사유창 */
.cancelReason{
  width: 9vw;
  font-size: 0.9rem;
  font-weight: bold;
}
.cancelReason:hover{
  color: brown;
}
.reservationCancelReasonBox{
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  border: 3px solid gray;
  width: 20vw;
  height: 15vh;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.reservationCancelReasonBox p{
  word-wrap: break-word;
  overflow: scroll;
  height: 12vh;
}
.reservationCancelReasonBox p::-webkit-scrollbar {
  display: none;
}
.reservationCancelReasonBox span{
  padding: 0 1vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-left: 1vw;
  float: right;
}
.reservationCancelReasonBox span:hover{
  background: rgb(93, 93, 214);
  color: white;
}
</style>