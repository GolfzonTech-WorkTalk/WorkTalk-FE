<template>
  <div class="reviewBox">
    <form @submit.prevent="reviewSubmitCheck">
      <div class="gradeBox">
        <span>평점 : </span>
        <i v-for="item in starData" :key="item" :class="`fa-${item.star} fa-star`" @click="gradeSelect(item.grade)" />
        <span :class="(reviewContent.length >= 100)?'warning':''">{{ reviewContent.length }}/100자</span>
      </div>
      <textarea v-model="reviewContent" class="reviewContent" cols="30" rows="5" placeholder="후기내용 작성" />
      <!-- <input type="file" multiple> -->
      <span class="reviewBtn" @click="$emits('box-close:box-close-click')">닫 기</span>
      <label for="submitButton" class="reviewBtn">작 성</label>
      <button id="submitButton" hidden />
    </form>
  </div>
</template>

<script>
// import {reviewCreate} from '@/api/review.js'
export default {
  props: {
    reserveId: {
      type: Number,
      required: true,
    },
  },
  data(){
    return {
      reviewContent:'',
      grade:'',
      starData: [],
    }
  },
  created(){
    this.starDataCreate()
  },
  methods:{
    starDataCreate(){
      this.starData = []
      for (let i = 1; i < 6; i++){
        if (i <= this.grade){
          this.starData.push({'star':'solid fullstar','grade':i})
        } else {
          this.starData.push({'star':'regular','grade':i})
        }
      }
    },
    gradeSelect(grade){
      this.grade = grade
      this.starDataCreate()
    },
    reviewSubmitCheck(){
      if (!this.reviewContent){
        let message = '내용을 작성해 주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else if (!this.grade){
        let message = '평점을 선택해 주세요.'
        this.$store.dispatch('MODALVIEWCLICK', true)
        this.$store.dispatch('MODALMESSAGE', message)
      } else {
        this.reviewSubmit()
      }
    },
    async reviewSubmit(){
      this.reviewSubmitCheck()
      let reviewData = {
        reviewContent:this.reviewContent,
        grade:this.grade,
        reserveId: this.reserveId,
      }
      console.log(reviewData)
      /*
      try {
        let response = await reviewCreate(reviewData)
        console.log(response)
      } catch (error){
        console.log(error)
      }
      */
    },
  },
}
</script>

<style scoped>
.reviewBox{
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  border: 3px solid gray;
  width: 30vw;
  height: 17vh;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.reviewContent{
  width: 30vw;
  resize: none;
}
.gradeBox{
  margin-bottom: 1vh;
}
.fullstar{
  color: yellow;
}
.reviewBtn{
  float: right;
  margin-left: 1vw;
  width: 4vw;
  border: 1px solid gray;
  border-radius: 10px;
  text-align: center;
}
.gradeBox span:last-child{
  float: right;
}
.warning{
  color: red;
}
</style>