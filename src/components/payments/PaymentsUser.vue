<template>
  <div class="paymentContainer">
    <div>
      <div class="paymentSortBox">
        <select v-model="paymentSort" class="paymentSort">
          <option value="기간" hidden>
            결제기간
          </option>
          <option v-for="item in paymentSortData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="paymentItems">
        <div class="paymentItemTitle">
          <span class="spaceNameTitle">공간이름</span>
          <span class="roomNameTitle">방이름</span>
          <span class="reserveDateTitle">예약일</span>
          <span class="paymentStatusTitle">결제방법</span>
          <span class="reserveAmountTitle">총금액</span>
          <span class="reserveAmountTitle">결제금액</span>
          <span class="reserveAmountTitle">결제예정금액</span>
        </div>
        <div v-for="item in paymentData" :key="item" class="paymentItem">
          <span class="spaceName">{{ item.spaceName }}</span>
          <span class="roomName">{{ item.roomName }}</span>
          <span class="reserveDate">{{ reserveDateCheck(item.reserveDate) }}</span>
          <span class="paymentStatus" :class="(item.paid=='0')?'paymentIng':'paymentEnd'">{{ paymentStatusCheck(item.payStatus, item.reserveStatus) }}</span>
          <span class="reserveAmount">{{ item.reserveAmount }}</span>
          <span class="reserveAmount">{{ item.payAmount }}</span>
          <span class="reserveAmount">{{ reserveAmoutBalance(item.payStatus, item.reserveAmount, item.payAmount) }}</span>
        </div>
      </div>
      <div class="pageNumber">
        <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
        <span v-for="num in pageData" :key="num" :class="num.class" @click="paging(num.value)">{{ num.value }}</span>
        <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
      </div>
    </div>
  </div>
</template>

<script>
// import {payment} from '@/utils/dummy/paymentDummy.js'
import {paymentHistory} from '@/api/reservation.js'
export default {
  data(){
    return {
      paymentSortData: [
        {'name':'전체','value':''},
        {'name':'1개월','value':'1'},
        {'name':'3개월','value':'3'},
        {'name':'6개월','value':'6'},
        {'name':'1년','value':'12'},
      ],
      paymentSort:'기간',
      paymentData:[],
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.paymentDataRequest(this.pageNowNum)
    this.paging(this.pageNowNum)
  },
  methods: {
    async paymentDataRequest(pageNowNum){
      console.log(pageNowNum-1)
      let response = await paymentHistory(pageNowNum-1)
      console.log(response)
      this.paymentData = response.data.data
      this.$store.dispatch('SPINNERVIEW', false)
    },
    roomTypeCheck(roomType){
      let result
      if (roomType == 'OFFICE'){
        result = '오피스'
      } else if (roomType == 'DESK'){
        result = '데스크'
      } else {
        result = '회의실'
      }
      return result
    },
    paymentStatusCheck(payStatus){
      if (payStatus == 'DEPOSIT'){
        payStatus = '보증금'
      } else if (payStatus == 'PREPAID'){
        payStatus = '선납'
      } else if (payStatus == 'POSTPAID' || payStatus == 'POSTPAID_BOOKED' || payStatus == 'POSTPAID_DONE'){
        payStatus = '후납'
      } else {
        payStatus = '환불'
      }
      return payStatus
    },
    reserveDateCheck(reserveDate){
      return reserveDate.slice(0,10)+' '+reserveDate.slice(11,-3)
    },
    reserveAmoutBalance(payStatus, reserveAmount, payAmount){
      if (payStatus == 'POSTPAID_DONE' || payStatus == 'PREPAID'){
        return 0
      } else {
        return reserveAmount-payAmount
      }
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      // 전체 데이터의 길이... this.reservationData.length
      let total = 111
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
      for (let i = this.pageStartNum; i < lastPage; i++){
        if (pageNowNum == i){
          this.pageData.push({'value':i,'class':'pageNowNum'})
        } else {
          this.pageData.push({'value':i,'class':''})
        }
      }
      this.paymentDataRequest(this.pageNowNum)
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
      this.paymentDataRequest(this.pageNowNum)
    },
  },
}
</script>

<style scoped>
.paymentContainer{
  position: relative;
  padding: 2vh 2vw;
  width: 50vw;
  height: 91.5vh;
  background: white;
  overflow-y: scroll;
}
/* 정렬박스 */
.paymentSortBox{
  text-align: right;
  margin: 2vh 0;
}
.paymentSort{
  font-size: 1rem;
  width: 6vw;
}
/* 결제내역출력 */
.paymentContainer::-webkit-scrollbar{
  display: none;
}
.paymentItemTitle, .paymentItem{
  width: 50vw;
  display: flex;
  font-weight: bold;
  padding: 2vh 0vw;
  line-height: 3vh;
}
.paymentItem{
  border-top: 1px solid gray;
  font-size: 0.8rem;
}
.paymentItemTitle span, .paymentItem span{
  text-align: center;
}
.spaceNameTitle, .spaceName {
  width: 7vw;
}
.roomNameTitle, .roomName{
  width: 7vw;
}
.reserveDateTitle, .reserveDate{
  width: 9vw;
}
.paymentStatusTitle, .paymentStatus{
  width: 7vw;
}
.reserveAmountTitle,.reserveAmount{
  width: 6.5vw;
}
.paymentIng{
  font-weight: bold;
  color: rgb(33, 119, 33);
}
/* 페이징 */
.pageNumber{
  margin-top: 2vh;
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
</style>