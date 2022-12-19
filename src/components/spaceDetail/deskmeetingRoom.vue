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
      <p class="roomDetail">
        {{ item.roomDetail }}
      </p>
      <p class="roomTypePrice">
        운용시간 : {{ timeCheck(item.workStart, item.workEnd) }}
      </p>
      <p class="roomTypePrice">
        수용인원 : {{ useNumber(item.roomType) }}
      </p>
      <p class="roomTypePrice">
        가격 : {{ item.roomPrice }}/시간
      </p>
      <div>
        <p class="amenities">
          편의시설
        </p>
        <div class="officeInfoIconItems">
          <template v-if="item.offeringOption == null">
            <span class="amenities">없음</span>
          </template>
          <template v-else>
            <div v-for="option in offeringOptionData" :key="option" class="officeInfoIconItem" :class="optionCheck(item,option.value)">
              <i :class="option.class" />
              <span>{{ option.name }}</span>
            </div>
          </template>
        </div>
      </div>
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
        <div v-if="amount != ''" class="paymentBox">
          <p>
            총금액 : {{ amount }}
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
import { roomOne } from '@/api/user.js'
import { reservationData, reserveChoose } from '@/api/reservation.js'
import DeskMeetingCalendarVue from './reservation/DeskMeetingCalendar.vue'
export default {
  components: {
    DeskMeetingCalendarVue,
  },
  data(){
    return {
      // 룸정보
      roomItems:[{
        offeringOption:'',
      }],
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
      offeringOptionData: [
        {'name':'주차','class':'fa-solid fa-square-parking fa-lg', 'value':'PARKING'},
        {'name':'인터넷/와이파이','class':'fa-solid fa-wifi fa-lg', 'value':'INTERNET_WIFI'},
        {'name':'화이트보드','class':'fa-solid fa-tv fa-lg', 'value':'WHITEBOARD'},
        {'name':'TV/프로젝터','class':'fa-solid fa-utensils fa-lg', 'value':'TV_PROJECTOR'},
        {'name':'음식물반입가능','class':'fa-solid fa-utensils fa-lg', 'value':'FOOD'},
        {'name':'복사/인쇄기','class':'fa-solid fa-print fa-lg', 'value':'PRINTER'},
        {'name':'PC/노트북','class':'fa-solid fa-computer fa-lg', 'value':'PC_LAPTOP'},
        {'name':'의자/테이블','class':'fa-solid fa-chair fa-lg', 'value':'CHAIR_TABLE'},
        {'name':'정수기','class':'fa-solid fa-faucet-drip fa-lg', 'value':'WATER'},
      ],
    }
  },
  // 룸정보 출력
  async created(){
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
  },
  methods: {
    // 이미지 전환
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
    // 옵션출력
    optionCheck(item,value){
      if (item.offeringOption != null || item.offeringOption != ''){
        if (item.offeringOption.indexOf(value) == -1){
          return 'officeInfoNoOption'
        } else {
          return
        }
      } else {
        return
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
      this.workStart = item.workStart
      this.workEnd = item.workEnd
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
    selectTimeCheck(){
      for (let i = 0; i < this.timeDatas.length; i++){
        let time = this.timeDatas[i].value
        let initTime = this.initTime
        let endTime = this.endTime
        // console.log(time,initTime,endTime)
        if (time == initTime || time > initTime && time < endTime){
          // console.log('select')
          if (this.timeDatas[i].class == 'timeItem reserved'){
            let message = '중간에 예약이 있습니다. 다시 선택해 주세요.'
            this.$store.dispatch('MODALVIEWCLICK', true)
            this.$store.dispatch('MODALMESSAGE', message)
            this.endTime = this.timeDatas[i].value
          } else {
            // console.log(this.timeDatas[i].class)
            this.timeDatas[i].class = 'timeItem selectTime'
            // console.log(this.timeDatas[i].class)
          }
        } else {
          if (this.timeDatas[i].class != 'timeItem reserved'){
            this.timeDatas[i].class = 'timeItem'
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
      if (this.endTime != null && this.initTime != null){
        // console.log('계산')
        this.amount = (this.endTime - this.initTime) *  this.price
      }
      this.selectTimeCheck()
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
      } else {
        this.reservationSubmit()
      }
    },
    async reservationSubmit(){
      const reservationData = {
        'roomId': this.roomReservationView,
        'spaceType':this.$route.params.spaceType,
        'checkInDate': this.reservationDay,
        'checkOutDate': this.reservationDay,
        'checkInTime': this.initTime,
        'checkOutTime': this.endTime,
      }
      console.log(reservationData)
      try {
        // 예약임시데이터 저장
        let response = await reserveChoose(reservationData)
        console.log(response)
        // this.$router.push('/user/reservationPayment/'+response.reserveId)
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
  font-size: 1rem;
}
.roomName{
  margin-left: 0.5vw;
  font-size: 0.8rem;
}
.roomTypePrice, .roomDetail, .amenities{
  margin: 0.5vh 0.5vw;
  font-size: 0.8rem;
}
.reservationResult{
  margin-top: 1vh;
  margin-left: 0.5vw;
  margin-bottom: 2vh;
  border-bottom: 2px solid gray;
  font-size: 0.8rem;
}
.roomItems{
  margin-bottom: 3vh;
}
.paymentBox{
  position: relative;
  padding: 1vh 0vw;
  margin-left: 0.5vw;
  border-bottom: 2px solid gray;
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
/* 아이콘 */
.officeInfoIconItems {
  margin-top: 1vh;
  margin-left: 1vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.officeInfoIconItem {
  display: flex;
  align-items: center;
  line-height: 1.5vh;
  width: 5.5vw;
  height: 5vh;
}
.officeInfoIconItem i{
  margin-right: 0.5vw;
}
.officeInfoIconItem span{
  font-size: 0.1rem;
}
.officeInfoNoOption{
  display: none;
}
</style>