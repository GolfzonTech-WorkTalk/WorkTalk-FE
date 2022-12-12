<template>
  <div>
    <div class="QnABox">
      <select v-model="type" class="QnAtype">
        <option value="문의종류" hidden>
          문의종류
        </option>
        <option v-for="item in typeData" id="" :key="item" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <p class="contentCount" :class="(content.length > 100)?'warning':''">
        {{ content.length }}/100자
      </p>
      <textarea v-model="content" class="QnAcontent" placeholder="문의내용을 작성해주세요." />
      <span class="QnAbtn" @click="emitClose(false)">닫기</span>
      <span class="QnAbtn" @click="QnACreate">작성</span>
    </div>
    <div class="background" @click="emitClose(false)" />
  </div>
</template>

<script>
import {qnaCreate} from '@/api/QnA.js'
export default {
  emits: [ 'qna:open' ],
  data(){
    return {
      typeData: [
        {'name':'예약관련','value':'RESERVE'},
        {'name':'결제관련','value':'PAY'},
        {'name':'이용관련','value':'USE'},
      ],
      // 제출데이터
      spaceId : this.$route.params.spaceId,
      type : '문의종류',
      content : '',
    }
  },
  methods: {
    emitClose(value){
      this.$emit('qna:open', value)
    },
    async QnACreate(){
      const qnaData = {
        'spaceId': this.spaceId,
        'type': this.type,
        'content': this.content,
      }
      console.log(qnaData)
      try {
        let response = await qnaCreate(qnaData)
        console.log(response)
        this.emitClose()
      } catch (error){
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.QnABox{
  position: absolute;
  border: 1px solid gray;
  border-radius: 10px;
  background: white;
  padding: 2vh 1.5vw;
  width: 30vw;
  height: 26vh;
  top: 25%;
  left: 32%;
  z-index: 2;
}
.background{
  position: absolute;
  background: rgba(0, 0, 0, 0.356);
  top: 0;
  left: -10vw;
  width: 110vw;
  height: 110vh;
  z-index: 1;
}
.QnAcontent{
  margin: 1vh 0;
  width: 29vw;
  height: 15vh;
  resize: none;
  padding: 1vh 0.5vw;
}
.QnAbtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  float: right;
  margin-left: 1vw;
  cursor: pointer;
}
.QnAbtn:hover{
  background: rgb(92, 92, 189);
  color: white;
}
.contentCount{
  float: right;
}
.warning{
  color: red;
}
</style>