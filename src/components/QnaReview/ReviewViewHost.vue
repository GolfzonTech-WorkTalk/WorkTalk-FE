<template>
  <div class="ReviewContainer">
    <div v-if="deleteReviewNum != '후기삭제' || updateReviewNum != '후기수정'" class="backgroundReview" @click="deleteReviewCancel" />
    <div class="ReviewTitle">
      <select v-model="spaceName" class="sortBox" @change="reviewListCall('1')">
        <option value="" hidden>
          공간명
        </option>
        <option v-for="item in spaceNameData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div v-for="item in ReviewList" :key="item" class="Reviewitem">
      <div>
        <span class="spacetypelabel" :class="item.roomType">{{ spacetypeCheck(item.roomType) }}</span>
        <span class="spaceName">{{ item.spaceName }}</span>
        <span class="roomName">{{ item.roomName }}</span>
        <p class="Reviewcontent">
          {{ item.writer }}
        </p>
        <div class="gradeBox">
          <i v-for="gradeitem in gradeCheck(item.grade)" :key="gradeitem" :class="gradeitem.star" />
        </div>
        <p class="Reviewcontent">
          {{ item.content }}
        </p>
        <div class="UpdateDeleteBtn">
          <p class="date">
            {{ dateCheck(item.lastModifiedDate) }}
          </p>
        </div>
      </div>
    </div>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="reviewListCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
import {reviewSpaceName, mypageReviewListHost} from '@/api/review.js'
export default {
  data(){
    return {
      ReviewList: [],
      spaceName:'',
      spaceNameData:[
        // api로 받아야 함...
        {'name':'전 체','value':''},
      ],
      Reviewtype:'문의종류',
      deleteReviewNum:'후기삭제',
      updateReviewNum:'후기수정',
      testRange:'',
      // 페이지 관리데이터
      pageStartNum: 1,
      pageNowNum:1,
      pageData:[],
      pageTotal:'',
    }
  },
  created(){
    this.reviewListCall(this.pageNowNum)
    this.reviewSpaceNameCall()
  },
  methods: {
    async reviewListCall(pageNowNum){
      let spaceName = this.spaceName
      // console.log(pageNowNum, spaceName)
      const response = await mypageReviewListHost(pageNowNum-1,spaceName)
      // console.log(response)
      this.ReviewList = response.data.data
      this.pageTotal =  response.data.count
      this.paging(pageNowNum)
      this.$store.dispatch('SPINNERVIEW', false)
    },
    async reviewSpaceNameCall(){
      try {
        const response = await reviewSpaceName()
        console.log(response)
        for (let i = 0; i < response.data.length; i++){
          this.spaceNameData = [
            ...this.spaceNameData,
            {'name':response.data[i].spaceName,'value':response.data[i].spaceName},
          ]
          console.log()
        }
      } catch (error){
        console.log(error)
      }
    },
    testRangeCheck(value){
      console.log(value)
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
    dateCheck(dateData){
      const date = dateData.slice(0,10)
      const time = dateData.slice(11,16)
      return `${date} ${time}`
    },
    deleteReview(item){
      this.deleteReviewNum = item.reviewId
    },
    updateReview(item){
      this.updateReviewNum = item.reviewId
    },
    deleteReviewCancel(){
      this.deleteReviewNum = '후기삭제'
      this.updateReviewNum = '후기수정'
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
      this.reviewListCall(this.pageNowNum)
    },
  },
}
</script>

<style scoped>
.ReviewContainer{
  position: relative;
  padding: 0.5vh 2vw;
  width: 36vw;
  height: 87vh;
  background: white;
  overflow-y: scroll;
}
.ReviewContainer::-webkit-scrollbar{
  display: none;
}
/* 정렬 */
.ReviewTitle{
  width: 36vw;
  font-size: 2rem;
  font-weight: bold;
  text-align: right;
  margin: 2vh 0;
}
.sortBox{
  width: 8vw;
  letter-spacing: 0.3rem;
  font-size: 1.1rem;
  font-weight: bold;
}
/* 후기리스트 출력 */
.Reviewitem{
  position: relative;
  border: 2px solid gray;
  border-radius: 10px;
  width: 35vw;
  padding: 2vh 0.5vw;
  margin-bottom: 1vh;
}
.spaceName{
  font-weight: bold;
  margin-right: 0.2vw;
}
.roomName{
  border-left: 2px solid gray;
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
.UpdateDeleteBtn{
  top: 2vh;
  right: 0.5vw;
  position: absolute;
  text-align: right;
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
.spacetypelabel{
  border: 1px solid gray;
  border-radius: 10px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  width: 4vw;
  padding: 0 0.5vw;
  margin-right: 0.5vw;
}
.DESK{
  background: rgba(218, 166, 54, 0.527);
}
.OFFICE{
  background: rgba(4, 90, 4, 0.527);
}
.MEETING4, .MEETING6, .MEETING8, .MEETING20{
  background: rgba(9, 44, 139, 0.527);
}
.fullstar{
  color: rgba(248, 248, 27, 0.5);
}
.pageNumber{
  width: 36vw;
  text-align: center;
}
.pageNumber span{
  margin: 1vw;
  cursor: pointer;
}
.pageNowNum{
  font-weight: bold;
  color: blue;
}
.gradeBox{
  position: absolute;
  right: 0;
  top: 5vh;
}
</style>