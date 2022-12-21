<template>
  <div class="ReviewContainer">
    <div v-if="deleteReviewNum != '후기삭제' || updateReviewNum != '후기수정'" class="backgroundReview" @click="deleteReviewCancel" />
    <div v-for="item in ReviewList" :key="item" class="Reviewitem">
      <div>
        <span class="spacetypelabel" :class="item.roomType">{{ spacetypeCheck(item.roomType) }}</span>
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
            <form-review-update :item="item" @reviewupdate:close="deleteReviewCancel" @reviewupdate:submit="reviewListCall" />
          </template>
          <p class="date">
            {{ dateCheck(item.lastModifiedDate) }}
          </p>
        </div>
      </div>
    </div>
    <div class="pageNumber">
      <span><i class="fa-solid fa-chevron-left monthMoveBtn" @click="pageMove('pre')" /></span>
      <span v-for="num in pageData" :key="num" :class="num.class" @click="reservationDataCall(num.value)">{{ num.value }}</span>
      <span><i class="fa-solid fa-chevron-right" @click="pageMove('next')" /></span>
    </div>
  </div>
</template>

<script>
import {mypageReviewList, reviewDelete} from '@/api/review.js'
import FormReviewUpdate from '@/components/Form/FormReviewUpdate.vue'
export default {
  components: {
    FormReviewUpdate,
  },
  data(){
    return {
      ReviewList: [],
      Reviewtype:'문의종류',
      ReviewtypeData: [
        {'name':'전 체','value':''},
        {'name':'오피스','value':'1'},
        {'name':'데스크','value':'2'},
        {'name':'회의실','value':'3'},
      ],
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
  },
  methods: {
    async reviewListCall(pageNowNum){
      const response = await mypageReviewList(pageNowNum)
      console.log(response)
      this.ReviewList = response.data.data
      this.pageTotal =  response.data.count
      this.paging(pageNowNum)
      this.$store.dispatch('SPINNERVIEW', false)
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
      let year = dateData[0]
      let month = dateData[1]
      let date = dateData[2]
      let hour = dateData[3]
      let minute = dateData[4]
      if (hour < 10){
        hour = '0'+hour
      }
      if (minute < 10){
        minute = '0'+minute
      }
      return year+'-'+month+'-'+date+' '+hour+':'+minute
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
        let response = await reviewDelete(item.reviewId)
        console.log(response)
        this.deleteReviewCancel()
        this.reviewListCall()
      } catch (error){
        console.log(error)
      }
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
      this.reservationDataCall(this.pageNowNum)
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
</style>