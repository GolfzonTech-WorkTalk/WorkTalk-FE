<template>
  <div class="spaceItems" @scroll="listScroll">
    <span class="moveTopBtn" @click="moveTop">TOP</span>
    <div v-for="(item, index) in spaceItems" :id="index" :key="item.spaceName" class="spaceItem">
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
</template>

<script>
import { spaceDumy } from '@/utils/dummy/dummy.js'
export default {
  data(){
    return {
      spaceItems: [],
      pageNum:'0',
      scroll:'0',
    }
  },
  created(){
    this.reservationDataCall(this.pageNum)
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(pageNum){
      console.log(pageNum)
      try {
        const responce = await spaceDumy
        for (let i = 0; i < responce.length; i++){
          this.spaceItems.push(responce[i])
        }
      } catch (error){
        console.log(error)
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },
    // 스크롤체크
    listScroll(e){
      const { scrollHeight, scrollTop, clientHeight } = e.target
      console.log(scrollHeight, scrollTop, clientHeight)
      console.log(scrollHeight <= scrollTop + clientHeight + 50)
      const isBottom = (scrollHeight <= scrollTop + clientHeight + 50)
      // const isAtTheBottom = scrollHeight === scrollTop + clientHeight
      // // 일정 한도 밑으로 내려오면 함수 실행
      if (isBottom){
        this.pageNum ++
        this.$store.dispatch('SPINNERVIEW', true)
        setTimeout(() => this.reservationDataADD(this.pageNum), 1000)
      }
    },
    async reservationDataADD(pageNum){
      console.log(pageNum)
      const responce = await spaceDumy
      for (let i = 0; i < responce.length; i++){
        this.spaceItems.push(responce[i])
      }
      this.$store.dispatch('SPINNERVIEW', false)
    },
  },
}
</script>

<style scoped>
.spaceItems {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100vw;
  padding: 0 13vw;
  height: 93vh;
  overflow-y: scroll;
}
.spaceItems::-webkit-scrollbar {
  display: none;
}
.spaceItem {
  position: relative;
  width: 22vw;
  height: 28vh;
  margin: 15px;
}
.spaceImg img {
  width: 22vw;
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
.moveTopBtn{
  position: absolute;
  bottom: 3vh;
  right: 10vw;
}
</style>