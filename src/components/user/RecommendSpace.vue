<template>
  <div class="recommendSpaceContainer">
    <i class="fa-solid fa-chevron-left fa-2x prevBtn" @click="movePrev" />
    <i class="fa-solid fa-chevron-right fa-2x nextBtn" @click="moveNext" />
    <div class="recommendSpaceItems">
      <div v-for="item in spaceItems" :key="item.spaceName" class="spaceItem" :style="{transform: 'translate3d(' + slideCoord + 'vw, 0, 0)',}" :class="{ 'slide-active' : transitionOn }">
        <div class="spaceImg">
          <img :src="require(`@/assets/${item.spaceImg}`)" alt="공간이미지">
        </div>
        <div class="linkBox">
          <router-link :to="itemLink(item.spaceName, item.spaceId, item.spaceType)">
            <div class="spaceTitle">
              <span>{{ item.spaceName }}</span>
            </div>
            <div class="spaceLocation">
              <i class="fa-solid fa-map-pin" />
              <span>{{ item.address }}</span>
            </div>
            <div class="spaceGradeReview">
              <i class="fa-regular fa-star" /> {{ item.grade }} <i class="fa-regular fa-comments" /> {{ item.review }}
            </div><br>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { spaceAll } from '@/api/user.js'
/* 더미 값 */
import { recommendSpaceDumy } from '@/utils/dummy/dummy.js'
export default {
  data(){
    return {
      spaceItems: '',
      transitionOn: true,
      slideCoord: '',
    }
  },
  // async
  created(){
    this.reservationDataCall(this.pageNowNum)
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(pageNowNum){
      console.log(pageNowNum)
      const responce = recommendSpaceDumy
      this.spaceItems = responce
      /*
      const responce = await spaceAll()
      this.spaceItems = responce.data
      */
    },
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },
    movePrev(){
      setTimeout(this.resetCardArrayToLeft, 500)
    },
    moveNext(){
      this.slideCoord = this.slideCoord -26
      this.transitionOn = true
      setTimeout(this.resetCardArrayToRight, 500)
    },
    resetCardArrayToRight(){
      this.spaceItems.splice(this.spaceItems.length, 0, this.spaceItems[0])
      this.spaceItems.splice(0, 1)
      this.transitionOn = false
      this.slideCoord = ''
    },
    resetCardArrayToLeft(){
      this.spaceItems.unshift(this.spaceItems[this.spaceItems.length-1])
      this.spaceItems.pop()
      this.transitionOn = false
      this.slideCoord = ''
    },
  },
}
</script>

<style scoped>
/* 데이터 디자인 */
.recommendSpaceContainer{
  position: relative;
}
.recommendSpaceItems {
  position: relative;
  font-size: 0.9rem;
  display: flex;
  align-content: center;
  width: 78vw;
  height: 40vh;
  overflow: hidden;
}
.spaceItem {
  position: relative;
  width: 24vw;
  height: 28vh;
  margin: 15px;
}
.spaceImg img {
  width: 24vw;
  height: 20vh;
}
.spaceTitle {
  font-size: 1.1rem;
  font-weight: bold;
}
.linkBox {
  padding: 10px;
  border-bottom: 1px solid gray;
}
.spaceGradeReview {
  float: right;
}
.prevBtn, .nextBtn{
  color: rgba(128, 128, 128, 0.411);
  position: absolute;
  top: 17vh;
  cursor: pointer;
}
.prevBtn{
  left: -1vw;
}
.nextBtn{
  right: -1vw;
}
/* 슬라이드 */
</style>