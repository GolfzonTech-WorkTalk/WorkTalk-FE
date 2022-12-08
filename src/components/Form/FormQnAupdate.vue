<template>
  <div>
    <div class="QnABox">
      <span class="QnAtypelabel" :class="type">{{ typeCheck(type) }}</span>
      <p class="contentCount" :class="(content.length > 100)?'warning':''">
        {{ content.length }}/100자
      </p>
      <template v-if="userType == 'ROLE_USER'">
        <textarea v-model="content" class="QnAcontent" :placeholder="content" />
        <span class="QnAbtn QnABtnClose" @click="emitClose">닫기</span>
        <span class="QnAbtn QnABtnSubmit" @click="QnAupdate">작성</span>
      </template>
      <template v-else>
        <textarea v-model="qnacomment" class="QnAcontent" :placeholder="qnacomment" />
        <span class="QnAbtn QnABtnClose" @click="emitClose">닫기</span>
        <span class="QnAbtn QnABtnSubmit" @click="QnAcommentupdate">작성</span>
      </template>
    </div>
  </div>
</template>

<script>
import {qnaUpdata, qnacommentUpdate} from '@/api/QnA.js'
export default {
  props: {
    item: {
      type:Object,
      required: true,
    },
  },
  emits: [ 'qnaupdate:close' ],
  data(){
    return {
      // 제출데이터
      spaceId : '',
      type : '',
      content : '',
      qnaId: '',
      qnacomment: '',
      // userType
      userType: '',
    }
  },
  created(){
    console.log(this.item)
    this.spaceId = this.item.spaceId
    this.type = this.item.type
    this.content = this.item.content
    this.qnaId = this.item.qnaId
    this.qnacomment = this.item.qnacomment
    this.userType = this.$store.state.role
  },
  methods: {
    emitClose(){
      this.$emit('qnaupdate:close')
    },
    typeCheck(value){
      if (value == 'RESERVE'){
        return '예약'
      } else if (value == 'PAY'){
        return '결제'
      } else if (value == 'USING'){
        return '이용'
      }
    },
    async QnAupdate(){
      const qnaUpdataData = {
        'qnaId': this.qnaId,
        'type': this.type,
        'content': this.content,
      }
      console.log(qnaUpdataData)
      try {
        let response = await qnaUpdata(this.qnaId, qnaUpdataData)
        console.log(response)
      } catch (error){
        console.log(error)
      }
    },
    async QnAcommentupdate(){
      const qnaUpdataData = {
        'qnaId': this.qnaId,
        'type': this.type,
        'qnacomment': this.qnacomment,
      }
      console.log(qnaUpdataData)
      try {
        let response = await qnacommentUpdate(this.qnaId, qnaUpdataData)
        console.log(response)
        this.$emit('qnaupdate:close')
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
  top: 0;
  right: 1vw;
  z-index: 1;
}
.QnAcontent{
  margin: 1vh 0;
  width: 29vw;
  height: 15vh;
  resize: none;
  padding: 1vh 0.5vw;
}
/* 버튼 */
.QnAbtn{
  border: 1px solid gray;
  border-radius: 10px;
  padding: 0 0.5vw;
  float: right;
  margin-left: 1vw;
  cursor: pointer;
}
.QnABtnClose:hover{
  background: rgb(165, 165, 165);
  color: white;
}
.QnABtnSubmit:hover{
  color: white;
  background: rgb(92, 92, 189);
}
/* 텍스트 박스 */
.contentCount{
  float: right;
}
.warning{
  color: red;
}
/* 라벨 */
.QnAtypelabel{
  border-radius: 10px;
  padding: 0 0.5vw;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  color: white;
  float: left;
}
.RESERVE{
  background: rgb(172, 223, 172);
}
.PAY{
  background: rgb(131, 131, 226)
}
.USING{
  background: rgb(224, 182, 135);
}
</style>