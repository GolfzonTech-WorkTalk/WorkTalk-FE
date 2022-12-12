<template>
  <div class="reservationContainer">
    <div v-if="background" class="background" @click="boxClose()" />
    <div class="reservationTitle">
      <select v-model="sortReserveStatus" class="sortBox" @change="reservationDataCall(pageNowNum)">
        <option value="예약상태" hidden>
          예약상태
        </option>
        <option v-for="item in sortReserveStatusData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <select v-model="sortSpaceType" class="sortBox" @change="reservationDataCall(pageNowNum)">
        <option value="공간종류" hidden>
          공간종류
        </option>
        <option v-for="item in sortSpaceTypeData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="reservationItems">
      <div class="reservationItem">
        <span class="roomTypeTitle">방종류</span>
        <span class="roomName itemTitle">방이름</span>
        <span class="reservaStatusTitle">예약상태</span>
        <span class="reserveTimeTitle itemTitle">예약일</span>
        <span class="amountTitle itemTitle">예약금</span>
        <span class="reservationCancel itemTitle">비 고</span>
      </div>
      <div v-for="(item, index) in reservationData" :key="item" class="reservationItem">
        <span class="roomType" :class="item.roomType">{{ roomTypeRename(item.roomType) }}</span>
        <span class="roomName">{{ item.roomName }}</span>
        <span class="reserveStatus" :class="item.reserveStatus">{{ reserveStatusRename(item.reserveStatus) }}</span>
        <span class="reserveTime">{{ reserveTime(item.bookDate.checkInDate, item.bookDate.checkInTime, item.bookDate.checkOutTime) }}</span>
        <span class="amount">{{ item.reserveAmount }}</span>
        <span v-if="cancelPossible(item)" class="reservationCancelBtn" @click="boxOpen('cancel', index)">예약취소</span>
        <template v-if="cancelIndex == index">
          <div class="reservationCancelBox">
            <p :class="(cancelReason.length >= 100)?'warning':''">
              {{ cancelReason.length }}/100자
            </p>
            <textarea v-model="cancelReason" cols="30" rows="5" placeholder="취소사유를 입력해주세요" />
            <span class="closeBtn" @click="boxClose()">닫기</span>
            <span class="reservationCancelDo" @click="reservationCancel(item)">취소</span>
          </div>
        </template>
        <span v-if="amountLeaveCheck(item)" class="amountLeaveBtn" @click="boxOpen('amountLeave', index)">잔금결제</span>
        <template v-if="amountLeaveIndex == index">
          <div class="amountLeaveBox">
            <p>결제잔금 {{ (item.reserveAmount*0.8) }}원을 결제하시겠습니까?</p>
            <span class="closeBtn" @click="boxClose()">닫기</span>
            <span class="paymentBtn" @click="paymentLeave(item)">결제</span>
          </div>
        </template>
        <span v-if="cancelReasonView(item)" class="cancelReason" @click="boxOpen('cancelReason', index)">취소사유보기</span>
        <template v-if="cancelReasonIndex == index">
          <div class="reservationCancelReasonBox">
            <p>{{ item.cancelReason }}</p>
            <span class="closeBtn" @click="boxClose()">닫기</span>
          </div>
        </template>
        <span v-if="reviewPossible(item)" class="reviewBtn" @click="boxOpen('review', index, item)">후기작성</span>
        <template v-if="reviewIndex == index">
          <form-review :reserve-id="reserveId" @box-close:box-close-click="boxClose" />
        </template>
      </div>
    </div>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="reservationDataCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { reservation, reservationCancel } from '@/api/reservation.js'
import { reservation, reservationCancel, reservationPrepaid } from '@/api/reservation.js'
// import {nowYYmmDDhhMM} from '@/utils/common.js'
// import {reservationDataDeskMeetingroom} from '@/utils/dummy/dummy.js'
import FormReview from '@/components/Form/FormReviewCreate.vue'
export default {
  components: {
    FormReview,
  },
  data(){
    return {
      reservationData: [],
      // 정렬데이터
      sortReserveStatusData: [
        {'name':'전 체','value':''},
        {'name':'예약완료','value':'DEPOSIT'},
        {'name':'이용완료','value':'USED'},
        {'name':'이용자취소','value':'CANCELED_BY_USER'},
        {'name':'사용자취소','value':'CANCELED_BY_HOST'},
        {'name':'노쇼','value':'NOSHOW'},
        {'name':'취소/환불','value':'REFUND'},
      ],
      sortSpaceTypeData: [
        {'name':'전 체','value':''},
        {'name':'오피스','value':'1'},
        {'name':'데스크','value':'2'},
        {'name':'회의실','value':'3'},
      ],
      sortReserveStatus: '예약상태',
      sortSpaceType: '공간종류',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
      // box관리
      cancelIndex: '취소',
      cancelReasonIndex: '취소사유',
      reviewIndex: '리뷰',
      background: false,
      // 취소사유
      cancelReason:'',
      // 리뷰관련 데이터
      reserveId:'',
      // 잔금결제
      amountLeaveIndex:'잔금결제',
    }
  },
  created(){
    // 초기 api로 데이터 가죠오기
    this.reservationDataCall(this.pageNowNum)
  },
  methods: {
    //데이터 API로 불러오기
    async reservationDataCall(pageNowNum){
      this.reservationData = []
      this.pageNowNum = pageNowNum
      let sortSpaceType = this.sortSpaceType
      let sortReserveStatus = this.sortReserveStatus
      try {
        if (sortSpaceType == '공간종류'){
          sortSpaceType = ''
        }
        if (sortReserveStatus == '예약상태'){
          sortReserveStatus = ''
        }
        console.log(pageNowNum-1,sortSpaceType,sortReserveStatus)
        let response = await reservation(pageNowNum-1,sortSpaceType,sortReserveStatus)
        this.reservationData = response.data.data
        this.pageTotal =  response.data.count
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
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
    paymentSatusRename(paid, status, reserveStatus){
      if (reserveStatus == 'NOSHOW' || status == 'REFUND'){
        return '-'
      }
      if (paid == '0'){
        paid = '결제진행중'
      } else if (paid == '1'){
        paid = '결제완료'
      }
      return paid
    },
    reserveTime(date, inTime, outTime){
      let yearChange = date[0]
      let monthChange = date[1]
      let dateChange = date[2]
      if (monthChange < 10){
        monthChange = '0'+monthChange
      }
      if (dateChange < 10){
        dateChange = '0'+dateChange
      }
      if (inTime < 10){
        inTime = '0'+inTime
      }
      if (outTime < 10){
        outTime = '0'+outTime
      }
      const yyMMdd = yearChange+'-'+monthChange+'-'+dateChange
      return `${yyMMdd} ${inTime}:00~${outTime}:00`
    },
    // 버튼 출력 조건확인 함수
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
    reviewPossible(item){
      if (item.reserveStatus == 'USED'){
        return true
      } 
      return false
    },
    amountLeaveCheck(item){
      if (item.paid == '0' && item.paymentStatus == 'DEPOSIT'){
        return true
      } else {
        return false
      }
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      let total = this.pageTotal
      if (total%10 != 0){
        this.pageTotal = parseInt(total/10)+1
      } else { 
        this.pageTotal = total/10
      }
      let lastPage
      if (this.pageTotal < 6){
        lastPage = this.pageTotal+1
      } else { 
        lastPage = this.pageStartNum+5
        if (lastPage >= this.pageTotal ){
          lastPage = this.pageTotal+1
        }
      }
      for (let i = this.pageStartNum; i < lastPage; i++){
        if (pageNowNum == i){
          this.pageData.push({'value':i,'class':'pageNowNum'})
        } else {
          this.pageData.push({'value':i,'class':''})
        }
      }
    },
    // 페이지 번호 넘기기
    pageMove(value){
      if (value == 'next'){
        if (this.pageStartNum == this.pageTotal-1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum + 5
          this.paging(this.pageStartNum)
        }
      } else {
        if (this.pageStartNum == 1){
          this.paging(this.pageStartNum)
        } else {
          this.pageStartNum = this.pageStartNum - 5
          this.paging(this.pageStartNum)
        }
      }
      this.reservationDataCall(this.pageNowNum)
    },
    // 예약취소창 열기,닫기
    boxOpen(value, index, item){
      this.boxClose()
      if (value == 'cancel'){
        this.cancelIndex = index
      } else if (value == 'cancelReason'){
        this.cancelReasonIndex = index
      } else if (value == 'amountLeave'){
        this.amountLeaveIndex = index
      } else {
        this.reviewIndex = index
        this.reserveId = item.reserveId
      }
      this.background = true
      this.reservationDataCall(this.pageNowNum)
    },
    boxClose(){
      this.cancelIndex = '취소'
      this.cancelReasonIndex = '취소사유'
      this.reviewIndex = '리뷰'
      this.reserveId = ''
      this.amountLeaveIndex = '잔금결제'
      this.background = false
    },
    // 예약취소
    async reservationCancel(item){
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
        // cancelDate : nowYYmmDDhhMM(),
        // reserveStatus: "CANCELED_BY_USER",
      }
      console.log(cancelData)
      this.cancelIndex = '취소번호'
      this.cancelReason = ''
      try {
        let response = await reservationCancel(cancelData)
        console.log(response)
        this.boxClose()
        this.reservationDataCall(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
    // 잔금결제
    async paymentLeave(item){
      const reservationData = {
        'roomId': item.rooomId,
        'reserveAmount': item.reserveAmount,
        'payAmount': item.reserveAmount*0.8,
        'payStatus': item.paymentStatus,
        'reserveId': item.reserveId,
      }
      const paymentData = {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: item.pays[0].merchantUid+'잔금',
        // 룸ID_일련번호(고유값)
        // 고유값으로 채번하여 DB상에 저장(결제 위변조 작업시 필요)
        name: item.roomName,
        amount: item.reserveAmount*0.8,
      }
      console.log(reservationData)
      console.log(paymentData)
      try {
        const { IMP } = window
        IMP.init('imp38067385')
        IMP.request_pay(paymentData, rsp => { // callback
          if (rsp.success){
            console.log('결제 성공')
            console.log(rsp)
            reservationData.merchant_uid = rsp.merchant_uid
            reservationData.imp_uid = rsp.imp_uid
            console.log(reservationData)
            this.reservationPaymentSubmit(reservationData)
          } else {
            console.log('결제 실패')
            console.log(rsp)
          }
        })
      } catch (error){
        console.log(error)
      }
      this.boxClose()
    },
    async reservationPaymentSubmit(reservationData){
      console.log('DB넣기')
      console.log(reservationData)
      try {
        let response = await reservationPrepaid(reservationData)
        console.log(response)
        this.reservationDataCall(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.reservationTitle{
  position: relative;
  width: 60vw;
  font-size: 2rem;
  font-weight: bold;
  text-align: right;
}
.sortBox{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-left: 2vw;
}
/* 예약리스트 출력 */
.reservationItems{
  position: relative;
  margin: 3vh 2vw;
  margin-bottom: 3vh;
}
.reservationItem{
  position:relative;
  border: 1px solid gray;
  border-left: 0;
  border-right: 0;
  padding: 1.5vh 0vw;
  width: 58vw;
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
  width: 6vw;
  font-weight: bold;
}
.reserveStatus{
  width: 6vw;
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
  width: 15vw;
}
.reserveTime{
  width: 15vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 예약종류,상태 */
.paymentType, .paymentSatus{
  width: 6vw;
}
.paymentType, .paymentSatus{
  font-size: 0.9rem;
  font-weight: bold;
}
/* 가격 */
.amountTitle{
  width: 8vw;
}
.amount{
  width: 8vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 비고 예약취소 */
.reservationCancel{
  width: 8vw;
}
.reservationCancelBtn, .reviewBtn, .amountLeaveBtn{
  padding: 0 0.2vw;
  width: 4vw;
  margin-left: 0.5vw;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
}
.reservationCancelBtn{
  background: rgb(212, 49, 49);
}
.amountLeaveBtn{
  background: rgb(44, 44, 175);
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
.reservationCancelBox p {
  float: right;
}
.warning{
  color: red;
}
.reservationCancelDo:hover{
  background: rgb(214, 93, 93);
  color: white;
}
/* 취소사유창 */
.cancelReason{
  width: 8vw;
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
/* 리뷰 */
.reviewBtn{
  background: rgb(78, 86, 197);
}
.background{
  position: absolute;
  background: rgba(0, 0, 0, 0.356);
  top: -14.5vh;
  left: -15vw;
  width: 110vw;
  height: 110vh;
  z-index: 1;
}
/* 잔금결제 */
.amountLeaveBox{
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  border: 3px solid gray;
  width: 20vw;
  height: 6vh;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.amountLeaveBox span{
  padding: 0 1vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-top: 1vh;
  margin-left: 1vw;
  float: right;
  cursor: pointer;
}
.closeBtn:hover{
  background: rgb(200, 200, 200);
  color: white;
}
.paymentBtn:hover{
  background: rgb(78, 86, 197);
  color: white;
}
</style>