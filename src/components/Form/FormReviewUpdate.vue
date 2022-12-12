<template>
  <div class="reviewBox">
    <form @submit.prevent="reviewSubmitCheck">
      <div class="gradeBox">
        <span>평점 : </span>
        <i v-for="gradeitem in starData" :key="gradeitem" :class="gradeitem.star" @click="gradeSelect(gradeitem.value)" />
      </div>
      <span class="contentLength" :class="(content.length >= 100)?'warning':''">{{ content.length }}/100자</span>
      <textarea v-model="content" class="reviewContent" cols="30" rows="5" placeholder="후기내용 작성" />
      <!-- <input type="file" multiple> -->
      <span class="reviewBtn reviewBtnClose" @click="$emit('reviewupdate:close')">닫 기</span>
      <label for="submitButton" class="reviewBtn reviewBtnSubmit">작 성</label>
      <button id="submitButton" hidden />
    </form>
  </div>
</template>

<script>
import {reviewUpdata} from '@/api/review.js'
export default {
  props: {
    item: {
      type:Object,
      required: true,
    },
  },
  emits: ['reviewupdate:close', 'reviewupdate:submit'],
  data(){
    return {
      reviewId:'',
      content:'',
      grade:'',
      starData: [],
    }
  },
  created(){
    // console.log(this.item)
    this.reviewId = this.item.reviewId
    this.content = this.item.content
    this.grade = this.item.grade
    this.gradeCheck(this.grade)
  },
  methods:{
    gradeCheck(grade){
      this.starData = []
      for (let i = 1; i < 6; i++){
        if (i <= grade){
          this.starData.push({'star':'fa-solid fa-star fullstar','value':i})
        } else {
          this.starData.push({'star':'fa-regular fa-star','value':i})
        }
      }
    },
    gradeSelect(grade){
      this.grade = grade
      this.gradeCheck(grade)
    },
    reviewSubmitCheck(){
      if (!this.content){
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
      let reviewData = {
        'grade':this.grade,
        'content':this.content,
      }
      console.log(reviewData)
      try {
        let response = await reviewUpdata(this.reviewId, reviewData)
        console.log(response)
        this.$emit('reviewupdate:submit')
        this.$emit('reviewupdate:close')
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.reviewBox{
  position: absolute;
  background: white;
  right: 2vw;
  top: 0;
  border: 3px solid gray;
  width: 30vw;
  height: 18vh;
  padding: 1vh 0.5vw;
  z-index: 1;
}
.reviewContent{
  width: 30vw;
  resize: none;
}
.gradeBox{
  margin-bottom: 1vh;
  float: left;
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
.warning{
  color: red;
}
.reviewBtnClose:hover{
  background: rgb(165, 165, 165);
  color: white;
}
.reviewBtnSubmit:hover{
  color: white;
  background: rgb(92, 92, 189);
}
.contentLength{
  float: right;
}
</style>