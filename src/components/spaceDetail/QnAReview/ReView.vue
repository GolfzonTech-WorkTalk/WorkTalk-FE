<template>
  <div class="ReviewContainer">
    <div v-for="item in ReviewList" :key="item" class="Reviewitem">
      <div>
        <span class="spacetypelabel">{{ item.memberId }}</span>
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
      testRange:'',
    }
  },
  created(){
    this.spaceReviewListCall()
  },
  methods: {
    async spaceReviewListCall(){
      const spaceId = this.$route.params.spaceId
      try {
        const response = await spaceReviewList(spaceId)
        // console.log(response)
        this.ReviewList = response.data
      } catch (error){
        console.log(error)
      }
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
</style>