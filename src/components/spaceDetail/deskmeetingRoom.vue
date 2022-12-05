<template>
  <div class="roomContainer">
    <p class="roomSpaceTile">
      방정보
    </p>
    <div v-for="item in roomItems" :key="item" class="roomItems">
      <input v-model="roomReservationView" type="radio" :value="item.roomId" @click="reservationReset(item)">
      <span class="roomName">{{ item.roomName }}</span>
      <p class="roomTypePrice">
        운용시간 : {{ item.workStart }}:00 ~ {{ item.workEnd }}:00
      </p>
      <p class="roomTypePrice">
        수용인원 : {{ useNumber(item.roomType) }}
      </p>
      <p class="roomTypePrice">
        가격 : {{ item.roomPrice }}/시간
      </p>
      <p class="roomDetail">
        {{ item.roomDetail }}
      </p>
      <template v-if="roomReservationView == item.roomId">
        <!-- <template v-if="true"> -->
        <desk-meeting-calendar-vue @select-day:date-click="lookupReservation" />
        <template v-if="timelineView">
          <div class="timeLine">
            <span>시간선택</span>
            <div class="timeBox">
              <ul>
                <li v-for="timeData in timeDatas" :key="timeData" :value="timeData.name" :class="timeData.class" @click="clickTime(timeData)">
                  {{ timeData.name }}
                </li>
              </ul>
            </div>
            <div class="statusExplanation">
              <i class="fa-solid fa-square StatusBoxReserved" />
              <span>예약불가</span>
              <i class="fa-solid fa-square StatusBoxSelect" />
              <span>선택</span>
            </div>
          </div>
        </template>
        <div class="reservationResult">
          <p>예약날짜 : {{ reservationDay }} </p>
          <span>예약시간 : </span>
          <span v-if="initTime != ''">{{ initTime }}:00 ~ </span>
          <span v-if="endTime != ''">{{ endTime }}:00</span>
        </div>
        <div v-if="amount != ''" class="reservationType">
          <!-- <div class="paymentTypeBox"> -->
          <p>결제방법</p>
          <div class="paymentTypeItems">
            <span :class="{'paymentType' : paymentType == 'DEPOSIT'}" @click="paymentTypeSelect('DEPOSIT')">보증금</span>
            <span :class="{'paymentType' : paymentType == 'PREPAID'}" @click="paymentTypeSelect('PREPAID')">선납</span>
            <span :class="{'paymentType' : paymentType == 'POSTPAID'}" @click="paymentTypeSelect('POSTPAID')">후납</span>
          </div>
        </div>
        <div v-if="amount != ''" class="mileageBox">
          <!-- <div class="mileageBox"> -->
          <span>마일리지</span>
          <span class="mileageCheck" @click="mileageCheck">확 인</span>
          <div>
            <p>보유 : {{ mileage }}</p>
            <input v-model="useMileage" class="useMileageBox" type="text" placeholder="사용할 마일리지" @keypress="useMuleageCheck" @change="useMuleageCheckOK">
          </div>
        </div>
        <div v-if="amount != ''" class="paymentBox">
          <p>
            총금액 : {{ amount }}
          </p>
          <p>
            결제금액 : {{ paymentAmount }}
          </p>
          <p>
            적립예정 : {{ saveMileage }}
          </p>
        </div>
        <div class="reservationSubmitBtn">
          <span @click="reservationSubmitCheck">예약하기</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import { spaceOne, roomOne } from '@/api/user.js'
import { reservationData, reserve, paymentPrepaid, paymentSchedule } from '@/api/reservation.js'
// import { selectOneRoomDumy, selectOneRoomDumy2, reservationData1, reservationData2 } from '@/utils/dummy/dummy.js'
import { selectOneRoomDumy } from '@/utils/dummy/dummy.js'
import DeskMeetingCalendarVue from './reservation/DeskMeetingCalendar.vue'
export default {
  components: {
    DeskMeetingCalendarVue,
  },
  data(){
    return {
      // 룸정보
      roomItems:[],
      price:'', // 방가격
      // 룸출력관리 변수들
      roomReservationView: '',
      MEETING4: '4인',
      MEETING6: '6인',
      MEETING8: '8~10인',
      MEETING20: '20인',
      // 시간출력관련
      workStart: '',
      workEnd:'',
      timeDatas: [],
      timelineView: false,
      // 예약된 시간 API 값 받아올 데이터
      reservation: [],
      /* 제출데이터 */
      // 예약
      reservationDay: '',
      initTime:'',
      endTime:'',
      amount:'', // 총결제금액
      roomType:'',
      // 결제
      selectRoomName: '',
      paymentType:'',
      paymentAmount:'', // 결제금액
      // 마일리지
      mileage: '',
      useMileage: '',
      saveMileage: '',
    }
  },
  // 룸정보 출력
  async created(){
    try {
      // const spaceId = this.$route.params.spaceId
      // let spaceResponce = await roomOne(spaceId)
      // console.log(spaceResponce)
      // this.roomItems = spaceResponce.data
      /* 더미 */
      this.roomItems = selectOneRoomDumy
    } catch (error){
      console.log(error)
    }
  },
  methods: {
    useNumber(value){
      if (value == 'MEETING4'){
        return this.MEETING4
      } else if (value == 'MEETING6'){
        return this.MEETING6
      } else if (value == 'MEETING8'){
        return this.MEETING8
      } else {
        return this.MEETING20
      }
    },
    // 룸타입변경시 데이터 초기화
    reservationReset(item){
      this.price = item.roomPrice
      this.timelineView = false
      // 예약데이터
      this.reservationDay = ''
      this.initTime = ''
      this.endTime = ''
      this.amount = ''
      this.roomType = item.roomType
      this.workStart = item.workStart,
      this.workEnd = item.workEnd,
      // 결제데이터
      this.selectRoomName = item.roomName
      this.paymentType = ''
      this.paymentAmount = ''
      this.useMileage = ''
      this.saveMileage = ''
    },
    // 예약날짜 선택
    lookupReservation(reserveDay){
      // console.log(reserveDay)
      this.timelineView = true
      // 예약데이터
      this.reservationDay = reserveDay
      this.initTime = ''
      this.endTime = ''
      this.amount = ''
      // 결제데이터
      this.paymentType = ''
      this.paymentAmount = ''
      this.useMileage = ''
      this.saveMileage = ''
      this.createTime()
    },
    // 시간출력 async
    async createTime(){
      this.timeDatas = []
      // 더미로직
      // for (let i = 0; i < selectOneRoomDumy.length; i++){
      //   if (this.roomReservationView == selectOneRoomDumy[i].roomId){
      //     this.selectRoom = selectOneRoomDumy[i]
      //   }
      // }
      // let test = 1
      // if (test == 1){
      //   this.reservation = reservationData1
      // } else {
      //   this.reservation = reservationData2
      // }

      // 예약정보가져오는 api 적용
      if (this.roomReservationView != ''){
        try {
          const reservedData = {
            "roomId": this.roomReservationView,
            "roomType": '',
            "initDate" : this.reservationDay,
            "endDate" : this.reservationDay,
            "initTime" : '',
            "endTime" : '',
          }
          let response = await reservationData(reservedData)
          console.log(response)
          this.reservation = response.data
        } catch (error){
          console.log(error)
        }
      }

      // 시간생성
      let workStart = Number(this.workStart)
      let workEnd = Number(this.workEnd)
      // console.log(workStart, workEnd)
      for (let i = workStart; i < workEnd + 1; i++){
        if (i < 10){
          this.timeDatas.push({'name':'0'+i, 'value':i, 'class':'timeItem'})
        } else {
          this.timeDatas.push({'name':i, 'value':i, 'class':'timeItem'})
        }
      }
      // 예약날짜 제외처리
      this.reserveCheck(workStart, workEnd)
      // 시간선택 처리 함수
      if (this.initTime != '' || this.endTime != ''){
        this.selectTimeCheck(workStart, workEnd)
      }
    },
    // 예약날짜 제외처리 함수
    reserveCheck(workStart, workEnd){
      // console.log(this.reservation)
      for (let i = 0; i < this.reservation.length; i++){
        let initTime = this.reservation[i].initTime
        let endTime = this.reservation[i].endTime
        // console.log(initTime, endTime)
        for (let i = 0; i < workEnd - workStart + 1; i++){
          let time = this.timeDatas[i].value
          if (time == initTime || time > initTime && time < endTime || time == endTime){
            this.timeDatas[i].class = 'timeItem reserved'
          }
        }
      }
    },
    // 시간선택 처리 함수
    selectTimeCheck(workStart, workEnd){
      for (let i = 0; i < workEnd - workStart + 1; i++){
        let time = this.timeDatas[i].value
        let initTime = this.initTime
        let endTime = this.endTime
        if (time == initTime || time > initTime && time < endTime || time == endTime){
          this.timeDatas[i].class = 'timeItem selectTime'
        }
      }
    },
    // 시간선택 처리 및 가격계산 함수
    clickTime(item){
      // console.log(item)
      if (!this.initTime){
        this.initTime = item.value
      } else if (this.initTime == item.value){
        this.initTime = ''
      } else if (this.endTime == item.value){
        this.endTime = ''
      } else if (this.initTime < item.value){
        this.endTime = item.value
      } else if (this.initTime > item.value){
        this.endTime = this.initTime
        this.initTime = item.value
      }
      if (this.endTime != '' && this.initTime != ''){
        this.amount = (this.endTime - this.initTime + 1) *  this.price
      }
      this.createTime()
    },
    // 결제방식 선택
    paymentTypeSelect(value){
      this.paymentType = value
      this.useMileage = ''
      if (value == 'DEPOSIT'){
        this.paymentAmount = this.amount * 0.2
      } else {
        this.paymentAmount = this.amount
      }
      if (value == 'POSTPAID'){
        this.saveMileage = '0'
      } else {
        this.saveMileage = this.amount * 0.05
      }
      // 결제계산
    },
    // 마일리지 조회
    async mileageCheck(){
      /*
      let response = await mileageCheck()
      console.log(response.data)
      this.mileage = response.data
      */
      // 더미
      this.mileage = 10000
    },
    // 마일리지 사용체크
    useMuleageCheck(){
      if (this.mileage < this.useMileage){
        this.useMileage = this.mileage
      }
    },
    useMuleageCheckOK(){
      this.useMuleageCheck()
      this.paymentAmount = this.paymentAmount - this.useMileage
    },
    // 결제전 값 확인
    reservationSubmitCheck(){
      if (!this.$store.state.token){
        let message = '로그인을 해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        this.$router.push('/login')
      } else if (!this.reservationDay){
        let message = '예약날짜를 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.initTime || !this.endTime){
        let message = '예약시간을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.paymentType){
        let message = '결제유형을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reservationSubmit()
      }
    },
    // 결제로직
    async reservationSubmit(){
      // 예약 데이터 정의
      const reservationData = {
        'roomId': this.roomReservationView,
        'initDate': this.reservationDay,
        'endDate': this.reservationDay,
        'initTime': this.initTime,
        'endTime': this.endTime,
        'amount': this.amount,
        'paymentStatus': this.paymentType,
      }
      console.log(reservationData)

      // 마일리지 사용 및 적립 데이터 정의
      const mileageData = {
        'useMileage':this.useMileage,
        'mileageAmount':this.saveMileage,
      }
      console.log(mileageData)
      // 유저정보 가져오기
      /*
      let buyer
      try {
        let token = this.$store.state.token
        let response = await buyer(token)
        buyer = response
      } catch (error){
        console.log(error)
      }
      */

      // 결제 데이터 정의
      let date = new Date()
      let paymentData = {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: this.roomReservationView+'_'+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds(),
        // 룸ID_일련번호(고유값)
        // 고유값으로 채번하여 DB상에 저장(결제 위변조 작업시 필요)
        name: this.selectRoomName,
        amount: this.paymentAmount,
        buyer_email: "funidea_woo@naver.com",
        buyer_name: "테스터",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 영등포구 당산동",
        buyer_postcode: "07222",
      }
      console.log(paymentData)
      
      // 결제로직
      const { IMP } = window
      IMP.init('imp82350026')
      IMP.request_pay(paymentData, rsp => { // callback
        if (rsp.success){
          console.log('결제 성공')
          console.log(rsp)
          this.reservationPaymentSubmit(reservationData, rsp)
        } else {
          console.log('결제 실패')
        }
      })
    },
    async reservationPaymentSubmit(reservationData, rsp){
      console.log(reservationData)
      console.log(rsp)
      try {
        let response = await reserve(reservationData)
        console.log(response)
      } catch (error){
        console.log(error)
      }
      if (reservationData.paymentStatus == 'DEPOSIT'){
        const paymentData = {
          "reserveId" : '',
          "customer_uid" : '',
          "imp_uid" : rsp.imp_uid,
          "merchant_uid" : rsp.merchant_uid,
          "payStatus" : "DEPOSIT",
          "payAmount" : rsp.paid_amount,
          "mileageUsage" : this.useMileage,
        }
        try {
          let response = await paymentPrepaid(paymentData)
          console.log(response)
        } catch (error){
          console.log(error)
        } 
      } else {
        const paymentData = {
          "reserveId" : '',
          "imp_uid" : rsp.imp_uid,
          "merchant_uid" : rsp.merchant_uid,
          "payAmount" : rsp.paid_amount,
          "amount" : reservationData.amount,
          "payStatus" : "DEPOSIT",
          "mileageUsage" : this.useMileage,
          "mileageSave" : this.saveMileage,
        }
        try {
          let response = await paymentSchedule(paymentData)
          console.log(response)
        } catch (error){
          console.log(error)
        } 
      }
    },
  },
}
</script>

<style scoped>
.roomContainer{
  padding: 1vw;
}
.roomSpaceTile{
  font-weight: bold;
  font-size: 1.5rem;
}
.roomName{
  margin-left: 0.5vw;
  font-size: 1.2rem;
}
.roomTypePrice, .roomDetail{
  margin: 0.5vh 0.5vw;
}
.reservationResult{
  margin-top: 1vh;
  margin-left: 0.5vw;
  margin-bottom: 2vh;
  border-bottom: 2px solid gray;
}
.roomItems{
  margin-bottom: 3vh;
}
/* 결제종류 선택 및 결제버튼 */
.paymentTypeBox{
  margin-left: 0.5vw;
  border-bottom: 2px solid gray;
}
.paymentTypeItems{
  display: flex;
  justify-content: center;
  margin-left: 0.5vw;
  padding: 1vh 0vw;
  width: 16.8vw;
}
.paymentTypeItems span{
  padding: 0.5vh 1.3vw;
  margin: 0vh 0.2vw;
  border: 1px solid gray;
  border-radius: 10px;
  text-align: center;
  line-height: 2.5vh;
}
.paymentType{
  background: rgb(127, 127, 201);
  color: white;
}
/* 결제금액 및 마일리지 */
.paymentBox, .mileageBox{
  position: relative;
  padding: 1vh 0vw;
  margin-left: 0.5vw;
  border-bottom: 2px solid gray;
}
.mileageCheck{
  float:right;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  text-align: center;
}
.useMileageBox{
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0.5vh 0.5vw;
}
/* 결제버튼 */
.reservationSubmitBtn{
  padding: 1vh 0vw;
  margin-left: 0.5vw;
}
.reservationSubmitBtn span{
  border: 1px solid gray;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 1rem;
  padding: 0 2.3vw;
  margin: 2vw;
  border-radius: 10px;
}
/* 시간 CSS */
.timeLine{
  margin-top: 1vh;
  margin-left: 0.5vw;
}
.timeBox{
  width: 16.8vw;
  overflow-x: scroll;
}
.timeBox ul{
  display: flex;
  list-style: none;
}
.timeBox li{
  padding: 0.5vh 0.5vw;
  border: 1px solid gray;
  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
  cursor: pointer;
}
.timeBox li:first-child{
  border-left: 0;
}
.timeBox li:last-child{
  border-right: 0;
}
.noOperating, .reserved{
  pointer-events: none;
  background: rgba(112, 112, 112, 0.329);
  color: rgba(255, 255, 255, 0.507);
}
/* 스크롤바 디자인 */
/* 전체 스크롤바 */
.timeBox::-webkit-scrollbar {
  width: 16.8vw;
}
/* 움지이는 막대 */
.timeBox::-webkit-scrollbar-thumb {
  background-color: rgb(108, 115, 214);
  background-clip: padding-box;
  border: 2px solid transparent;
  border-radius: 10px;
}
/* 빈공간 */
.timeBox::-webkit-scrollbar-track {
  background-color: rgba(108, 115, 214, 0.178);
}
/* 설명 */
.statusExplanation{
  width: 16.8vw;
  text-align: right;
  font-weight: bold;
  letter-spacing: 0.2vw;
}
.statusExplanation span:not(:last-child){
  margin-right: 0.5vw;
}
.StatusBoxReserved {
  color:rgba(71, 71, 71, 0.514);
}
.StatusBoxSelect {
  color:rgb(235, 140, 85);
}
/* 시간선택 */
.selectTime{
  background: rgb(235, 140, 85);
  color: white;
}
/* 결제박스 */

</style>