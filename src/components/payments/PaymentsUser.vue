<template>
  <div class="paymentContainer">
    <div>
      <div class="paymentSortBox">
        <select v-model="paymentSort" class="paymentSort" @change="paymentDataRequest(pageNowNum)">
          <option value="기간" hidden>
            결제기간
          </option>
          <option v-for="item in paymentSortData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </select>
        <select v-model="paymentStatus" class="paymentSort payStatus" @change="paymentDataRequest(pageNowNum)">
          <option value="결제" hidden>
            결제상태
          </option>
          <option v-for="item in paymentStatusData" :key="item" :value="item.value">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="paymentItems">
        <div class="paymentItemTitle">
          <span class="spaceNameTitle">예약번호</span>
          <span class="spaceNameTitle">공간이름</span>
          <span class="roomNameTitle">방이름</span>
          <span class="reserveDateTitle">예약일</span>
          <span class="paymentStatusTitle">결제방법</span>
          <span class="reserveStatusTitle">예약상태</span>
          <span class="payAmountTitle">결제금액</span>
        </div>
        <div v-for="item in paymentData" :key="item" class="paymentItem">
          <span class="spaceName">{{ item.reserveId }}</span>
          <span class="spaceName">{{ item.spaceName }}</span>
          <span class="roomName">{{ item.roomName }}</span>
          <span class="reserveDate">{{ reserveDateCheck(item.reserveDate) }}</span>
          <span class="paymentStatus" :class="(item.paid=='0')?'paymentIng':'paymentEnd'">{{ paymentStatusCheck(item.payStatus, item.reserveStatus) }}</span>
          <span class="reserveStatus">{{ reserveStatusRename(item.reserveStatus) }}</span>
          <span class="payAmount" :class="reserveStatus(item.reserveStatus)">{{ item.payAmount }}</span>
        </div>
      </div>
      <div class="pageNumber">
        <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
        <span v-for="num in pageData" :key="num" :class="num.class" @click="paymentDataRequest(num.value)">{{ num.value }}</span>
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
        {'name':'전체','value':'기간'},
        {'name':'1개월','value':'1'},
        {'name':'3개월','value':'3'},
        {'name':'6개월','value':'6'},
        {'name':'1년','value':'12'},
      ],
      paymentSort:'기간',
      paymentStatusData: [
        {'name':'전 체','value':'결제'},
        {'name':'보증금결제','value':'DEPOSIT'},
        {'name':'선결제(완납)','value':'PREPAID'},
        {'name':'후결제(예정)','value':'POSTPAID_BOOKED'},
        {'name':'후결제(완납)','value':'POSTPAID_DONE'},
        {'name':'환불','value':'REFUND'},
      ],
      paymentStatus:'결제',
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
  },
  methods: {
    async paymentDataRequest(pageNowNum){
      this.paymentData = []
      let paymentStatus = this.paymentStatus
      let paymentSort = this.paymentSort
      this.pageNowNum = pageNowNum
      try {
        if (paymentStatus == '결제'){
          paymentStatus = ''
        }
        if (paymentSort == '기간'){
          paymentSort = ''
        } else {
          paymentSort = this.paymentSortChange(paymentSort)
        }
        console.log(pageNowNum-1, paymentStatus, paymentSort)
        let response = await paymentHistory(pageNowNum-1, paymentStatus, paymentSort)
        this.paymentData = response.data.data
        this.pageTotal =  response.data.count
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    paymentSortChange(paymentSort){
      const today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth()
      let month = thisMonth - paymentSort
      let findDate = new Date(thisYear, month).toISOString()
      findDate = findDate.slice(0,-5)
      console.log(findDate)
      return findDate
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
        payStatus = '보증금결제'
      } else if (payStatus == 'PREPAID'){
        payStatus = '선결제(완납)'
      } else if (payStatus == 'POSTPAID_BOOKED'){
        payStatus = '후결제(예정)'
      } else if (payStatus == 'POSTPAID_DONE'){
        payStatus = '후결제(완납)'
      } else {
        payStatus = '환불'
      }
      return payStatus
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
    reserveDateCheck(reserveDate){
      const date = reserveDate.slice(0,10)
      const time = reserveDate.slice(11,16)
      return `${date} ${time}`
      // let year = reserveDate[0]
      // let month = reserveDate[1]
      // let date = reserveDate[2]
      // let hour = reserveDate[3]
      // let minute = reserveDate[4]
      // if (hour < 10){
      //   hour = '0'+hour
      // }
      // if (minute < 10){
      //   minute = '0'+minute
      // }
      // return year+'-'+month+'-'+date+' '+hour+':'+minute
    },
    reserveStatus(reserveStatus){
      if (reserveStatus == 'CANCELED_BY_USER' || reserveStatus == 'CANCELED_BY_HOST'){
        return 'minus'
      } else {
        return 'plus'
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
  width: 8vw;
  letter-spacing: 0.1rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-left: 2vw;
}
.payStatus{
  width: 10vw;
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
  width: 8vw;
}
.roomNameTitle, .roomName{
  width: 10vw;
}
.reserveDateTitle, .reserveDate{
  width: 10vw;
}
.paymentStatusTitle, .paymentStatus{
  width: 8vw;
}
.reserveStatusTitle, .reserveStatus{
  width: 8vw;
}
.payAmountTitle,.payAmount{
  width: 8vw;
}
.minus{
  font-weight: bold;
  color: rgb(119, 33, 33);
}
.plus{
  font-weight: bold;
  color: rgb(33, 42, 119);
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