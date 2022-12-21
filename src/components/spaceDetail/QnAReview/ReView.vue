<template>
  <div class="ReviewContainer">
    <template v-if="ReviewList.length == 0">
      <span class="noReview">등록후기 없음</span>
    </template>
    <template v-else>
      <div v-for="item in ReviewList" :key="item" class="Reviewitem">
        <div>
          <span class="roomName">{{ item.writer }}</span>
          <span class="roomName">{{ item.roomName }}</span>
          <div class="gradeBox">
            <i v-for="gradeitem in gradeCheck(item.grade)" :key="gradeitem" :class="gradeitem.star" />
          </div>
          <p class="Reviewcontent">
            {{ item.content }}
          </p>
          <div class="dateBox">
            <p class="date">
              {{ dateCheck(item.lastModifiedDate) }}
            </p>
          </div>
        </div>
      </div>  
    </template>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="spaceQnAListCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
// import { ReviewDummy } from '@/utils/dummy/QnAReviewdummy.js'
import {spaceReviewList} from '@/api/review.js'
export default {
  data(){
    return {
      ReviewList: [],
      Reviewtype:'문의종류',
      ReviewtypeData: [
        {'name':'예약','value':'RESERVE'},
        {'name':'결제','value':'PAY'},
        {'name':'이용','value':'USING'},
      ],
      deleteReviewNum:'후기삭제',
      updateReviewNum:'후기수정',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.spaceReviewListCall(this.pageNowNum)
  },
  methods: {
    async spaceReviewListCall(pageNowNum){
      if (!pageNowNum){
        pageNowNum = this.pageNowNum
      } else {
        this.pageNowNum = pageNowNum
      }
      const spaceId = this.$route.params.spaceId
      try {
        const response = await spaceReviewList(pageNowNum-1, spaceId)
        this.ReviewList = response.data.data
        this.pageTotal = response.data.count
        this.paging(this.pageNowNum)
      } catch (error){
        console.log(error)
      }
    },
    // 페이징
    paging(pageNowNum){
      this.pageData = []
      this.pageNowNum = pageNowNum
      let total = this.pageTotal
      if (total%5 != 0){
        this.pageTotal = parseInt(total/5)+1
      } else { 
        this.pageTotal = total/5
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
      if (this.pageTotal == 1){
        return
      } else if (value == 'next'){
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
      this.reservationDataCall(this.pageNowNum)
    },
    gradeCheck(grade){
      let starData = []
      for (let i = 1; i < 6; i++){
        if (i <= grade){
          starData.push({'star':'fa-solid fa-star fullstar'})
        } else {
          starData.push({'star':'fa-regular fa-star'})
        }
      }
      return starData
    },
    spacetypeCheck(value){
      if (value == 'DESK'){
        return '데스크'
      } else if (value == 'OFFICE'){
        return '오피스'
      } else {
        return '회의실'
      }
    },
    dateCheck(value){
      const date = value.slice(0,10)
      const time = value.slice(11,16)
      return `${date} ${time}`
    },
  },
}
</script>

<style scoped>
.ReviewContainer{
  position: relative;
  margin-left: 1vw;
}
/* 후기리스트 출력 */
.Reviewitem{
  position: relative;
  border-bottom: 2px solid gray;
  width: 33vw;
  padding: 1vh 0.5vw;
}
.roomName{
  padding-left: 0.2vw;
  color: rgb(65, 65, 65);
  font-weight: bold;
  font-size: 0.9rem;
}
.date{
  font-size: 0.7rem;
  font-weight: bold;
  color: rgb(97, 97, 97);
}
.Reviewcontent{
  font-size: 0.8rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.521);
  margin-left: 0.5vw;
  margin-top: 1vh;
}
.dateBox{
  top: 2vh;
  right: 0.5vw;
  position: absolute;
  text-align: right;
}
.fullstar{
  color: rgba(248, 248, 27, 0.5);
}
.UpdateDeleteBtn i {
  margin-left: 0.5vw;
  margin-bottom: 0.5vh;
}
.fa-pen-to-square:hover{
  color: blue
}
.fa-trash:hover{
  color: red;
}
.pageNumber{
  width: 34vw;
  text-align: center;
}
.pageNumber span{
  margin: 0.5vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
.noReview{
  margin-left: 13.5vw;
  font-weight: bold;
}
</style>