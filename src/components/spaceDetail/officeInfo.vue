<template>
  <div class="roomContainer">
    <p class="roomSpaceTile">
      오피스 정보
    </p>
    <div>
      <p class="roomDetail">
        {{ roomItems.roomDetail }}
      </p>
      <p class="roomTypePrice">
        가격 : {{ roomItems.roomPrice }}/일
      </p>
    </div>
    <office-calendar-vue v-if="roomItems != ''" :room-items="roomItems" @select-day:date-click="lookupReservation" />
    <div class="reservationResult">
      <p>이용기간</p>
      <p>시작일 : {{ initDate }}</p>
      <p>종료일 : {{ endDate }}</p>
      <p>* 월 단위 예약</p>
    </div>
    <div v-if="amount != ''" class="mileageBox">
      <!-- <div class="mileageBox"> -->
      <span>마일리지</span>
      <span class="mileageCheck" @click="mileageCheck">확 인</span>
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
        보증금 : {{ paymentAmount }}
      </p>
    </div>
    <div class="reservationSubmitBtn">
      <span @click="reservationSubmitCheck">예약하기</span>
    </div>
  </div>
</template>

<script>
import { roomOne, mileage } from '@/api/user.js'
import { reserveChoose, reserveChooseDelete, reservationReserve } from '@/api/reservation.js'
// import { selectOneRoomDumy2 } from '@/utils/dummy/dummy.js'
import OfficeCalendarVue from './reservation/OfficeCalendar.vue'
export default {
  components: {
    OfficeCalendarVue,
  },
  data(){
    return {
      // 룸정보
      roomItems:[],
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
      mileage: '',
      useMileage: '',
    }
  },
  // 룸정보 출력
  async created(){
    try {
      // let spaceResponce = await roomOne(spaceId)
      // console.log(spaceResponce)
      // this.roomItems = spaceResponce.data
      /* 더미 */
      
      const spaceId = this.$route.params.spaceId
      const response = await roomOne(spaceId)
      this.roomItems = response.data[0]
      this.price = response.data[0].roomPrice
      this.roomId = response.data[0].roomId
      this.selectRoomName = response.data[0].roomName
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
    // 날짜 출력
    lookupReservation(todayYYmm, initDay, endDay){
      // console.log(todayYYmm, initDay, endDay)
      if (initDay && endDay){
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
    // 마일리지 조회
    async mileageCheck(){
      let response = await mileage()
      console.log(response.data)
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
      let date = new Date()
      // 예얄 데이터 정의
      const reservationData = {
        'roomId': this.roomId,
        'checkInDate': this.initDate,
        'checkOutDate': this.endDate,
        'checkInTime': '08',
        'checkOutTime': '23',
        'reserveAmount': this.amount,
        'payAmount': this.paymentAmount,
        'payStatus': 'POSTPAID',
      }
      // console.log(reservationData)
      // 결제 데이터 정의
      let paymentData = {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: this.selectRoomName+'_'+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds(),
        // 룸ID_일련번호(고유값)
        // 고유값으로 채번하여 DB상에 저장(결제 위변조 작업시 필요)
        name: this.selectRoomName,
        amount: this.paymentAmount,
        customer_uid:this.$store.state.nickName+'_'+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds(),
      }
      // 결제로직
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
              reservationData.useMileage = this.useMileage
              reservationData.saveMileage = this.saveMileage
              reservationData.customer_uid = this.customer_uid
              console.log(reservationData)
              this.reservationPaymentSubmit(reservationData)
            } else {
              console.log('결제 실패')
              const dropReserve = reserveChooseDelete(response.data)
              console.log(dropReserve)
              console.log('결제DB삭제')
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
        console.log(error.response)
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
.reservationResult p:last-child{
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 1vw;
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
  cursor: pointer;
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
</style>