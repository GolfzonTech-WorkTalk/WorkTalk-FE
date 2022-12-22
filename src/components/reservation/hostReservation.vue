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
        <span class="reserveIdTitle itemTitle">예약번호</span>
        <span class="roomTypeTitle">방종류</span>
        <span class="roomNameTitle itemTitle">방이름</span>
        <span class="reserveTimeTitle itemTitle">예약일</span>
        <span class="reserveInOutTitle itemTitle">입/퇴실</span>
        <span class="reservaStatusTitle">예약상태</span>
        <span class="amountTitle itemTitle">금액</span>
        <span class="reservationCancel itemTitle">비 고</span>
      </div>
      <div v-for="(item, index) in reservationData" :key="item" class="reservationItem">
        <span class="reserveId" :class="item.paymentStatus">{{ item.reserveId }}</span>
        <span class="roomType" :class="item.roomType">{{ roomTypeRename(item.roomType) }}</span>
        <span class="roomName">{{ item.roomName }}</span>
        <span class="reserveTime">{{ reserveTime(item.bookDate.reserveDate) }}</span>
        <span class="reserveInOut">{{ InOutTime(item) }}</span>
        <span class="reserveStatus" :class="item.reserveStatus">{{ reserveStatusRename(item.reserveStatus) }}</span>
        <span class="amount">{{ item.reserveAmount }}</span>
        <span v-if="cancelPossible(item)" class="reservationCancelBtn" @click="boxOpen('cancel', index)">예약취소</span>
        <template v-if="cancelIndex == index">
          <div class="reservationCancelBox">
            <p :class="(cancelReason.length >= 100)?'warning':''">
              {{ cancelReason.length }}/100자
            </p>
            <textarea v-model="cancelReason" cols="30" rows="5" placeholder="취소사유를 입력해주세요" />
            <span class="closeBtn" @click="boxClose()">닫기</span>
            <span class="cancelBtn" @click="reservationCancelOK(item)">취소</span>
          </div>
        </template>
        <span v-if="cancelPossible(item)" class="reservationDoneBtn" @click="boxOpen('done', index)">이용완료</span>
        <template v-if="(reservationDone == index)">
          <div class="reservationDoneBox">
            <p>해당 예약을 이용완료처리 하시겠습니까?</p>
            <span class="closeBtn" @click="boxClose()">닫기</span>
            <span class="doneBtn" @click="reservationDoneOK(item)">완료</span>
          </div>
        </template>
        <span v-if="cancelReasonView(item)" class="cancelReason" @click="boxOpen('cancelReason', index)">취소사유보기</span>
        <template v-if="cancelReasonIndex == index">
          <div class="reservationCancelReasonBox">
            <p>{{ item.cancelReason }}</p>
            <span class="closeBtn" @click="boxClose()">닫기</span>
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
// import { reservation, reservationCancel, reservationCompletion } from '@/api/reservation.js'
// import {nowYYmmDDhhMM} from '@/utils/common.js'
// import {reservationDataDeskMeetingroom} from '@/utils/dummy/dummy.js'
import { reservation, reservationCancel, reservationCompletion } from '@/api/reservation.js'
export default {
  data(){
    return {
      reservationData: [],
      // 정렬데이터
      sortReserveStatusData: [
        {'name':'전 체','value':''},
        {'name':'예약완료','value':'BOOKED'},
        {'name':'이용완료','value':'USED'},
        {'name':'사용자취소','value':'CANCELED_BY_USER'},
        {'name':'호스트취소','value':'CANCELED_BY_HOST'},
        {'name':'노쇼','value':'NOSHOW'},
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
      // 취소관리
      cancelIndex: '취소번호',
      cancelReason:'',
      // 취소사유보기
      cancelReasonIndex: '취소사유',
      background: false,
      // 이용완료
      reservationDone:'이용완료',
    }
  },
  created(){
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
    reserveTime(reserveDate){
      const date = reserveDate.slice(0,10)
      const time = reserveDate.slice(11,16)
      return `${date} ${time}`
    },
    InOutTime(item){
      console.log(item)
      if (item.roomType == 'OFFICE'){
        return `${item.bookDate.checkInDate}~${item.bookDate.checkOutDate}`
      } else {
        let checkInTime = item.bookDate.checkInTime
        let checkOutTime = item.bookDate.checkOutTime
        if (checkInTime < 10){
          checkInTime = '0'+checkInTime
        }
        if (checkOutTime < 10){
          checkOutTime = '0'+checkOutTime
        }
        return `${item.bookDate.checkInDate} ${checkInTime}:00~${checkOutTime}:00`
      }
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
    boxOpen(value, index){
      this.boxClose()
      if (value == 'cancel'){
        this.cancelIndex = index
      } else if (value == 'cancelReason'){
        this.cancelReasonIndex = index
      } else {
        this.reservationDone = index
      }
      this.background = true
    },
    // 예약취소창 닫기
    boxClose(){
      this.cancelIndex = '취소번호'
      this.cancelReasonIndex = '취소사유'
      this.cancelReason = ''
      this.reservationDone='이용완료'
      this.background = false
    },
    // 예약취소
    async reservationCancelOK(item){
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
        cancelReason : this.cancelReason,
        // cancelDate : nowYYmmDDhhMM(),
        // reserveStatus: "CANCELED_BY_HOST",
      }
      console.log(cancelData)
      try {
        let response = await reservationCancel(cancelData)
        console.log(response)
        this.boxClose()
        this.reservationDataCall(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
      this.cancelIndex = '취소번호'
      this.cancelReason = ''
    },
    // 이용완료
    async reservationDoneOK(item){
      try {
        let response = await reservationCompletion(item.reserveId)
        console.log(response)
        this.boxClose()
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
  position: relative;
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
/* 예약번호 */
.reserveIdTitle, .reserveId{
  width: 5vw;
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
.roomNameTitle{
  width: 7vw;
  text-align: center;
}
.roomName{
  font-weight: bold;
  font-size: 0.8rem;
  width: 7vw;
  text-align: center;
  letter-spacing: -0.1rem;
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
  width: 9vw;
}
.reserveTime{
  width: 9vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 입퇴실 */
.reserveInOutTitle{
  width: 11vw;
}
.reserveInOut{
  width: 11vw;
  font-size: 0.8rem;
  font-weight: bold;
}
/* 가격 */
.amountTitle{
  width: 5vw;
}
.amount{
  width: 5vw;
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
  cursor: pointer;
}
.cancelBtn:hover{
  background: rgb(217, 136, 136);
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
  cursor: pointer;
}
/* 이용완료창 */
.reservationDoneBox{
  position: absolute;
  text-align: center;
  background: white;
  right: 0;
  top: 0;
  border: 3px solid gray;
  width: 20vw;
  height: 6vh;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.reservationDoneBox span{
  padding: 0 1vw;
  border: 1px solid gray;
  border-radius: 10px;
  margin-top: 1vh;
  margin-left: 1vw;
  float: right;
  cursor: pointer;
}
.doneBtn:hover{
  background: rgb(136, 154, 217);
  color: white;
}
.closeBtn:hover{
  background: rgb(200, 200, 200);
  color: white;
}
.background{
  position: absolute;
  background: rgba(0, 0, 0, 0.356);
  top: -13.5vh;
  left: -15vw;
  width: 110vw;
  height: 110vh;
  z-index: 1;
}
</style>