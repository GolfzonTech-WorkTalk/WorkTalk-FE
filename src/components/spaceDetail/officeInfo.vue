<template>
  <div class="roomContainer">
    <p class="roomSpaceTile">
      오피스 정보
    </p>
    <div v-for="item in roomItems" :key="item">
      <p class="roomDetail">
        {{ item.roomDetail }}
      </p>
      <p class="roomTypePrice">
        가격 : {{ item.roomPrice }}/일
      </p>
    </div>
    <office-calendar-vue @select-day:date-click="lookupReservation" />
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
        <input v-model="useMileage" class="useMileageBox" type="text" placeholder="사용할 마일리지" @keypress="useMuleageCheck" @change="useMuleageCheckOK">
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
// import { spaceOne, roomOne, reservationData, buyer, reserve, payment, mileageCheck } from '@/api/user.js'
import { selectOneRoomDumy2 } from '@/utils/dummy.js'
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
      // const spaceId = this.$route.params.spaceId
      // let spaceResponce = await roomOne(spaceId)
      // console.log(spaceResponce)
      // this.roomItems = spaceResponce.data
      /* 더미 */
      this.roomItems = selectOneRoomDumy2
      this.price = selectOneRoomDumy2[0].roomPrice
      this.roomId = selectOneRoomDumy2[0].roomId
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
        this.initDate = todayYYmm+initDay
        this.endDate = todayYYmm+endDay
        this.amount = (endDay-initDay+1) * Number(this.price)
        this.paymentAmount = this.amount * 0.2
      }
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
        let message = '예약기간을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reservationSubmit()
      }
    },
    // 결제로직
    async reservationSubmit(){
      // 결제검증
      if (this.reservationSubmitCheck()){
        return
      }

      // 예얄 데이터 정의
      const reservationData = {
        'roomId': this.roomId,
        'initDate': this.initDate,
        'endDate': this.endDate,
        'initTime': '',
        'endTime': '',
        'amount': this.amount,
        'paymentStatus': '',
      }
      console.log(reservationData)

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
      let impResponse
      const { IMP } = window
      IMP.init('imp82350026')
      IMP.request_pay(paymentData, rsp => { // callback
        if (rsp.success){
          console.log('결제 성공')
        } else {
          console.log('결제 실패')
        }
        impResponse = rsp
        console.log(impResponse)
      })
      /* rsp값
      success : true/false
      pay_uid : rsp.imp_uid
      pay_statue : this.paymentType
      amount : this.amount
      merchant_uid: "ORD20180131-0000012"
      */

      /*
      try {
        let response = await reserve(paymentData)
        console.log(response)
      } catch (error) {
        console.log(error)
      }

      try {
        let response = await payment(paymentData)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
      */
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