<template>
  <div class="recommendSpaceContainer">
    <i class="fa-solid fa-chevron-left fa-2x prevBtn" @click="movePrev" />
    <i class="fa-solid fa-chevron-right fa-2x nextBtn" @click="moveNext" />
    <div class="recommendSpaceItems">
      <search-space-one v-for="item in spaceViewItems" :key="item" :item="item" />
    </div>
  </div>
</template>

<script>
import searchSpaceOne from '@/components/searchSpace/spaceModule.vue'
import { spaceSearch } from '@/api/user.js'
import axios from 'axios'
export default {
  components:{
    searchSpaceOne,
  },
  emits:['address:find'],
  data(){
    return {
      spaceItems: [],
      spaceViewItems: [],
      transitionOn: true,
      slideStartNum:'0',
      slideMiddleNum:'1',
      slideEmdNum:'2',
      resetNum:'0',
      thisAddress:'',
    }
  },
  // async
  async created(){
    await this.getCurrentPosition()
  },
  methods: {
    // 공간불러오기
    // 데이터 API로 불러오기
    async reservationDataCall(){
      try {
        console.log(this.thisAddress)
        const responce = await spaceSearch(0,'','',this.thisAddress,'','','','')
        console.log(responce.data.data)
        this.spaceItems = responce.data.data
        this.recommendViewCheck()
      } catch (error){
        console.log(error)
      }
    },
    // 현재위치 좌표로 불러오기
    getCurrentPosition(){
      if (!navigator.geolocation){
        alert('위치 정보를 찾을 수 없습니다.1')
      } else {
        navigator.geolocation.getCurrentPosition(this.getPositionValue, this.geolocationError)
      }
    },
    getPositionValue(val){
      let CoordinatesX = val.coords.latitude
      let CoordinatesY = val.coords.longitude
      this.callAddress(CoordinatesX,CoordinatesY)
    },
    geolocationError(){
      alert('위치 정보를 찾을 수 없습니다.2')
    },
    async callAddress(x, y){
      console.log(x,y)
      try {
        await axios.get(
          'https://dapi.kakao.com/v2/local/geo/coord2address.json?x=' + y +'&y=' + x,
          {
            headers : {
              'Authorization' : `KakaoAK 79edba60f18097e8e335a7ca1b62de99`,
            },
          },
        ).then(response => {
          console.log(response)
          console.log(response.data.documents[0].road_address.region_2depth_name)
          let address = response.data.documents[0].address.region_2depth_name
          this.thisAddress = address
          this.reservationDataCall()
          this.$emit('address:find', address)
        })
      } catch (error){
        console.log(error)
      }
    },
    recommendViewCheck(){
      this.spaceViewItems = []
      this.spaceViewItems.push(this.spaceItems[this.slideStartNum])
      this.spaceViewItems.push(this.spaceItems[this.slideMiddleNum])
      this.spaceViewItems.push(this.spaceItems[this.slideEmdNum])
    },
    movePrev(){
      this.slideStartNum --
      this.slideMiddleNum --
      this.slideEmdNum --
      this.minusNumCheck(this.slideStartNum, this.slideMiddleNum, this.slideEmdNum)
      this.recommendViewCheck()
    },
    minusNumCheck(slideStartNum,slideMiddleNum,slideEmdNum){
      if (slideStartNum < 0){
        this.slideStartNum = this.spaceItems.length - 1
      }
      if (slideMiddleNum < 0){
        this.slideMiddleNum = this.spaceItems.length - 1
      }
      if (slideEmdNum < 0){
        this.slideEmdNum = this.spaceItems.length - 1
      }
    },
    moveNext(){
      this.slideStartNum ++
      this.slideMiddleNum ++
      this.slideEmdNum ++
      this.overNumCheck(this.slideStartNum, this.slideMiddleNum, this.slideEmdNum)
      this.recommendViewCheck()
    },
    overNumCheck(slideStartNum,slideMiddleNum,slideEmdNum){
      if (slideStartNum == this.spaceItems.length){
        this.slideStartNum = 0
      }
      if (slideMiddleNum == this.spaceItems.length){
        this.slideMiddleNum = 0
      }
      if (slideEmdNum == this.spaceItems.length){
        this.slideEmdNum = 0
      }
    },
  },
}
</script>

<style scoped>
/* 데이터 디자인 */
.recommendSpaceContainer{
  position: relative;
  display: flex;
  justify-content: center;
  width: 75vw;
}
.recommendSpaceItems {
  position: relative;
  font-size: 0.9rem;
  display: flex;
  align-content: center;
  height: 40vh;
  width: 72vw;
  overflow: hidden;
}
.prevBtn, .nextBtn{
  color: rgba(128, 128, 128, 0.411);
  position: absolute;
  top: 17vh;
  cursor: pointer;
}
.prevBtn{
  left: 0vw;
}
.nextBtn{
  right: 0vw;
}
.prevBtn:hover, .nextBtn:hover{
  color: rgb(44, 67, 141);
}
</style>