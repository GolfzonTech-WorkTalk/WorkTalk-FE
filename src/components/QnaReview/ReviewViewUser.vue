<template>
  <div class="ReviewContainer">
    <div v-if="deleteReviewNum != '후기삭제' || updateReviewNum != '후기수정'" class="backgroundReview" @click="deleteReviewCancel" />
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
          <i class="fa-solid fa-pen-to-square" @click="updateReview(item)" />
          <i class="fa-solid fa-trash" @click="deleteReview(item)" />
          <template v-if="deleteReviewNum == item.reviewId">
            <div class="deleteBox">
              <p>해당 후기를 삭제하시겠습니까?</p>
              <span class="deleteBtn deleteReviewDo" @click="deleteReviewSubmit(item)">삭 제</span>
              <span class="deleteBtn deleteReviewCancel" @click="deleteReviewCancel">취 소</span>
            </div>
          </template>
          <template v-if="updateReviewNum == item.reviewId">
            <form-review-update :item="item" @reviewupdate:close="deleteReviewCancel" />
          </template>
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
import FormReviewUpdate from '@/components/Form/FormReviewUpdate.vue'
import { ReviewDummy } from '@/utils/dummy/QnAReviewdummy.js'
export default {
  components: {
    FormReviewUpdate,
  },
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
      testRange:'',
    }
  },
  created(){
    this.ReviewList = ReviewDummy
  },
  methods: {
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
  padding: 2vw;
  width: 36vw;
  height: 87vh;
  background: white;
  overflow-y: scroll;
}
.ReviewContainer::-webkit-scrollbar{
  display: none;
}
/* 정렬 */
.SortReviewtypeBox{
  margin-bottom: 5vh;
}
.SortReviewtype{
  width: 6vw;
  float: right;
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
/* 삭제 창 */
.fullstar{
  color: rgba(248, 248, 27, 0.5);
}
.deleteBox{
  position: absolute;
  text-align: center;
  top: 0;
  left: -22vw;
  background: white;
  width: 20vw;
  border-radius: 10px;
  padding: 1vh 1vw;
  z-index: 2;
}
.backgroundReview{
  position: absolute;
  background: rgba(0, 0, 0, 0.212);
  top: 0;
  left: 0;
  width: 40vw;
  height: 92.5vh;
  z-index: 1;
}
.deleteBtn{
  border: 1px solid gray;
  border-radius: 10px;
  font-size: 0.8rem;
  padding: 0 0.5vw;
}
.deleteBox p{
  margin-bottom: 1vh;
}
.deleteReviewDo:hover{
  background: rgb(223, 69, 69);
  color: white;
}
.deleteReviewCancel{
  margin-left: 0.5vw;
}
.deleteReviewCancel:hover{
  background: rgb(165, 165, 165);
  color: white;
}
</style>