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
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="paging(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { spaceAll } from '@/api/user.js'
/* 더미 값 */
import { spaceDumy } from '@/utils/dummy.js'
export default {
  data(){
    return {
      spaceItems: '',
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  // async
  created(){
    /* 더미 값 */
    this.reservationDataCall(this.pageNowNum)
    this.paging(this.pageNowNum)
    // console.log(this.spaceItems)
  },
  methods: {
    // 데이터 API로 불러오기
    async reservationDataCall(pageNowNum){
      console.log(pageNowNum)
      const responce = spaceDumy
      this.spaceItems = responce
      /*
      const responce = await spaceAll()
      this.spaceItems = responce.data
      */
    },
    itemLink(spaceName, spaceId, spaceType){
      return '/spaceOne/'+spaceName+'/'+ spaceId + '/' + spaceType
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
      this.reservationDataCall(this.pageNowNum)
    },
    // 페이지 번호 넘기기
    pageMove(value){
      if (value == 'next'){
        this.pageStartNum = this.pageStartNum + 5
        this.paging(this.pageStartNum)
      } else {
        if (this.pageStartNum == 1){
          this.paging(this.pageStartNum)
        }
        this.pageStartNum = this.pageStartNum - 5
        this.paging(this.pageStartNum)
      }
      this.reservationDataCall(this.pageNowNum)
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