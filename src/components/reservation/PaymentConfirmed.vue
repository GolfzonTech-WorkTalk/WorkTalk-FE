<template>
  <div class="reservationPaymentContainer">
    <div class="warningBox">
      <span class="warning">* 현재 페이지에서 결제를 완료하지 않으면 예약은 취소됩니다.</span>
    </div>
    <div class="reservationRoomInfo">
      <div class="reservationRoomImgContainer">
        <p class="reservationRoomImgContainerTitle">
          [ 예약정보 ]
        </p>
        <template v-if="(roomInfo.roomImgDtoList == null)">
          <img class="reservationRoomImg" :src="require(`@/assets/noImg.gif`)" alt="공간이미지">
        </template>
        <template v-else>
          <div class="moveImgBox leftBox">
            <i class="fa-solid fa-chevron-left fa-lg moveBtn" @click="movePrev(item)" />
          </div>
          <img class="reservationRoomImg" :src="roomInfo.roomImgDtoList[roomInfo.roomImgListNum].roomImgUrl" alt="공간이미지">
          <div class="moveImgBox rightBox">
            <i class="fa-solid fa-chevron-right fa-lg moveBtn" @click="moveNext(item)" />
          </div>
        </template>
        <div class="reservationRoomText">
          <p class="reservationRoomTextTitle">
            [ 방의 이름 ]
          </p>
          <p class="reservationRoomTextContent">
            {{ roomInfo.roomName }}
          </p>
          <p class="reservationRoomTextTitle">
            [ 방의 설명 ]
          </p>
          <p class="reservationRoomTextContent">
            {{ roomInfo.roomDetail }}
          </p>
          <p class="reservationRoomTextTitle">
            [ 가격 ]
          </p>
          <p class="reservationRoomTextContent">
            {{ roomInfo.roomPrice }}
          </p>
          <p class="reservationRoomTextTitle">
            [ 편의시설 ]
          </p>
          <div class="officeInfoIconItems">
            <template v-if="roomInfo.offeringOption == null">
              <span class="amenities">없음</span>
            </template>
            <template v-else>
              <div v-for="option in offeringOptionData" :key="option" class="officeInfoIconItem" :class="optionCheck(roomInfo,option.value)">
                <i :class="option.class" />
                <span>{{ option.name }}</span>
              </div>
            </template>
          </div>
          <p class="reservationRoomTextTitle">
            [ 예약일자 ]
          </p>
          <p v-if="tempReserveId.spaceType == 1" class="reservationRoomTextContent">
            {{ tempReserveId.checkInDate }} ~ {{ tempReserveId.checkOutDate }}
          </p>
          <p v-else class="reservationRoomTextContent">
            {{ tempReserveId.checkInDate }} {{ timeCheck(tempReserveId.checkInTime,tempReserveId.checkOutTime) }}
          </p>
        </div>
      </div>
      <div class="reservationPaymentInfo">
        <p class="reservationRoomImgContainerTitle">
          [ 결제정보 ]
        </p>
        <div class="reservationPaymentType">
          <p class="reservationRoomTextTitle">
            [ 결제방법 ]
          </p>
          <div v-if="tempReserveId.spaceType == 1" class="payStatusItems">
            <span>보증금</span>
            <span>선납</span>
            <span class="payStatus">후납</span>
            <p>* 오피스는 후납만 가능합니다.</p>
          </div>
          <div v-else class="payStatusItems">
            <span :class="{'payStatus' : payStatus == 'DEPOSIT'}" @click="payStatusSelect('DEPOSIT')">보증금</span>
            <span :class="{'payStatus' : payStatus == 'PREPAID'}" @click="payStatusSelect('PREPAID')">선납</span>
            <span :class="{'payStatus' : payStatus == 'POSTPAID'}" @click="payStatusSelect('POSTPAID')">후납</span>
          </div>
        </div>
        <div class="mileageBox">
          <p class="reservationRoomTextTitle">
            [ 마일리지 ]
          </p>
          <span class="mileageCheck mileageBoxBtn" @click="mileageCheck">나의 마일리지 조회</span>
          <div>
            <p class="reservationRoomTextContent">
              보유 : {{ mileage }}
            </p>
            <p class="reservationRoomTextContent">
              사용 : <input v-model="mileageUsage" class="mileageUsageBox" type="text" placeholder="100단위 사용가능" @keypress="useMuleagePress" @change="useMuleageChange">
            </p>
            <span class="mileageUse mileageBoxBtn" @click="useMuleageCheckOK">적용</span>
          </div>
        </div>
        <div class="paymentBox">
          <p class="reservationRoomTextTitle">
            [ 결제금액 ]
          </p>
          <p class="reservationRoomTextContent">
            총금액 : {{ amount }}
          </p>
          <p class="reservationRoomTextContent">
            예약금 : {{ paymentAmount }}
          </p>
          <p class="reservationRoomTextContent">
            적립예정 마일리지 : {{ mileageSave }}
          </p>
        </div>
        <div class="paymentBtnBox">
          <p class="paymentBtn">
            {{ paymentAmount }}원 <strong @click="reservationPaymentSubmitCheck">결제하기</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roomOne, mileage } from '@/api/user.js'
import { reserveChoose, reservationReserve, reserveChooseDelete } from '@/api/reservation.js'
export default {
  data(){
    return {
      tempReserveId:{
        "tempReserveId": "string",
        "memberId": 0,
        "roomId": 1,
        "reserveDate": "2022-12-17T12:47:53.134Z",
        "spaceType": 2,
        "checkInDate": "2022-12-17",
        "checkOutDate": "2022-12-17",
        "checkInTime": 3,
        "checkOutTime": 5,
      },
      roomInfo:[{
        offeringOption:'',
      }],
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
      // 결제정보
      payStatus:'',
      amount:'',
      payAmount:'',
      reserveAmount:'',
      mileage:'',
      mileageUsage:'',
      mileageSave:'',
    }
  },
  async created(){
    try {
      const roomId = this.tempReserveId.roomId
      let spaceResponce = await roomOne(roomId)
      this.roomInfo = spaceResponce.data[0]
      this.roomInfo.roomImgListNum = 0
      if (this.tempReserveId.spaceType == 1){
        this.amount = (this.tempReserveId.checkOutDate.slice(-2) - this.tempReserveId.checkInDate.slice(-2) + 1) * this.roomInfo.roomPrice
      } else {
        this.amount = (this.tempReserveId.checkOutTime - this.tempReserveId.checkInTime) * this.roomInfo.roomPrice
      }
    } catch (error){
      console.log(error)
    }
  },
  methods:{
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
    // 편의시설 출력
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
    payStatusSelect(value){
      this.payStatus = value
      if (this.payStatus != value){
        this.mileageUsage = ''
      }
      if (value == 'PREPAID'){
        this.paymentAmount = this.amount
      } else {
        this.paymentAmount = this.amount * 0.2
      }
      if (value == 'POSTPAID'){
        this.mileageSave = '0'
      } else {
        this.mileageSave = this.amount * 0.05
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
      if (this.mileage < this.mileageUsage){
        this.mileageUsage = this.mileage
      }
    },
    useMuleageChange(){
      this.useMuleagePress()
      this.mileageUsage = parseInt(this.mileageUsage/100)*100
    },
    useMuleageCheckOK(){
      if (!this.mileage){
        let message = '마일리지 조회를 먼저해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.amount = (this.endTime - this.initTime + 1) *  this.price
        this.amount = this.amount - this.mileageUsage
        this.payStatusSelect(this.payStatus)
      }
    },
    reservationPaymentSubmitCheck(){
      let message
      if (this.payStatus == ''){
        message = '결제방법을 선택해주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reservationPaymentSubmit()
      }
    },
    // 결제로직
    async reservationPaymentSubmit(){
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
        'payStatus': this.payStatus,
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
      if (this.payStatus == 'POSTPAID'){
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
              reservationData.mileageUse = this.mileageUsage
              reservationData.mileageSave = this.mileageSave
              if (this.payStatus == 'POSTPAID'){
                reservationData.customer_uid = paymentData.customer_uid
              }
              console.log(reservationData)
              this.reservationPaymentDB(reservationData)
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
    async reservationPaymentDB(reservationData){
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
.reservationPaymentContainer{
  position: relative;
  background: white;
  width: 45vw;
  height: 75vh;
}
.reservationRoomImgContainerTitle{
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 2vh;
}
.warningBox{
  width: 45vw;
  text-align: center;
  margin: 2vh 0;
}
.warning{
  color: rgb(134, 30, 30);
  font-weight: bold;
}
/* 예약방정보 */
.reservationRoomInfo{
  position: relative;
  display: flex;
  width: 40vw;
  margin-left: 1vw;
}
/* 방의 사진 */
.reservationRoomImgContainer{
  position: relative;
  width: 20vw;
  margin-right: 1vw;
}
.reservationRoomImg{
  width: 20vw;
  height: 25vh;
}
.moveImgBox{
  position: absolute;
  height: 25vh;
  top: 5.5vh;
}
.moveImgBox:hover{
  background: rgba(255, 255, 255, 0.301);
}
.moveBtn{
  padding-top: 12vh;
  color: rgba(128, 128, 128, 0.712);
}
.leftBox{
  left: 0;
}
.rightBox{
  right: 0;
}
/* 방의 정보 글자 */
.reservationRoomTextTitle{
  font-weight: bold;
}
.reservationRoomTextContent{
  font-size: 0.8rem;
  margin-left: 1vw;
}
/* 편의시설 아이콘 */
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
/* 결제정보 */
.reservationPaymentType{
  position: relative;
}
.reservationPaymentInfo{
  position: relative;
  width: 20vw;
  border-left: 1px solid gray;
  padding-left: 1vw
}
/* 결제방법 */
.payStatusItems{
  margin-bottom: 5vh;
  padding-top: 1vh;
}
.payStatusItems span{
  border: 1px solid gray;
  border-radius: 15px;
  margin-left: 1vw;
  padding: 0.5vh 0.5vw;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
}
.payStatusItems p{
  position: absolute;
  font-weight: bold;
  font-size: 0.7rem;
  top: 0.5vh;
  left: 6vw;
}
.payStatus{
  background: rgba(96, 96, 209, 0.623);
  color: white;
}
/* 마일리지 */
.mileageBox{
  position: relative;
  margin-bottom: 5vh;
}
.mileageBoxBtn{
  border: 1px solid gray;
  border-radius: 15px;
  margin-left: 1vw;
  padding: 0.5vh 0.5vw;
  font-size: 0.5rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
}
.mileageCheck{
  position: absolute;
  top: 0;
  right: 0;
}
.mileageCheck:hover{
  background: rgba(96, 96, 209, 0.623);
  color: white;
}
.mileageUsageBox{
  border:0;
  width: 7vw;
  border-bottom: 1px solid gray;
}
.mileageUse{
  position: absolute;
  bottom: 0;
  right: 0;
}
/* 결제금액 */
.paymentBox{
  margin-bottom: 5vh;
}
/* 결제버튼 */
.paymentBtn{
  position: absolute;
  right: 0;
}
.paymentBtn strong{
  letter-spacing: 1rem;
  padding: 0.1vh;
  padding-left: 1rem;
  background: rgb(157, 157, 212);
  color: white;
  cursor: pointer;
}
</style>