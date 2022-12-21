<template>
  <div class="roomContainer">
    <p class="roomSpaceTile">
      오피스 정보
    </p>
    <div class="imgContainer">
      <template v-if="(roomItems.roomImgDtoList == null)">
        <img class="officeInfoSpaceImg" :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
      </template>
      <template v-else>
        <div class="moveImgBox leftBox">
          <i class="fa-solid fa-chevron-left fa-lg moveBtn" @click="movePrev" />
        </div>
        <img class="officeInfoSpaceImg" :src="roomItems.roomImgDtoList[roomImgListNum].roomImgUrl" alt="공간이미지">
        <div class="moveImgBox rightBox">
          <i class="fa-solid fa-chevron-right fa-lg moveBtn" @click="moveNext" />
        </div>
      </template>
    </div>
    <div>
      <p class="roomDetail">
        {{ roomItems.roomDetail }}
      </p>
      <div>
        <p class="amenities">
          편의시설
        </p>
        <div class="officeInfoIconItems">
          <template v-if="roomItems.offeringOption == null">
            <span class="amenities">없음</span>
          </template>
          <template v-else>
            <div v-for="option in offeringOptionData" :key="option" class="officeInfoIconItem" :class="optionCheck(option.value)">
              <i :class="option.class" />
              <span>{{ option.name }}</span>
            </div>
          </template>
        </div>
      </div>
      <p class="roomTypePrice">
        가격 : {{ roomItems.roomPrice }}/일
      </p>
    </div>
    <office-calendar-vue @select-day:date-click="lookupReservation" />
    <div class="reservationResult">
      <p>이용기간</p>
      <p>시작일 : {{ initDate }}</p>
      <p>종료일 : {{ endDate }}</p>
      <p>* 월 단위 예약</p>
    </div>
    <div v-if="amount != ''" class="paymentBox">
      <p>
        총금액 : {{ amount }}
      </p>
      <p>
        보증금 : {{ paymentAmount }}
      </p>
    </div>
    <div class="reservationSubmitBtnBox">
      <template v-if="memberIsValid.tel != null && memberIsValid.activated == 1">
        <p class="reservationSubmitBtn" @click="reservationSubmitCheck">
          예약하기
        </p>
      </template>
      <template v-else>
        <p class="noShowNotel">
          예약하기
        </p>
        <template v-if="memberIsValid.activated == 0">
          <p class="noShowNotelWarning">
            * 노쇼 유저입니다.
          </p>
        </template>
        <template v-else-if="memberIsValid.tel == null && memberIsValid.activated == 1">
          <p class="noShowNotelWarning">
            * 전화번호가 없습니다.
          </p>
          <router-link to="/profile">
            <p class="telInput">
              전화번호 등록하러가기
            </p>
          </router-link>
        </template>
        <template v-else>
          <p class="noShowNotelWarning">
            * 로근인 후 예약이 가능합니다.
          </p>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { roomOne, isValid } from '@/api/user.js'
import { reserveChoose } from '@/api/reservation.js'
// import { selectOneRoomDumy2 } from '@/utils/dummy/dummy.js'
import OfficeCalendarVue from './reservation/OfficeCalendar.vue'
export default {
  components: {
    OfficeCalendarVue,
  },
  data(){
    return {
      // 룸정보
      roomItems:{
        offeringOption:'',
      },
      price:'', // 방가격
      roomId:'',
      /* 제출데이터 */
      // 예약
      initDate: '',
      endDate: '',
      amount:'', // 총결제금액
      // 결제
      selectRoomName: '',
      paymentAmount:'', // 보증금
      // 마일리지
      roomImgListNum:'0',
      offeringOptionData: [
        {'name':'주차','class':'fa-solid fa-square-parking fa-lg', 'value':'PARKING'},
        {'name':'인터넷/와이파이','class':'fa-solid fa-wifi fa-lg', 'value':'INTERNET_WIFI'},
        {'name':'화이트보드','class':'fa-solid fa-chalkboard fa-lg', 'value':'WHITEBOARD'},
        {'name':'TV/프로젝터','class':'fa-solid fa-utensils fa-lg', 'value':'TV_PROJECTOR'},
        {'name':'음식물반입가능','class':'fa-solid fa-utensils fa-lg', 'value':'FOOD'},
        {'name':'복사/인쇄기','class':'fa-solid fa-print fa-lg', 'value':'PRINTER'},
        {'name':'PC/노트북','class':'fa-solid fa-computer fa-lg', 'value':'PC_LAPTOP'},
        {'name':'의자/테이블','class':'fa-solid fa-chair fa-lg', 'value':'CHAIR_TABLE'},
        {'name':'정수기','class':'fa-solid fa-faucet-drip fa-lg', 'value':'WATER'},
      ],
      memberIsValid:{},
    }
  },
  // 룸정보 출력
  created(){
    this.callRoomInfo()
    this.callMemberTelNoshow()
  },
  methods: {
    // 룸정보 불러오기
    async callRoomInfo(){
      try {
        const spaceId = this.$route.params.spaceId
        const response = await roomOne(spaceId)
        console.log(response)
        this.roomItems = response.data[0]
        this.price = response.data[0].roomPrice
        this.roomId = response.data[0].roomId
        this.selectRoomName = response.data[0].roomName
      } catch (error){
        console.log(error)
      }
    },
    // 멤버의 노쇼,텔 확인
    async callMemberTelNoshow(){
      try {
        const memberIsValid = await isValid()
        console.log(memberIsValid.data)
        this.memberIsValid = memberIsValid.data
      } catch (error){
        console.log(error)
      }
    },
    // 이미지 전환
    movePrev(){
      if (this.roomImgListNum == '0'){
        this.roomImgListNum = this.roomItems.roomImgDtoList.length -1  
      } else {
        this.roomImgListNum --
      }
    },
    moveNext(){
      if (this.roomImgListNum == this.roomItems.roomImgDtoList.length -1 ){
        this.roomImgListNum = 0
      } else {
        this.roomImgListNum ++
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
    optionCheck(value){
      if (this.roomItems.offeringOption != ''){
        if (this.roomItems.offeringOption.indexOf(value) == -1){
          return 'officeInfoNoOption'
        } else {
          return
        }
      } else {
        return
      }
    },
    // 날짜 출력
    lookupReservation(todayYYmm, initDay, endDay){
      // console.log(todayYYmm, initDay, endDay)
      if (!initDay && !endDay){
        this.initDate = ''
        this.endDate = ''
        this.amount = ''
        this.paymentAmount = ''
      } else {
        if (initDay == ''){
          initDay = endDay
        } else if (endDay == ''){
          endDay = initDay
        }
        if (initDay<10){
          initDay = '0'+initDay
        }
        if (endDay<10){
          endDay = '0'+endDay
        }
        this.initDate = todayYYmm+initDay
        this.endDate = todayYYmm+endDay
        this.amount = (endDay-initDay+1) * Number(this.price)
        this.paymentAmount = this.amount * 0.2
      }
    },
    // 결제전 값 확인
    reservationSubmitCheck(){
      if (!this.$store.state.token){
        let message = '로그인을 해주세요'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
        this.$router.push('/login')
      } else if (!this.initDate){
        let message = '예약기간을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.endDate){
        let message = '예약기간을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reservationSubmit()
      }
    },
    // 결제로직
    async reservationSubmit(){
      const reservationData = {
        'roomId': this.roomId,
        'spaceType':this.$route.params.spaceType,
        'checkInDate': this.initDate,
        'checkOutDate': this.endDate,
        'checkInTime': '08',
        'checkOutTime': '23',
      }
      console.log(reservationData)
      try {
        // 예약임시데이터 저장
        let response = await reserveChoose(reservationData)
        console.log(response)
        this.$router.push('/user/reservationPayment/'+response.data)
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
.reservationResult p:last-child{
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 1vw;
}
.roomItems{
  margin-bottom: 3vh;
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
  width: 11vw;
}
/* 결제버튼 */
.reservationSubmitBtnBox{
  text-align: center;
}
.reservationSubmitBtn, .noShowNotel{
  border: 1px solid gray;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 1rem;
  padding: 0 2.3vw;
  margin: 1vw;
  border-radius: 10px;
  cursor: pointer;
}
.noShowNotel{
  background: rgba(197, 197, 197, 0.46);
  pointer-events: none;
}
.noShowNotelWarning{
  color: red;
  font-weight: bold;
}
.telInput{
  border: 1px solid gray;
  border-radius: 10px;
  width: 10vw;
  margin: auto;
  cursor: pointer;
}
.telInput:hover{
  background: rgba(156, 156, 220, 0.652);
  color: white;
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
/* 룸이미지 */
.imgContainer{
  position: relative;
  width: 19vw;
  height: 12vh;
}
.officeInfoSpaceImg{
  width: 19vw;
  height: 12vh;
}
.moveImgBox{
  position: absolute;
  height: 12vh;
  top: 0;
}
.moveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.moveBtn{
  padding-top: 6vh;
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