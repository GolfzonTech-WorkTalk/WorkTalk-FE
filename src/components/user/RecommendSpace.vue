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
// import { spaceAll } from '@/api/user.js'
/* 더미 값 */
import { recommendSpaceDumy } from '@/utils/dummy/dummy.js'
export default {
  components:{
    searchSpaceOne,
  },
  data(){
    return {
      spaceItems: [],
      spaceViewItems: [],
      transitionOn: true,
      slideStartNum:'0',
      slideMiddleNum:'1',
      slideEmdNum:'2',
      resetNum:'0',
    }
  },
  // async
  created(){
    this.reservationDataCall()
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(){
      const responce = recommendSpaceDumy
      this.spaceItems = responce
      this.recommendViewCheck()
      /*
      const responce = await spaceAll()
      this.spaceItems = responce.data
      */
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
  width: 78vw;
}
.recommendSpaceItems {
  position: relative;
  font-size: 0.9rem;
  display: flex;
  align-content: center;
  height: 40vh;
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