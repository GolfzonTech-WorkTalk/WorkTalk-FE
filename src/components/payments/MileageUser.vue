<template>
  <div class="mileageContainer">
    <div>
      <div class="mileageOwnSortBox">
        <div class="mileageOwnBox">
          <span class="mileageOwnTitle">보유마일리지</span>
          <span class="mileageOwn">{{ mileageOwn }}</span>
        </div>
      </div>
      <div class="mileageItems">
        <div class="mileageItemTitle">
          <span class="mileageRoomTitle">방이름</span>
          <span class="mileageStatusTitle">적립/사용</span>
          <span class="mileageUserTitle">마일리지</span>
          <span class="mileageDateTitle">날짜</span>
        </div>
        <div v-for="item in mileageData" :key="item" class="mileageItem">
          <span class="mileageRoom">{{ item.roomName }}</span>
          <span class="mileageStatus" :class="item.status">{{ mileageStatusCheck(item.status) }}</span>
          <span class="mileageAmount">{{ mileageAmountCheck(item.status, item.mileageAmount) }}</span>
          <span class="mileageDate">{{ item.mileageDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mileageList} from '@/api/user.js'
// import {mileage} from '@/utils/dummy/paymentDummy.js'
export default {
  data(){
    return {
      mileageSort:'기간',
      mileageOwn:'0',
      mileageData:'',
    }
  },
  created(){
    this.mileageInquire()
  },
  methods: {
    async mileageInquire(){
      // let response = await mileage()
      let response = await mileageList()
      console.log(response)
      this.mileageOwn = response.data.count
      this.mileageData = response.data.data
    },
    mileageStatusCheck(status){
      let result
      if (status == 'SAVED'){
        result = '적립'
      } else if (status == 'USED'){
        result = '사용'
      }
      return result
    },
    mileageAmountCheck(status, mileageAmount){
      let result
      if (status == 'SAVED'){
        result = '+'+mileageAmount
      } else if (status == 'USED'){
        result = '-'+mileageAmount
      }
      return result
    },
  },
}
</script>

<style scoped>
.mileageContainer{
  position: relative;
  padding: 2vh 2vw;
  width: 40vw;
  height: 91.5vh;
  background: white;
  overflow-y: scroll;
}
.mileageContainer::-webkit-scrollbar{
  display: none;
}
.mileageOwnSortBox{
  display: flex;
  justify-content: space-between;
  margin: 2vh;
}
/* 보유마일리지 */
.mileageOwnBox{
  display: flex;
  justify-content: space-between;
  line-height: 10vh;
  font-weight: bold;
  padding: 0 1vw;
  width: 15vw;
  border: 1px solid gray;
  height: 10vh;
}
.mileageOwnTitle{
  font-size: 1.5rem;
}
.mileageOwn{
  font-size: 1.3rem;
}
/* 마일리지 내역 */
.mileageItemTitle, .mileageItem{
  display: flex;
  justify-content: space-around;
  font-weight: bold;
  width: 38vw;
  padding: 1vh 1vw;
  line-height: 3vh;
}
.mileageItemTitle span, .mileageItem span{
  text-align: center;
  width: 10vw;
}
.mileageItem{
  border-top: 1px solid gray;
  font-size: 0.8rem;
}
/* 적립/사용 */
.SAVED{
  color: rgb(101, 101, 196);
}
.USED{
  color: rgb(212, 69, 69);
}
</style>