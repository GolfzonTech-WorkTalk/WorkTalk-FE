<template>
  <div class="spaceAllContainer">
    <div v-for="item in spaceItems" :key="item.spaceName" class="spaceItem">
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
    <div>
      <span>more</span>
    </div>
  </div>
</template>

<script>
import { spaceAll } from '@/api/user.js'
/* 더미 값 */
// import { spaceDumy } from '@/utils/dummy/dummy.js'
export default {
  data(){
    return {
      spaceItems: '',
    }
  },
  // async
  created(){
    /* 더미 값 */
    this.reservationDataCall()
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(){
      // const responce = spaceDumy
      // this.spaceItems = responce
      try {
        const responce = await spaceAll()
        this.spaceItems = responce.data
      } catch (error){
        console.log(error)
      }
    },
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
    },
  },
}
</script>

<style scoped>
/* 데이터 디자인 */
.spaceAllContainer {
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 78vw;
  height: 80vh;
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
/* 페이지 넘버 */
.pageNumber{
  margin: 5vh 0;
  width: 80vw;
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
.reservationETC{
  width: 4vw;
}
</style>