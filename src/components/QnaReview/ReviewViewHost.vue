<template>
  <div class="ReviewContainer">
    <div v-if="deleteReviewNum != '후기삭제' || updateReviewNum != '후기수정'" class="backgroundReview" @click="deleteReviewCancel" />
    <div class="ReviewTitle">
      <select v-model="sortSpace" class="sortBox" @change="ReviewDataCall()">
        <option value="" hidden>
          공간종류
        </option>
        <option v-for="item in sortSpaceData" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div v-for="item in ReviewList" :key="item" class="Reviewitem">
      <div>
        <span class="spacetypelabel" :class="item.spacetype">{{ spacetypeCheck(item.spacetype) }}</span>
        <span class="spaceName">{{ item.spaceName }}</span>
        <span class="roomName">{{ item.roomName }}</span>
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
  </div>
</template>

<script>
import {reviewDelete} from '@/api/review.js'
import { ReviewDummy } from '@/utils/dummy/QnAReviewdummy.js'
export default {
  data(){
    return {
      ReviewList: [],
      sortSpace:'',
      sortSpaceData:[
        // api로 받아야 함...
        {'name':'전 체','value':''},
        {'name':'데스크','value':'DESK'},
        {'name':'오피스','value':'OFFICE'},
      ],
      Reviewtype:'문의종류',
      deleteReviewNum:'후기삭제',
      updateReviewNum:'후기수정',
      testRange:'',
    }
  },
  created(){
    this.reviewListCall()
  },
  methods: {
    async reviewListCall(){
      const response = await ReviewDummy
      this.ReviewList = response
      this.$store.dispatch('SPINNERVIEW', false)
    },
    //데이터 API로 불러오기
    async ReviewDataCall(pageNowNum){
      let sortSpace
      if (this.sortSpace != ''){
        sortSpace = this.sortSpace
      }
      console.log(pageNowNum, sortSpace)
      this.reservationData = ReviewDummy
      /*
      let response = await reservationData(pageNowNum)
      this.reservationData = response.data
      */
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
    dateCheck(value){
      let date = value.slice(0,10)
      let time = value.slice(11,16)
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
    async deleteReviewSubmit(item){
      try {
        let response = await reviewDelete(item.qnaId)
        console.log(response)
      } catch (error){
        console.log(error)
      }
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
</style>