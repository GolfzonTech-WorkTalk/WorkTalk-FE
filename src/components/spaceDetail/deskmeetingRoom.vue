<template>
  <div class="roomContainer">
    <p class="roomSpaceTile">
      방정보
    </p>
    <div v-for="item in roomItems" :key="item" class="roomItems">
      <input v-model="roomReservationView" type="radio" :value="item.roomId" @click="reservationReset(item)">
      <span class="roomName">{{ item.roomName }}</span>
      <div class="imgContainer">
        <template v-if="(item.roomImgDtoList == null)">
          <img class="spaceImg" :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
        </template>
        <template v-else>
          <div class="moveImgBox leftBox">
            <i class="fa-solid fa-chevron-left fa-lg moveBtn" @click="movePrev(item)" />
          </div>
          <img class="spaceImg" :src="item.roomImgDtoList[item.roomImgListNum].roomImgUrl" alt="공간이미지">
          <div class="moveImgBox rightBox">
            <i class="fa-solid fa-chevron-right fa-lg moveBtn" @click="moveNext(item)" />
          </div>
        </template>
      </div>
      <p class="roomTypePrice">
        운용시간 : {{ timeCheck(item.workStart, item.workEnd) }}
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
          <span v-if="(initTime != null)">{{ timeCheck(initTime, endTime) }}</span>
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
          <span class="mileageCheck" @click="mileageCheck">조회</span>
          <div>
            <p>보유 : {{ mileage }}</p>
            <input v-model="useMileage" class="useMileageBox" type="text" placeholder="100단위 사용가능" @keypress="useMuleagePress" @change="useMuleageChange">
            <span class="mileageCheck" @click="useMuleageCheckOK">사용</span>
          </div>
        </div>
        <div v-if="amount != ''" class="paymentBox">
          <p>
            총금액 : {{ amount }}
          </p>
          <p>
            예약금 : {{ paymentAmount }}
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
import { roomOne, mileage } from '@/api/user.js'
import { reservationData, reserveChoose, reservationReserve, reserveChooseDelete } from '@/api/reservation.js'
// import { selectOneRoomDumy } from '@/utils/dummy/dummy.js'
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
      initTime:null,
      endTime:null,
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
      try {
        const spaceId = this.$route.params.spaceId
        let spaceResponce = await roomOne(spaceId)
        this.roomItems = spaceResponce.data
        for (let i = 0; i < this.roomItems.length; i++){
          this.roomItems[i].roomImgListNum = 0
        }
      } catch (error){
        console.log(error)
      }
      /* 더미 */
      // this.roomItems = selectOneRoomDumy
    } catch (error){
      console.log(error)
    }
  },
  methods: {
    movePrev(item){
      if (item.roomImgListNum == '0'){
        item.roomImgListNum = item.roomImgDtoList.length -1  
      } else {
        item.roomImgListNum --
      }
    },
    moveNext(item){
      if (item.roomImgListNum == item.roomImgDtoList.length -1 ){
        item.roomImgListNum = 0
      } else {
        item.roomImgListNum ++
      }
    },
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
      this.initTime = null
      this.endTime = null
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
    async lookupReservation(reserveDay){
      // console.log(reserveDay)
      this.timelineView = true
      // 예약데이터
      this.reservationDay = reserveDay
      this.initTime = null
      this.endTime = null
      this.amount = ''
      // 결제데이터
      this.paymentType = ''
      this.paymentAmount = ''
      this.useMileage = ''
      this.saveMileage = ''
      try {
        const roomId = this.roomReservationView
        const roomType = this.roomType
        const initDate = this.reservationDay
        const endDate = this.reservationDay
        const initTime = null
        const endTime = null
        let response = await reservationData(roomId, roomType, initDate, endDate, initTime, endTime)
        console.log(response)
        this.reservation = response.data
      } catch (error){
        console.log(error)
      }
      this.createTime()
    },
    // 시간출력 async
    async createTime(){
      this.timeDatas = []
      let workStart = Number(this.workStart)
      let workEnd = Number(this.workEnd)
      // 시간생성
      await this.time(workStart, workEnd)
      // 오늘일 경우
      const today = new Date()
      const CurrentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      const CurrentTime = today.getHours()
      if (CurrentDate == this.reservationDay){
        await this.todayCheck(CurrentTime)
      }
      // 예약날짜 제외처리
      this.reserveCheck(workStart, workEnd)
      // 시간선택 처리 함수
      if (this.initTime != '' || this.endTime != ''){
        this.selectTimeCheck(workStart, workEnd)
      }
      if (this.endTime != '' && this.initTime != ''){
        console.log('계산')
        this.amount = (this.endTime - this.initTime) *  this.price
      }
    },
    // 시간생성
    time(workStart, workEnd){
      // console.log(workStart, workEnd)
      for (let i = workStart; i < workEnd; i++){
        if (i < 10){
          this.timeDatas.push({'name':'0'+i, 'value':i, 'class':'timeItem'})
        } else {
          this.timeDatas.push({'name':i, 'value':i, 'class':'timeItem'})
        }
      }
    },
    // 오늘일 경우 현재시간 예외처리
    todayCheck(CurrentTime){
      for (let j = 0; j < this.timeDatas.length; j++){
        let time = this.timeDatas[j].value
        if (time <= CurrentTime){
          this.timeDatas[j].class = 'timeItem reserved'
        }
      }
    },
    // 예약날짜 제외처리 함수
    reserveCheck(){
      for (let i = 0; i < this.reservation.length; i++){
        let initTime = this.reservation[i].initTime
        let endTime = this.reservation[i].endTime
        for (let j = 0; j < this.timeDatas.length; j++){
          let time = this.timeDatas[j].value
          if (time == initTime || time > initTime && time < endTime){
            this.timeDatas[j].class = 'timeItem reserved'
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
        if (time == initTime || time > initTime && time < endTime){
          if (this.timeDatas[i].class == 'timeItem reserved'){
            let message = '중간에 예약이 있습니다. 다시 선택해 주세요.'
            this.$store.dispatch('MODALVIEWCLICK', true)
            this.$store.dispatch('MODALMESSAGE', message)
            this.endTime = this.timeDatas[i].value
          } else {
            this.timeDatas[i].class = 'timeItem selectTime'
          }
        }
      }
    },
    // 시간선택 처리 및 가격계산 함수
    clickTime(item){
      const num = item.value
      if (item.class == 'timeItem'){
        if (!this.initTime){
          this.initTime = num
          this.endTime = num+1
        } else if (this.initTime > num){
          this.initTime = num
        } else if (this.endTime < num || this.endTime == num){
          this.endTime = num+1
        }
      } else if (item.class == 'timeItem selectTime'){
        if (this.endTime - this.initTime == 1){
          this.initTime = null
          this.endTime = null
        } else if (this.endTime - this.initTime != 1){
          if (this.initTime == num){
            this.initTime = this.initTime+1
          } else if (this.endTime == num+1){
            this.endTime = this.endTime - 1
          } else if (this.initTime - num < this.endTime - 1 - num){
            this.initTime = num
          } else if (this.initTime - num > this.endTime - 1 - num){
            this.endTime = num+1
          }
        }
      }
      this.createTime()
    },
    // 시간출력
    timeCheck(initTime, endTime){
      if (initTime < 10){
        initTime = '0'+initTime
      }
      if (endTime < 10){
        endTime = '0'+endTime
      }
      return `${initTime}:00 ~ ${endTime}:00`
    },
    // 결제방식 선택
    paymentTypeSelect(value){
      this.paymentType = value
      if (this.paymentType != value){
        this.useMileage = ''
      }
      if (value == 'PREPAID'){
        this.paymentAmount = this.amount
      } else {
        this.paymentAmount = this.amount * 0.2
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
      let response = await mileage()
      console.log(response)
      this.mileage = response.data
      // 더미
      // this.mileage = 10000
    },
    // 마일리지 사용체크
    useMuleagePress(){
      if (this.mileage < this.useMileage){
        this.useMileage = this.mileage
      }
    },
    useMuleageChange(){
      this.useMuleagePress()
      this.useMileage = parseInt(this.useMileage/100)*100
    },
    useMuleageCheckOK(){
      if (!this.mileage){
        let message = '마일리지 조회를 먼저해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.amount = (this.endTime - this.initTime + 1) *  this.price
        this.amount = this.amount - this.useMileage
        this.paymentTypeSelect(this.paymentType)
      }
    },
    // 결제전 값 확인
    reservationSubmitCheck(){
      let message
      if (!this.$store.state.token){
        message = '로그인을 해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        this.$router.push('/login')
      } else if (!this.reservationDay){
        message = '예약날짜를 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.initTime || !this.endTime){
        message = '예약시간을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.paymentType){
        message = '결제유형을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reservationSubmit()
      }
    },
    // 결제로직
    async reservationSubmit(){
      let date = new Date()
      // 예약 데이터 정의
      const reservationData = {
        'roomId': this.roomReservationView,
        'checkInDate': this.reservationDay,
        'checkOutDate': this.reservationDay,
        'checkInTime': this.initTime,
        'checkOutTime': this.endTime,
        'reserveAmount': this.amount,
        'payAmount': this.paymentAmount,
        'payStatus': this.paymentType,
      }
      // console.log(reservationData)
      // 결제 데이터 정의
      let paymentData = {
        pay_method: "card",
        merchant_uid: this.roomReservationView+'_'+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds(),
        // 룸ID_일련번호(고유값)
        // 고유값으로 채번하여 DB상에 저장(결제 위변조 작업시 필요)
        name: this.selectRoomName,
        amount: this.paymentAmount,
      }
      if (this.paymentType == 'POSTPAID'){
        paymentData.pg = "kakaopay.TCSUBSCRIP"
        paymentData.customer_uid = this.$store.state.nickName+'_'+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()
      } else {
        paymentData.pg = "kakaopay"
      }
      console.log(paymentData)
      //결제로직
      try {
        let response = await reserveChoose(reservationData)
        console.log('임시더미')
        console.log(response)
        if (response.status == 200){
          // 결제로직
          const { IMP } = window
          IMP.init('imp38067385')
          IMP.request_pay(paymentData, rsp => { // callback
            if (rsp.success){
              console.log('결제 성공')
              console.log(rsp)
              reservationData.reserveId = response.data
              reservationData.imp_uid = rsp.imp_uid
              reservationData.merchant_uid = rsp.merchant_uid
              reservationData.mileageUse = this.useMileage
              reservationData.mileageSave = this.saveMileage
              if (this.paymentType == 'POSTPAID'){
                reservationData.customer_uid = paymentData.customer_uid
              }
              console.log(reservationData)
              this.reservationPaymentSubmit(reservationData)
            } else {
              console.log('결제 실패')
              const dropReserve = reserveChooseDelete(response.data)
              console.log(dropReserve)
              console.log('결제DB삭제')
              this.roomReservationView = ''
            }
          })
        }
      } catch (error){
        console.log(error)
      }
    },
    async reservationPaymentSubmit(reservationData){
      console.log('DB넣기')
      console.log(reservationData)
      try {
        let response = await reservationReserve(reservationData)
        console.log(response)
        this.$router.push('/user/reservation')
      } catch (error){
        console.log(error)
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
  cursor: pointer;
}
.useMileageBox{
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0.5vh 0.5vw;
  width: 11vw;
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
/* 룸이미지 */
.imgContainer{
  position: relative;
  width: 19vw;
  height: 15vh;
}
.spaceImg{
  width: 19vw;
  height: 15vh;
}
.moveImgBox{
  position: absolute;
  height: 15vh;
  top: 0;
}
.moveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.moveBtn{
  padding-top: 8vh;
  color: rgba(128, 128, 128, 0.712);
}
.leftBox{
  left: 0;
}
.rightBox{
  right: 0;
}
</style>